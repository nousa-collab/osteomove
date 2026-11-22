import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { exercises } from "../data/exercises";
import { videos } from "../data/videos";
import { categories, categoryLabel, difficultyLabel } from "../data/categories";
import type { CategoryId, Exercise } from "../types";
import { VideoCard } from "../components/VideoCard";
import { VideoPlayer } from "../components/VideoPlayer";
import { FilterBar, type DifficultyFilter } from "../components/FilterBar";
import { Modal } from "../components/Modal";
import { Badge, Card } from "../components/ui";

const CATEGORY_IDS: string[] = categories.map((c) => c.id);

function isCategory(value: string | null): value is CategoryId {
  return value !== null && CATEGORY_IDS.includes(value);
}

interface VideoEntry {
  id: string;
  description: string;
  exercise: Exercise;
}

const entries: VideoEntry[] = videos.flatMap((v) => {
  const exercise = exercises.find((e) => e.id === v.exerciseId);
  return exercise ? [{ id: v.id, description: v.description, exercise }] : [];
});

export default function VideosPage() {
  const [params, setParams] = useSearchParams();
  const categoryParam = params.get("category");
  const category = isCategory(categoryParam) ? categoryParam : null;

  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("all");
  const [selected, setSelected] = useState<VideoEntry | null>(null);

  const filtered = useMemo(
    () =>
      entries.filter(
        (e) =>
          (category === null || e.exercise.category === category) &&
          (difficulty === "all" || e.exercise.difficulty === difficulty) &&
          e.exercise.title.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, difficulty, query],
  );

  const sections = categories
    .filter((c) => category === null || c.id === category)
    .map((c) => ({ ...c, items: filtered.filter((e) => e.exercise.category === c.id) }))
    .filter((s) => s.items.length > 0);

  return (
    <div className="container-page flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">Vidéos</h1>
        <p className="max-w-2xl text-lg text-ink/85">
          Regardez un exercice avant de le pratiquer. Les vidéos ne remplacent pas les conseils d'un professionnel de
          santé.
        </p>
      </header>

      <section aria-labelledby="trusted-videos-title" className="flex flex-col gap-4">
        <h2 id="trusted-videos-title" className="text-2xl font-semibold">Vidéos de référence</h2>
        <p className="max-w-3xl text-ink/80">Une sélection de ressources vidéo publiées par des organismes spécialisés. Les vidéos s’ouvrent sur leur site d’origine ; elles ne sont pas présentées comme une validation médicale individuelle de votre programme.</p>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Card className="flex flex-col gap-3">
            <Badge variant="teal">NHS · Royaume-Uni</Badge>
            <h3 className="text-lg font-semibold">Séance de Pilates adaptée à l’ostéoporose</h3>
            <p className="text-sm text-ink/80">Séance vidéo de 27 minutes axée sur la force, la souplesse et l’équilibre. Le NHS recommande de demander conseil à un professionnel si vous avez un problème de santé ou un doute.</p>
            <a className="mt-auto font-semibold text-primary-dark underline underline-offset-4" href="https://www.nhs.uk/live-well/exercise/pilates-and-yoga/osteoporosis-pilates-exercise-video/" target="_blank" rel="noreferrer">Voir la vidéo sur le site du NHS ↗</a>
          </Card>
          <Card className="flex flex-col gap-3">
            <Badge variant="teal">Royal Osteoporosis Society</Badge>
            <h3 className="text-lg font-semibold">Exercices pour améliorer l’équilibre</h3>
            <p className="text-sm text-ink/80">Démonstrations guidées par une physiothérapeute, avec des variantes et des conseils de sécurité pour travailler l’équilibre.</p>
            <a className="mt-auto font-semibold text-primary-dark underline underline-offset-4" href="https://theros.org.uk/information-and-support/exercise/exercise-to-help-your-balance/" target="_blank" rel="noreferrer">Voir les exercices ↗</a>
          </Card>
          <Card className="flex flex-col gap-3">
            <Badge variant="teal">Bone Health & Osteoporosis Foundation</Badge>
            <h3 className="text-lg font-semibold">Mouvements et exercices en sécurité</h3>
            <p className="text-sm text-ink/80">Série de vidéos sur les gestes du quotidien et la prévention des blessures, notamment au niveau de la colonne vertébrale.</p>
            <a className="mt-auto font-semibold text-primary-dark underline underline-offset-4" href="https://www.bonehealthandosteoporosis.org/patients/fracturesfall-prevention/safe-movement-exercise-videos/" target="_blank" rel="noreferrer">Voir la série de vidéos ↗</a>
          </Card>
        </div>
      </section>

      <h2 className="text-2xl font-semibold">Bibliothèque des exercices</h2>
      <p className="text-sm text-ink/75">Les aperçus de cette bibliothèque restent des emplacements de démonstration tant que chaque vidéo spécifique n’a pas été validée et autorisée.</p>
      <FilterBar
        query={query}
        onQuery={setQuery}
        category={category}
        onCategory={(c) => setParams(c ? { category: c } : {})}
        difficulty={difficulty}
        onDifficulty={setDifficulty}
        searchLabel="Rechercher une vidéo"
        searchPlaceholder="Ex. : genoux, dos"
      />

      {sections.length === 0 ? (
        <div className="rounded-card border border-dashed border-ink/30 p-10 text-center">
          <p className="text-lg font-medium">Aucune vidéo ne correspond à votre recherche.</p>
        </div>
      ) : (
        sections.map((section) => {
          const Icon = section.icon;
          return (
            <section key={section.id} aria-labelledby={`videos-${section.id}`} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary-dark">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 id={`videos-${section.id}`} className="text-2xl font-semibold">
                  {section.label}
                </h2>
                <Badge variant="soft">{section.items.length}</Badge>
              </div>
              <p className="text-ink/80">{section.description}</p>
              <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((e) => (
                  <li key={e.id}>
                    <VideoCard exercise={e.exercise} description={e.description} onOpen={() => setSelected(e)} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })
      )}

      <Modal open={selected !== null} onClose={() => setSelected(null)} title={selected?.exercise.title ?? ""} wide>
        {selected && (
          <div className="flex flex-col gap-5">
            <VideoPlayer
              variant="player"
              title={selected.exercise.title}
              category={selected.exercise.category}
              durationMinutes={selected.exercise.durationMinutes}
              videoUrl={selected.exercise.videoUrl}
              approved={selected.exercise.approvedByProfessional}
            />
            <div className="flex flex-wrap gap-2">
              <Badge variant="soft">{categoryLabel(selected.exercise.category)}</Badge>
              <Badge variant="neutral">{difficultyLabel[selected.exercise.difficulty]}</Badge>
            </div>
            <p className="text-lg">{selected.description}</p>
            <p className="font-medium">Consultez un professionnel de santé avant de commencer un exercice.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
