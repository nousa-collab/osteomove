import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShieldCheck, AlertTriangle } from "lucide-react";
import { exercises } from "../data/exercises";
import { categories, categoryLabel, difficultyLabel } from "../data/categories";
import type { CategoryId, Exercise } from "../types";
import { ExerciseCard } from "../components/ExerciseCard";
import { FilterBar, type DifficultyFilter } from "../components/FilterBar";
import { Modal } from "../components/Modal";
import { VideoPlayer } from "../components/VideoPlayer";
import { Badge, Button } from "../components/ui";
import { useToast } from "../components/Toast";
import { useLocalStorage, KEYS } from "../hooks/useLocalStorage";

const CATEGORY_IDS: string[] = categories.map((c) => c.id);

function isCategory(value: string | null): value is CategoryId {
  return value !== null && CATEGORY_IDS.includes(value);
}

export default function ExercisesPage() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get("category");
  const category = isCategory(categoryParam) ? categoryParam : null;

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [saved, setSaved] = useLocalStorage<string[]>(KEYS.saved, []);
  const toast = useToast();

  const filtered = useMemo(
    () =>
      exercises.filter(
        (e) =>
          (category === null || e.category === category) &&
          (difficulty === "all" || e.difficulty === difficulty) &&
          e.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, difficulty, query],
  );

  const toggleSaved = (id: string) => {
    const isSaved = saved.includes(id);
    setSaved(isSaved ? saved.filter((x) => x !== id) : [...saved, id]);
    toast.show(isSaved ? "Retiré de votre programme." : "Ajouté à votre programme.");
  };

  return (
    <div className="container-page flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">Bibliothèque d'exercices</h1>
        <p className="max-w-2xl text-lg text-ink/85">
          Chaque exercice indique ses précautions. Lisez-les avant de commencer, et arrêtez en cas de douleur.
        </p>
      </header>

      <FilterBar
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={(c) => setParams(c ? { category: c } : {})}
        difficulty={difficulty}
        onDifficulty={setDifficulty}
        searchLabel="Rechercher un exercice"
        searchPlaceholder="Ex. : équilibre, épaules"
      />

      <p className="text-ink/80" aria-live="polite">
        {filtered.length} exercice{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink/30 p-10 text-center">
          <p className="text-lg font-medium">Aucun exercice ne correspond à votre recherche.</p>
          <p className="mt-2 text-ink/80">Essayez un autre mot, ou retirez un filtre.</p>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((e) => (
            <li key={e.id}>
              <ExerciseCard exercise={e} onOpen={() => setSelected(e)} />
            </li>
          ))}
        </ul>
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? ""} wide>
        {selected && (
          <ExerciseDetail
            exercise={selected}
            isSaved={saved.includes(selected.id)}
            onToggleSaved={() => toggleSaved(selected.id)}
          />
        )}
      </Modal>
    </div>
  );
}

function ExerciseDetail({
  exercise,
  isSaved,
  onToggleSaved,
}: {
  exercise: Exercise;
  isSaved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <VideoPlayer
        variant="player"
        title={exercise.title}
        category={exercise.category}
        durationMinutes={exercise.durationMinutes}
        videoUrl={exercise.videoUrl}
        approved={exercise.approvedByProfessional}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="soft">{categoryLabel(exercise.category)}</Badge>
        <Badge variant="neutral">{difficultyLabel[exercise.difficulty]}</Badge>
      </div>

      <p className="text-lg text-ink/90">{exercise.description}</p>

      <p className="flex items-start gap-2 rounded-lg bg-primary-dark px-4 py-3 font-medium text-white">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{exercise.safetyNote}</span>
      </p>

      <section aria-labelledby="contra-title" className="rounded-card border-2 border-red-700 bg-red-50 p-5">
        <h3 id="contra-title" className="mb-3 flex items-center gap-2 text-lg font-semibold text-ink">
          <AlertTriangle className="h-5 w-5 text-red-700" aria-hidden="true" />
          Contre-indications et précautions
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          {exercise.contraindications.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="equip-title">
        <h3 id="equip-title" className="mb-2 text-lg font-semibold">Matériel</h3>
        <ul className="list-disc pl-6">
          {exercise.equipment.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="steps-title">
        <h3 id="steps-title" className="mb-2 text-lg font-semibold">Étapes</h3>
        <ol className="list-decimal space-y-2 pl-6">
          {exercise.instructions.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant={isSaved ? "secondary" : "primary"} onClick={onToggleSaved} className="w-full sm:w-auto">
          {isSaved ? "Retirer de mon programme" : "Ajouter à mon programme"}
        </Button>
      </div>
    </div>
  );
}
