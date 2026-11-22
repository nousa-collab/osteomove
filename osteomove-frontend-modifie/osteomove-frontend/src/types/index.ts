export type CategoryId = "balance" | "strength" | "posture" | "mobility";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface Exercise {
  id: string;
  title: string;
  category: CategoryId;
  description: string;
  videoUrl: string;
  durationMinutes: number;
  difficulty: Difficulty;
  equipment: string[];
  instructions: string[];
  contraindications: string[];
  approvedByProfessional: boolean;
  safetyNote: string;
}

export interface Video {
  id: string;
  exerciseId: string; // exercice démontré (doit exister dans exercises.ts)
  description: string;
}

export interface PlanDay {
  dayIndex: number; // valeur de Date.getDay() : 0 = dimanche, 1 = lundi, ...
  label: string;
  category: CategoryId | null;
  minutes: number;
  exerciseIds: string[];
  note?: string;
}

export interface ActivityLog {
  exerciseId: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
}

export interface UserAccount {
  name: string;
  email: string;
}

export interface Profile {
  name: string;
  email: string;
  ageRange: string;
  language: "fr" | "ar";
}

export interface Goals {
  weeklySessions: number;
  weeklyMinutes: number;
}

export interface EducationArticle {
  id: string;
  title: string;
  summary: string;
  paragraphs: string[];
}
