import type { ActivityLog } from "../types";
import { exercises } from "./exercises";
import { KEYS, readStorage, writeStorage } from "../hooks/useLocalStorage";
import { toIsoDate } from "../lib/utils";

/** Données de démonstration : 14 jours d'activité plausible, pour que les graphiques soient parlants. */
export function buildDemoLogs(): ActivityLog[] {
  const logs: ActivityLog[] = [];
  const today = new Date();
  for (let daysBack = 13; daysBack >= 0; daysBack--) {
    const d = new Date(today);
    d.setDate(today.getDate() - daysBack);
    const weekday = d.getDay();
    if (weekday === 0 || weekday === 3) continue; // jours de repos
    if (daysBack % 5 === 4) continue; // journée sans séance
    const ex = exercises[(13 - daysBack) % exercises.length];
    logs.push({ exerciseId: ex.id, date: toIsoDate(d), durationMinutes: ex.durationMinutes });
  }
  return logs;
}

/** Initialise les données de démonstration une seule fois, lors de la première visite. */
export function seedIfNeeded(): void {
  if (readStorage<boolean>(KEYS.seeded, false)) return;
  writeStorage(KEYS.logs, buildDemoLogs());
  writeStorage(KEYS.seeded, true);
}
