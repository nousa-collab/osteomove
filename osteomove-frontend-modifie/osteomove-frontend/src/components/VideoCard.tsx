import type { Exercise } from "../types";
import { difficultyLabel } from "../data/categories";
import { Badge, Button, Card } from "./ui";
import { VideoPlayer } from "./VideoPlayer";

export function VideoCard({
  exercise,
  description,
  onOpen,
}: {
  exercise: Exercise;
  description: string;
  onOpen: () => void;
}) {
  return (
    <Card className="flex h-full flex-col gap-4">
      <VideoPlayer
        variant="card"
        title={exercise.title}
        category={exercise.category}
        durationMinutes={exercise.durationMinutes}
        videoUrl={exercise.videoUrl}
        approved={exercise.approvedByProfessional}
      />
      <Badge variant="neutral" className="self-start">{difficultyLabel[exercise.difficulty]}</Badge>
      <h3 className="text-lg font-semibold">{exercise.title}</h3>
      <p className="text-ink/80">{description}</p>
      <div className="mt-auto pt-2">
        <Button variant="outline" className="w-full" onClick={onOpen} aria-label={`Ouvrir la vidéo : ${exercise.title}`}>
          Voir la vidéo
        </Button>
      </div>
    </Card>
  );
}
