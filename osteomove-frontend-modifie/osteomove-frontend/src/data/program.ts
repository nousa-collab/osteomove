import type { PlanDay } from "../types";

// Programme illustratif. Ne constitue pas une prescription.
export const weeklyPlan: PlanDay[] = [
  { dayIndex: 1, label: "Lundi", category: "balance", minutes: 10, exerciseIds: ["bal-001", "bal-002"] },
  { dayIndex: 2, label: "Mardi", category: "strength", minutes: 15, exerciseIds: ["str-001", "str-002"] },
  {
    dayIndex: 3,
    label: "Mercredi",
    category: null,
    minutes: 0,
    exerciseIds: [],
    note: "Repos ou activité douce, par exemple une marche tranquille si vous vous sentez bien.",
  },
  { dayIndex: 4, label: "Jeudi", category: "posture", minutes: 10, exerciseIds: ["pos-001", "pos-002"] },
  { dayIndex: 5, label: "Vendredi", category: "balance", minutes: 10, exerciseIds: ["bal-003", "bal-001"] },
  { dayIndex: 6, label: "Samedi", category: "mobility", minutes: 10, exerciseIds: ["mob-001", "mob-002"] },
  { dayIndex: 0, label: "Dimanche", category: null, minutes: 0, exerciseIds: [], note: "Journée de repos." },
];
