import { Hourglass, Play, ShieldCheck } from "lucide-react";
import { categoryLabel } from "../data/categories";
import { cn } from "../lib/utils";
import { VIDEO_MODE } from "../lib/videoConfig";
import { isApprovedYouTubeId } from "../lib/videoWhitelist";
import type { CategoryId } from "../types";

export const LEGAL_NOTE =
  "Cette vidéo est fournie à titre éducatif. Elle ne remplace pas un avis médical. Vérifiez auprès de votre professionnel de santé qu'elle est adaptée à votre situation.";

export type VideoVariant = "thumb" | "card" | "player";

export interface VideoPlayerProps {
  title: string;
  category: CategoryId;
  durationMinutes: number;
  videoUrl: string;
  approved: boolean;
  youtubeId?: string;
  variant?: VideoVariant;
}

type Source =
  | { kind: "youtube"; src: string }
  | { kind: "self-hosted"; src: string }
  | { kind: "placeholder" };

function resolveSource(videoUrl: string, youtubeId?: string): Source {
  if (VIDEO_MODE === "youtube" && youtubeId && isApprovedYouTubeId(youtubeId)) {
    return { kind: "youtube", src: `https://www.youtube-nocookie.com/embed/${youtubeId}` };
  }
  if (VIDEO_MODE === "self-hosted" && videoUrl.startsWith("/videos/") && !videoUrl.includes("placeholder")) {
    return { kind: "self-hosted", src: videoUrl };
  }
  // Identifiant non approuvé ou mode placeholder : on revient toujours à l'emplacement.
  return { kind: "placeholder" };
}

export function VideoPlayer({
  title,
  category,
  durationMinutes,
  videoUrl,
  approved,
  youtubeId,
  variant = "card",
}: VideoPlayerProps) {
  if (variant === "thumb") {
    return (
      <div
        role="img"
        aria-label="Démonstration bientôt disponible"
        className="flex h-[68px] w-[120px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#DFF3EC] to-[#F8FAF9]"
      >
        <Play className="h-6 w-6 fill-primary text-primary" aria-hidden="true" />
      </div>
    );
  }

  const source = resolveSource(videoUrl, youtubeId);
  // Un contenu n'est présenté comme validé que s'il est approuvé ET réellement diffusable.
  const verified = approved && source.kind !== "placeholder";
  const isCard = variant === "card";

  return (
    <div className="flex flex-col gap-3">
      <div
        className={cn(
          "relative aspect-video w-full overflow-hidden rounded-2xl",
          isCard && "transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-soft motion-reduce:transition-none motion-reduce:hover:scale-100",
        )}
      >
        {source.kind === "youtube" && (
          <iframe
            src={source.src}
            title={`Vidéo : ${title}`}
            className="absolute inset-0 h-full w-full"
            allow="encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        {source.kind === "self-hosted" && (
          // Pas de lecture automatique. Ajoutez un <track> de sous-titres pour les vidéos réelles.
          <video
            src={source.src}
            controls
            preload="none"
            aria-label={`Vidéo : ${title}`}
            className="absolute inset-0 h-full w-full bg-ink"
          />
        )}
        {source.kind === "placeholder" && (
          <Placeholder title={title} category={category} durationMinutes={durationMinutes} decorative={isCard} />
        )}
      </div>

      <VerificationBadge verified={verified} />

      {variant === "player" && (
        <p role="note" className="text-sm leading-relaxed text-ink/80">
          {LEGAL_NOTE}
        </p>
      )}
    </div>
  );
}

function Placeholder({
  title,
  category,
  durationMinutes,
  decorative,
}: {
  title: string;
  category: CategoryId;
  durationMinutes: number;
  decorative: boolean;
}) {
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : `Démonstration bientôt disponible : ${title}`}
      aria-hidden={decorative || undefined}
      className="absolute inset-0 flex flex-col bg-gradient-to-br from-[#DFF3EC] to-[#F8FAF9]"
    >
      <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-ink shadow-soft">
        {categoryLabel(category)}
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-sm font-medium text-white">
        {durationMinutes} min
      </span>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 pb-12 pt-10 text-center">
        <button
          type="button"
          disabled
          aria-label="Lecture indisponible pour le moment"
          className="flex h-24 w-24 items-center justify-center rounded-full bg-white/70 shadow-soft backdrop-blur disabled:cursor-not-allowed"
        >
          <Play className="h-16 w-16 fill-primary text-primary" aria-hidden="true" />
        </button>
        <h4 className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-ink">{title}</h4>
      </div>

      <span className="absolute inset-x-0 bottom-0 bg-white/85 py-2 text-center text-sm text-ink/70">
        Démonstration bientôt disponible
      </span>
    </div>
  );
}

function VerificationBadge({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <p className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-700 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-900">
        <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        Validée par un professionnel de santé
      </p>
    );
  }
  return (
    <p className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-600 bg-orange-50 px-3 py-1 text-sm font-medium text-orange-900">
      <Hourglass className="h-4 w-4" aria-hidden="true" />
      Vidéo en attente de validation
    </p>
  );
}
