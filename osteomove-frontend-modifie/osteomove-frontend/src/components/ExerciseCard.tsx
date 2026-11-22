import { ShieldCheck } from "lucide-react";
import type { Exercise } from "../types";
import { difficultyLabel } from "../data/categories";
import { Badge, Button, Card } from "./ui";
import { VideoPlayer } from "./VideoPlayer";

export function ExerciseCard({ exercise, onOpen }: { exercise: Exercise; onOpen: () => void }) {
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
      <p className="flex items-start gap-2 rounded-lg bg-primary-dark px-3 py-2 text-sm font-medium text-white">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{exercise.safetyNote}</span>
      </p>
      <p className="text-sm text-ink/70">Consultez un professionnel avant de commencer.</p>
      <div className="mt-auto pt-2">
        <Button variant="outline" className="w-full" onClick={onOpen} aria-label={`Voir le détail : ${exercise.title}`}>
          Voir le détail
        </Button>
      </div>
    </Card>
  );
}
