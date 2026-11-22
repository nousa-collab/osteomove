import { Link } from "react-router-dom";
import { HeartPulse, ShieldCheck } from "lucide-react";
import { categories } from "../data/categories";
import { CategoryCard } from "../components/CategoryCard";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";
import { Button, Card } from "../components/ui";

const steps = [
  { title: "Choisissez un exercice", text: "Parcourez la bibliothèque et filtrez par catégorie ou niveau." },
  { title: "Pratiquez en sécurité", text: "Lisez les consignes et les précautions avant de commencer, en douceur." },
  { title: "Suivez vos progrès", text: "Marquez vos séances et visualisez votre régularité semaine après semaine." },
];

const testimonials = [
  { quote: "Les exercices sont clairs, et je peux les faire chez moi à mon rythme.", name: "Marie, 68 ans" },
  { quote: "J'ai retrouvé confiance dans mon équilibre en marchant dans le couloir.", name: "Jean-Pierre, 72 ans" },
  { quote: "Cocher mes séances me motive à continuer chaque semaine.", name: "Françoise, 63 ans" },
];

export default function HomePage() {
  return (
    <div>
      <section className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Bougez mieux, vivez mieux !</h1>
          <p className="max-w-xl text-lg text-ink/85">
            Des exercices doux, pensés pour les personnes vivant avec une ostéoporose. Ils peuvent aider à garder
            l'équilibre, la force et la mobilité, à domicile.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto">Commencer</Button>
            </Link>
            <Link to="/exercises">
              <Button variant="outline" className="w-full sm:w-auto">Voir les exercices</Button>
            </Link>
          </div>
        </div>
        <div className="flex aspect-[4/3] items-center justify-center rounded-card bg-secondary" aria-hidden="true">
          <HeartPulse className="h-32 w-32 text-primary-dark" />
        </div>
      </section>

      <section className="container-page pb-16" aria-labelledby="trust-title">
        <h2 id="trust-title" className="sr-only">Information sur le contenu</h2>
        <MedicalDisclaimer>
          <p className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            Contenu en cours de validation par des professionnels de santé.
          </p>
          <p className="mt-2">OsteoMove est un outil éducatif et ne remplace pas un avis médical.</p>
        </MedicalDisclaimer>
      </section>

      <section className="container-page pb-16" aria-labelledby="categories-title">
        <h2 id="categories-title" className="mb-8 text-3xl font-semibold">Quatre domaines de travail</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="container-page pb-16" aria-labelledby="how-title">
        <h2 id="how-title" className="mb-8 text-3xl font-semibold">Comment ça marche</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.title}>
              <Card className="h-full">
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-ink/85">{s.text}</p>
              </Card>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page pb-16" aria-labelledby="testimonials-title">
        <h2 id="testimonials-title" className="mb-2 text-3xl font-semibold">Témoignages</h2>
        <p className="mb-8 text-sm text-ink/70">Témoignages fictifs, donnés à titre d'illustration.</p>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name}>
              <Card className="h-full">
                <blockquote className="text-ink/90">« {t.quote} »</blockquote>
                <figcaption className="mt-4 font-semibold">{t.name}</figcaption>
              </Card>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page pb-8">
        <MedicalDisclaimer>
          Consultez un professionnel de santé avant de commencer un programme d'exercice. Arrêtez immédiatement en cas
          de douleur.
        </MedicalDisclaimer>
      </section>
    </div>
  );
}
