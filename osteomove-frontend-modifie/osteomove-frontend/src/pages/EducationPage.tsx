import { useState } from "react";
import { BookOpen } from "lucide-react";
import { educationArticles } from "../data/education";
import type { EducationArticle } from "../types";
import { Button, Card } from "../components/ui";
import { Modal } from "../components/Modal";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";

export default function EducationPage() {
  const [article, setArticle] = useState<EducationArticle | null>(null);

  return (
    <div className="container-page flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold">S'informer</h1>
        <p className="max-w-2xl text-lg text-ink/85">Des repères généraux pour mieux comprendre la maladie et votre activité.</p>
      </header>

      <MedicalDisclaimer>
        <p className="font-semibold">Ces informations ne constituent pas un diagnostic.</p>
        <p className="mt-1">Consultez un professionnel de santé pour toute question sur votre situation personnelle.</p>
      </MedicalDisclaimer>

      <ul className="grid gap-6 md:grid-cols-2">
        {educationArticles.map((a) => (
          <li key={a.id}>
            <Card className="flex h-full flex-col gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary-dark">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-semibold">{a.title}</h2>
              <p className="text-ink/85">{a.summary}</p>
              <div className="mt-auto pt-2">
                <Button variant="outline" onClick={() => setArticle(a)} aria-label={`Lire l'article : ${a.title}`}>
                  Lire l'article
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <Modal open={article !== null} onClose={() => setArticle(null)} title={article?.title ?? ""} wide>
        {article && (
          <div className="flex flex-col gap-5 text-lg">
            {article.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p className="rounded-xl bg-secondary p-4 font-semibold">
              Consultez un professionnel de santé pour toute question concernant votre santé.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
