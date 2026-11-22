// Vide par défaut. N'ajoutez un identifiant qu'après :
//  1. la relecture de la vidéo par un professionnel de santé ;
//  2. la confirmation écrite des droits d'intégration auprès du titulaire de la chaîne.
export const APPROVED_YOUTUBE_IDS: string[] = [
  // "ID_YOUTUBE_VALIDE",
];

export function isApprovedYouTubeId(id: string): boolean {
  return APPROVED_YOUTUBE_IDS.includes(id);
}
