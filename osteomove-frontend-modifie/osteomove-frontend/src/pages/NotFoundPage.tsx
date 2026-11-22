import { Link } from "react-router-dom";
import { Button } from "../components/ui";

export default function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-start gap-6 py-24">
      <p className="font-heading text-6xl font-semibold text-primary-dark">404</p>
      <h1 className="text-4xl font-semibold">Cette page n'existe pas.</h1>
      <p className="max-w-xl text-lg text-ink/85">Le lien est peut-être ancien, ou la page a été déplacée. Retournez à l'accueil pour continuer.</p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
}
