// Mode d'affichage des vidéos.
// "placeholder" : emplacement soigné (défaut pour le MVP).
// "youtube"     : iframe youtube-nocookie.com, uniquement pour les identifiants de APPROVED_YOUTUBE_IDS.
// "self-hosted" : balise <video> pointant vers /videos/<fichier>.mp4.
export type VideoMode = "placeholder" | "youtube" | "self-hosted";

export const VIDEO_MODE: VideoMode = "placeholder";
