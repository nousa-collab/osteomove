import { useState, useEffect, useRef, type FormEvent } from "react";
import { Activity, Calendar, Flame, Target, Timer } from "lucide-react";
import { exercises } from "../data/exercises";
import type { ActivityLog, Goals } from "../types";
import { ProgressChart } from "../components/ProgressChart";
import { StatCard } from "../components/StatCard";
import { Button, Card, Input } from "../components/ui";
import { useToast } from "../components/Toast";
import { KEYS, useLocalStorage } from "../hooks/useLocalStorage";
import { toIsoDate } from "../lib/utils";
import { apiRequest } from "../lib/api";

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function startOfWeek(date: Date): Date {
  const offset = (date.getDay() + 6) % 7; // lundi = 0
  const monday = new Date(date);
  monday.setDate(date.getDate() - offset);
  return monday;
}

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function ProgressPage() {
  const [logs, setLogs] = useLocalStorage<ActivityLog[]>(KEYS.logs, []);
  const [goals, setGoals] = useLocalStorage<Goals>(KEYS.goals, { weeklySessions: 4, weeklyMinutes: 60 });
  const [draft, setDraft] = useState<Goals>(goals);
  const toast = useToast();
  const [syncMessage, setSyncMessage] = useState("");
  const didLoadRemote = useRef(false);

  useEffect(() => {
    apiRequest<{ logs: ActivityLog[]; goals: Goals }>("/progress")
      .then((remote) => {
        const merged = [...remote.logs, ...logs].filter((log, index, all) => all.findIndex((item) => item.exerciseId === log.exerciseId && item.date === log.date) === index);
        setLogs(merged); setGoals(remote.goals); setDraft(remote.goals); setSyncMessage("Progression synchronisée avec votre compte.");
      })
      .catch(() => { /* Mode local disponible si l’utilisateur n’est pas connecté ou si l’API est indisponible. */ })
      .finally(() => { didLoadRemote.current = true; });
  }, []);

  useEffect(() => {
    if (!didLoadRemote.current) return;
    apiRequest<{ message: string }>("/progress", { method: "PUT", body: JSON.stringify({ logs, goals }) })
      .then(() => setSyncMessage("Progression synchronisée avec votre compte."))
      .catch(() => setSyncMessage("Mode local : connectez-vous pour synchroniser vos séances."));
  }, [logs, goals]);

  const today = new Date();
  const monday = startOfWeek(today);
  const weekDates = Array.from({ length: 7 }, (_, i) => toIsoDate(addDays(monday, i)));
  const weekLogs = logs.filter((l) => weekDates.includes(l.date));
  const sessionsThisWeek = weekLogs.length;
  const minutesThisWeek = weekLogs.reduce((sum, l) => sum + l.durationMinutes, 0);
  const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);

  // Série : jours consécutifs avec au moins une séance, en comptant aujourd'hui (ou hier si rien aujourd'hui).
  const activeDates = new Set(logs.map((l) => l.date));
  let streak = 0;
  const cursor = new Date(today);
  if (!activeDates.has(toIsoDate(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (activeDates.has(toIsoDate(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const weekBarData = weekDates.map((iso, i) => ({
    label: DAY_LABELS[i],
    value: weekLogs.filter((l) => l.date === iso).reduce((s, l) => s + l.durationMinutes, 0),
  }));

  const monthlyData = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - (5 - index), 1);
    const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, "0")}`;
    return {
      label: monthDate.toLocaleDateString("fr-FR", { month: "short" }),
      value: logs.filter((l) => l.date.startsWith(monthKey)).reduce((sum, l) => sum + l.durationMinutes, 0),
    };
  });

  const recent = [...logs].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 15);
  const titleOf = (id: string) => exercises.find((e) => e.id === id)?.title ?? "Exercice";

  const sessionsPct = Math.min(100, Math.round((sessionsThisWeek / Math.max(1, goals.weeklySessions)) * 100));
  const minutesPct = Math.min(100, Math.round((minutesThisWeek / Math.max(1, goals.weeklyMinutes)) * 100));

  const saveGoals = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGoals(draft);
    toast.show("Objectifs enregistrés.");
  };

  return (
    <div className="container-page flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">Mon suivi</h1>
        <p className="max-w-2xl text-lg text-ink/85">Consultez vos statistiques et vos objectifs. {syncMessage || "Vos données locales restent disponibles hors connexion."}</p>
      </header>

      <section aria-labelledby="stats-title" className="flex flex-col gap-4">
        <h2 id="stats-title" className="text-2xl font-semibold">Cette semaine</h2>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Calendar} label="Séances cette semaine" value={sessionsThisWeek} hint={`Objectif : ${goals.weeklySessions}`} />
          <StatCard icon={Timer} label="Minutes cette semaine" value={minutesThisWeek} hint={`Objectif : ${goals.weeklyMinutes} min`} />
          <StatCard icon={Flame} label="Série en cours" value={`${streak} j`} hint="Jours consécutifs avec une séance" />
          <StatCard icon={Activity} label="Minutes au total" value={totalMinutes} />
        </div>
      </section>

      <section aria-labelledby="charts-title" className="grid gap-6 lg:grid-cols-2">
        <h2 id="charts-title" className="sr-only">Graphiques d'activité</h2>
        <Card>
          <h3 className="mb-4 text-xl font-semibold">Activité de la semaine</h3>
          <ProgressChart type="bar" data={weekBarData} seriesName="Minutes" ariaLabel="Minutes d'activité par jour cette semaine" />
        </Card>
        <Card>
          <h3 className="mb-4 text-xl font-semibold">Activité sur 6 mois</h3>
          <ProgressChart type="line" data={monthlyData} seriesName="Minutes" ariaLabel="Minutes d'activité par mois sur six mois" />
        </Card>
      </section>

      <section aria-labelledby="goals-title" className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 id="goals-title" className="mb-4 flex items-center gap-2 text-xl font-semibold">
            <Target className="h-6 w-6 text-primary-dark" aria-hidden="true" />
            Mes objectifs
          </h2>
          <div className="mb-6 flex flex-col gap-5">
            <ProgressBar label="Séances" value={sessionsThisWeek} target={goals.weeklySessions} pct={sessionsPct} />
            <ProgressBar label="Minutes" value={minutesThisWeek} target={goals.weeklyMinutes} pct={minutesPct} />
          </div>
          <form onSubmit={saveGoals} className="grid gap-4 sm:grid-cols-2">
            <Input
              id="goal-sessions"
              label="Séances par semaine"
              type="number"
              min={1}
              max={7}
              value={draft.weeklySessions}
              onChange={(e) => setDraft({ ...draft, weeklySessions: Number(e.target.value) })}
            />
            <Input
              id="goal-minutes"
              label="Minutes par semaine"
              type="number"
              min={10}
              max={300}
              step={5}
              value={draft.weeklyMinutes}
              onChange={(e) => setDraft({ ...draft, weeklyMinutes: Number(e.target.value) })}
            />
            <div className="sm:col-span-2">
              <Button type="submit">Enregistrer mes objectifs</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold">Historique récent</h2>
          {recent.length === 0 ? (
            <p className="text-ink/85">
              Aucune séance pour le moment. Marquez un exercice comme fait dans « Mon programme » pour le voir ici.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left">
                <caption className="sr-only">Dernières séances enregistrées</caption>
                <thead>
                  <tr className="border-b border-ink/20">
                    <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Exercice</th>
                    <th scope="col" className="py-3 font-semibold">Durée</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((l, i) => (
                    <tr key={`${l.date}-${l.exerciseId}-${i}`} className="border-b border-secondary">
                      <td className="py-3 pr-4">{new Date(`${l.date}T12:00:00`).toLocaleDateString("fr-FR")}</td>
                      <td className="py-3 pr-4">{titleOf(l.exerciseId)}</td>
                      <td className="py-3">{l.durationMinutes} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function ProgressBar({ label, value, target, pct }: { label: string; value: number; target: number; pct: number }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-base">
        <span className="font-medium">{label}</span>
        <span>
          {value} / {target}
        </span>
      </div>
      <div
        role="progressbar"
        aria-label={`${label} : ${value} sur ${target}`}
        aria-valuemin={0}
        aria-valuemax={target}
        aria-valuenow={value}
        className="h-3 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div className="h-full rounded-full bg-primary-dark" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
