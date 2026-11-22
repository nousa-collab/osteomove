import type { Video } from "../types";

// Une vidéo de démonstration par exercice validé (3 par spécialité).
// Titre, spécialité, durée et URL viennent de l'exercice lié (exercises.ts).
export const videos: Video[] = [
  { id: "vid-bal-01", exerciseId: "bal-001", description: "Démonstration du transfert de poids d'un pied à l'autre, mains sur un appui stable." },
  { id: "vid-bal-02", exerciseId: "bal-002", description: "Démonstration de la position sur un pied, avec appui à portée de main." },
  { id: "vid-bal-03", exerciseId: "bal-003", description: "Démonstration de la marche en ligne droite, le long d'un mur ou d'un plan de travail." },
  { id: "vid-str-01", exerciseId: "str-001", description: "Démonstration de l'extension des genoux en position assise, lente et contrôlée." },
  { id: "vid-str-02", exerciseId: "str-002", description: "Démonstration de la flexion des biceps assis, avec un élastique de résistance légère." },
  { id: "vid-str-03", exerciseId: "str-003", description: "Démonstration du renforcement des muscles du dos en position assise, avec une amplitude minime." },
  { id: "vid-pos-01", exerciseId: "pos-001", description: "Démonstration du redressement postural en position assise, sans forcer." },
  { id: "vid-pos-02", exerciseId: "pos-002", description: "Démonstration de la rétraction des omoplates, sans cambrer le bas du dos." },
  { id: "vid-pos-03", exerciseId: "pos-003", description: "Démonstration de l'alignement debout contre un mur, sans effort." },
  { id: "vid-mob-01", exerciseId: "mob-001", description: "Démonstration des cercles d'épaules, en douceur." },
  { id: "vid-mob-02", exerciseId: "mob-002", description: "Démonstration des mouvements de chevilles en position assise." },
  { id: "vid-mob-03", exerciseId: "mob-003", description: "Démonstration de la rotation très légère du haut du corps, amplitude minime." },
];
