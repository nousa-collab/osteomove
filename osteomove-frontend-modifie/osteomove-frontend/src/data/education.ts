import type { EducationArticle } from "../types";

// Contenu informatif uniquement. Ne constitue pas un diagnostic.
export const educationArticles: EducationArticle[] = [
  {
    id: "comprendre",
    title: "Comprendre l'ostéoporose",
    summary: "Ce que signifie l'ostéoporose, et pourquoi les os peuvent devenir plus fragiles avec le temps.",
    paragraphs: [
      "L'ostéoporose est une maladie qui rend les os plus poreux et plus fragiles. Elle évolue souvent sans symptômes visibles et se découvre parfois à l'occasion d'une fracture.",
      "Plusieurs facteurs entrent en jeu, comme l'âge, l'histoire familiale, certains traitements ou le mode de vie. Un professionnel de santé peut évaluer la situation de chacun.",
    ],
  },
  {
    id: "chutes",
    title: "Prévenir les chutes",
    summary: "Des gestes simples au quotidien pour réduire le risque de chute à domicile.",
    paragraphs: [
      "Les chutes sont une cause importante de fractures chez les personnes âgées. Garder un bon équilibre et un environnement dégagé peut aider à les prévenir.",
      "Un bon éclairage, des tapis fixés au sol, des appuis solides dans la salle de bains et des chaussures stables sont des précautions simples. Signalez à votre médecin toute chute récente ou tout vertige.",
    ],
  },
  {
    id: "activite",
    title: "L'activité physique et la santé des os",
    summary: "Pourquoi bouger régulièrement, et comment choisir une activité adaptée.",
    paragraphs: [
      "Une activité physique régulière, adaptée à chacun, peut contribuer à maintenir la force musculaire, l'équilibre et la mobilité.",
      "Les exercices à impact élevé, les mouvements brusques et le port de charges lourdes ne sont pas adaptés à toutes les situations. Demandez conseil avant de commencer un programme.",
    ],
  },
  {
    id: "nutrition",
    title: "Alimentation, calcium et vitamine D",
    summary: "Les repères généraux sur l'alimentation et les besoins en calcium et en vitamine D.",
    paragraphs: [
      "Une alimentation variée apporte généralement du calcium et de la vitamine D. Les besoins varient selon l'âge, le sexe et la situation de chacun.",
      "Ne prenez pas de complément de votre propre initiative sans en parler à votre médecin ou à un diététicien.",
    ],
  },
];
