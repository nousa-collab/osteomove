import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Button, Card, Input, Select } from "../components/ui";
import { Modal } from "../components/Modal";
import { useToast } from "../components/Toast";
import { KEYS, useLocalStorage } from "../hooks/useLocalStorage";
import { initials, isValidEmail } from "../lib/utils";
import type { Profile, UserAccount } from "../types";

const AGE_RANGES = [
  { value: "Non précisé", label: "Non précisé" },
  { value: "Moins de 55 ans", label: "Moins de 55 ans" },
  { value: "55 à 64 ans", label: "55 à 64 ans" },
  { value: "65 à 74 ans", label: "65 à 74 ans" },
  { value: "75 ans et plus", label: "75 ans et plus" },
];

export default function ProfilePage() {
  const [user] = useLocalStorage<UserAccount | null>(KEYS.user, null);
  const [profile, setProfile] = useLocalStorage<Profile>(KEYS.profile, {
    name: "",
    email: "",
    ageRange: "Non précisé",
    language: "fr",
  });
  const [draft, setDraft] = useState<Profile>(profile);
  const [emailError, setEmailError] = useState<string | undefined>();
  const [confirmReset, setConfirmReset] = useState(false);
  const toast = useToast();

  if (!user) {
    return (
      <div className="container-page flex flex-col items-start gap-6 py-16">
        <h1 className="text-4xl font-semibold">Mon profil</h1>
        <p className="text-lg">Connectez-vous pour accéder à votre profil.</p>
        <Link to="/login" className="inline-flex min-h-[48px] items-center rounded-xl bg-primary-dark px-5 font-semibold text-white">
          Se connecter
        </Link>
      </div>
    );
  }

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (draft.email && !isValidEmail(draft.email)) {
      setEmailError("Saisissez une adresse e-mail valide, par exemple nom@exemple.fr.");
      return;
    }
    setEmailError(undefined);
    setProfile(draft);
    toast.show("Profil enregistré.");
  };

  const resetAll = () => {
    // On conserve le marqueur de démonstration pour ne pas réinjecter de fausses données au rechargement.
    [KEYS.user, KEYS.profile, KEYS.goals, KEYS.saved].forEach((k) => window.localStorage.removeItem(k));
    window.localStorage.setItem(KEYS.logs, "[]");
    window.location.assign("/");
  };

  return (
    <div className="container-page grid gap-8 py-12 lg:grid-cols-[320px_1fr]">
      <Card className="flex h-fit flex-col items-center gap-4 text-center">
        <span
          aria-hidden="true"
          className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-dark font-heading text-3xl font-semibold text-white"
        >
          {initials(profile.name || user.name || "OM")}
        </span>
        <p className="text-xl font-semibold">{profile.name || user.name}</p>
        <p className="text-ink/80">{profile.email || user.email}</p>
      </Card>

      <div className="flex flex-col gap-8">
        <Card>
          <h1 className="mb-6 text-3xl font-semibold">Mon profil</h1>
          <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
            <Input
              id="profile-name"
              label="Prénom ou nom"
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              autoComplete="name"
            />
            <Input
              id="profile-email"
              label="Adresse e-mail"
              type="email"
              value={draft.email}
              error={emailError}
              onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              autoComplete="email"
            />
            <Select
              id="profile-age"
              label="Tranche d'âge (facultatif)"
              value={draft.ageRange}
              options={AGE_RANGES}
              onChange={(e) => setDraft({ ...draft, ageRange: e.target.value })}
            />
            <Select
              id="profile-language"
              label="Langue"
              value={draft.language}
              options={[
                { value: "fr", label: "Français" },
                { value: "ar", label: "العربية (bientôt disponible)", disabled: true },
              ]}
              onChange={(e) => setDraft({ ...draft, language: e.target.value as Profile["language"] })}
            />
            <p className="text-sm text-ink/80 sm:col-span-2">
              Nous ne demandons aucune information médicale. Seules les informations ci-dessus sont enregistrées.
            </p>
            <div className="sm:col-span-2">
              <Button type="submit">Enregistrer</Button>
            </div>
          </form>
        </Card>

        <Card className="border-red-700/40">
          <h2 className="mb-2 text-xl font-semibold">Réinitialiser mes données</h2>
          <p className="mb-4 text-ink/85">
            Supprime votre profil, vos objectifs et votre historique de séances sur cet appareil. Action définitive.
          </p>
          <Button variant="outline" className="border-red-700 text-red-700 hover:bg-red-50" onClick={() => setConfirmReset(true)}>
            <Trash2 className="h-5 w-5" aria-hidden="true" />
            Réinitialiser mes données
          </Button>
        </Card>
      </div>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} title="Effacer toutes mes données ?">
        <div className="flex flex-col gap-6">
          <p className="text-lg">Votre profil, vos objectifs et votre historique seront supprimés de cet appareil.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>Annuler</Button>
            <Button variant="primary" className="bg-red-700 hover:bg-red-800" onClick={resetAll}>Oui, tout effacer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
