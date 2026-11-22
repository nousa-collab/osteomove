import { useState } from "react";
import { CheckCircle2, Clock, Moon } from "lucide-react";
import { weeklyPlan } from "../data/program";
import { exercises } from "../data/exercises";
import { categoryLabel } from "../data/categories";
import type { ActivityLog, Exercise } from "../types";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";
import { VideoPlayer } from "../components/VideoPlayer";
import { Modal } from "../components/Modal";
import { Badge, Button, Card } from "../components/ui";
import { useToast } from "../components/Toast";
import { KEYS, useLocalStorage } from "../hooks/useLocalStorage";
import { toIsoDate } from "../lib/utils";

// Affichage à partir de lundi.
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

export default function ProgramPage() {
  const [logs, setLogs] = useLocalStorage<ActivityLog[]>(KEYS.logs, []);
  const [pending, setPending] = useState<Exercise | null>(null);
  const toast = useToast();

  const now = new Date();
  const todayIso = toIsoDate(now);
  const todayIndex = now.getDay();

  const doneToday = (exerciseId: string) => logs.some((l) => l.exerciseId === exerciseId && l.date === todayIso);

  const confirmDone = () => {
    if (!pending) return;
    setLogs([...logs, { exerciseId: pending.id, date: todayIso, durationMinutes: pending.durationMinutes }]);
    toast.show(`Séance notée : ${pending.title}.`);
    setPending(null);
  };

  return (
    <div className="container-page flex flex-col gap-8 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">Mon programme</h1>
        <p className="max-w-2xl text-lg text-ink/85">Une semaine type, pour vous donner un repère.</p>
      </header>

      <MedicalDisclaimer variant="warning">
        <p className="font-semibold">Programme illustratif.</p>
        <p className="mt-1">
          Ce programme est illustratif. Ne commencez aucun exercice sans l'accord d'un professionnel de santé. Arrêtez
          immédiatement en cas de douleur.
        </p>
      </MedicalDisclaimer>

      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {WEEK_ORDER.map((dayIndex) => {
          const day = weeklyPlan.find((d) => d.dayIndex === dayIndex);
          if (!day) return null;
          const isToday = dayIndex === todayIndex;
          return (
            <li key={day.dayIndex}>
              <Card className={isToday ? "border-2 border-primary" : ""}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold">{day.label}</h2>
                  {isToday && <Badge variant="teal">Aujourd'hui</Badge>}
                </div>

                {day.category === null ? (
                  <p className="flex items-start gap-3 text-ink/85">
                    <Moon className="mt-1 h-5 w-5 shrink-0" aria-hidden="true" />
                    <span>{day.note}</span>
                  </p>
                ) : (
                  <>
                    <p className="mb-4 flex items-center gap-2 text-ink/85">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                      {categoryLabel(day.category)}, environ {day.minutes} min
                    </p>
                    <ul className="flex flex-col gap-3">
                      {day.exerciseIds.map((id) => {
                        const ex = exercises.find((e) => e.id === id);
                        if (!ex) return null;
                        const done = doneToday(ex.id);
                        return (
                          <li key={ex.id} className="rounded-xl bg-page p-4">
                            <div className="mb-3 flex items-center gap-3">
                              <VideoPlayer
                                variant="thumb"
                                title={ex.title}
                                category={ex.category}
                                durationMinutes={ex.durationMinutes}
                                videoUrl={ex.videoUrl}
                                approved={ex.approvedByProfessional}
                              />
                              <p className="font-medium">{ex.title}</p>
                            </div>
                            {done && isToday ? (
                              <p className="flex items-center gap-2 font-semibold text-primary-dark">
                                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                                Fait aujourd'hui
                              </p>
                            ) : (
                              <Button
                                variant="outline"
                                className="w-full"
                                disabled={!isToday}
                                onClick={() => setPending(ex)}
                                aria-label={`Marquer comme fait : ${ex.title}`}
                              >
                                {isToday ? "Marquer comme fait" : "Disponible le jour même"}
                              </Button>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </Card>
            </li>
          );
        })}
      </ul>

      <Modal open={pending !== null} onClose={() => setPending(null)} title="Confirmer la séance">
        <div className="flex flex-col gap-6">
          <p className="text-lg">
            Avez-vous réalisé cet exercice sans douleur ? Si vous avez ressenti une douleur, ne validez pas et consultez
            un professionnel.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setPending(null)}>
              Non, je ne valide pas
            </Button>
            <Button onClick={confirmDone}>Oui, sans douleur</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
