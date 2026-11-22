import { Activity, Dumbbell, PersonStanding, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CategoryId, Difficulty } from "../types";

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const categories: CategoryInfo[] = [
  {
    id: "balance",
    label: "Équilibre",
    description: "Exercices qui peuvent aider à rester stable debout et à prévenir les chutes.",
    icon: Scale,
  },
  {
    id: "strength",
    label: "Renforcement",
    description: "Renforcer les muscles qui soutiennent le corps au quotidien.",
    icon: Dumbbell,
  },
  {
    id: "posture",
    label: "Posture",
    description: "Prendre conscience de son alignement, sans forcer.",
    icon: PersonStanding,
  },
  {
    id: "mobility",
    label: "Mobilité",
    description: "Entretenir la souplesse des articulations en douceur.",
    icon: Activity,
  },
];

export const difficultyLabel: Record<Difficulty, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

export function categoryLabel(id: CategoryId): string {
  return categories.find((c) => c.id === id)?.label ?? id;
}
