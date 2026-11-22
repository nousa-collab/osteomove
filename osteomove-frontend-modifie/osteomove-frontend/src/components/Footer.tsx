import { Link } from "react-router-dom";
import { MedicalDisclaimer } from "./MedicalDisclaimer";
import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-secondary bg-white">
      <div className="container-page grid gap-10 py-12 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="text-ink/80">Bougez mieux, vivez mieux !</p>
        </div>

        <nav aria-label="Liens utiles" className="flex flex-col gap-2">
          <Link className="inline-flex min-h-[48px] items-center hover:text-primary-dark" to="/education">Éducation</Link>
          <Link className="inline-flex min-h-[48px] items-center hover:text-primary-dark" to="/contact">Contact</Link>
          <Link className="inline-flex min-h-[48px] items-center hover:text-primary-dark" to="/register">Créer un compte</Link>
        </nav>

        <MedicalDisclaimer>
          OsteoMove est un outil éducatif et ne remplace pas un avis médical. Consultez toujours un professionnel de
          santé avant de commencer un programme d'exercice. Arrêtez immédiatement en cas de douleur et demandez conseil.
        </MedicalDisclaimer>
      </div>
      <div className="container-page border-t border-secondary py-6 text-sm text-ink/80">
        <p>
          Confidentialité : OsteoMove limite les données collectées. Nous ne demandons aucun dossier médical. Les
          informations saisies restent dans votre navigateur.
        </p>
        <p className="mt-2">© {new Date().getFullYear()} OsteoMove. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
