import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";
import { KEYS, writeStorage } from "../hooks/useLocalStorage";
import { apiRequest } from "../lib/api";
import { isValidEmail } from "../lib/utils";
import type { Profile, UserAccount } from "../types";

type FormErrors = Partial<Record<"name" | "email" | "password" | "confirm" | "privacy", string>>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: FormErrors = {};
    if (name.trim().length < 2) next.name = "Saisissez votre prénom ou votre nom.";
    if (!isValidEmail(email)) next.email = "Saisissez une adresse e-mail valide.";
    if (password.length < 10) next.password = "Le mot de passe doit contenir au moins 10 caractères.";
    if (confirm !== password) next.confirm = "Les deux mots de passe ne correspondent pas.";
    if (!privacy) next.privacy = "Vous devez accepter la politique de confidentialité pour créer un compte.";
    setErrors(next); setServerError("");
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    try {
      const result = await apiRequest<{ user: UserAccount }>("/auth/register", { method: "POST", body: JSON.stringify({ name: name.trim(), email: email.trim(), password }) });
      const account = result.user;
      const profile: Profile = { name: account.name, email: account.email, ageRange: "Non précisé", language: "fr" };
      writeStorage(KEYS.user, account); writeStorage(KEYS.profile, profile);
      navigate("/program");
    } catch (error) { setServerError(error instanceof Error ? error.message : "Inscription impossible."); }
    finally { setLoading(false); }
  };

  return (
    <div className="container-page flex justify-center py-16">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Créer un compte</h1>
        <p className="mb-6 text-ink/85">Quelques informations suffisent pour commencer.</p>

        {serverError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{serverError}</p>}
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Input id="reg-name" label="Prénom ou nom" autoComplete="name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
          <Input id="reg-email" label="Adresse e-mail" type="email" autoComplete="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            id="reg-password"
            label="Mot de passe"
            type="password"
            autoComplete="new-password"
            hint="Au moins 10 caractères."
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input id="reg-confirm" label="Confirmer le mot de passe" type="password" autoComplete="new-password" value={confirm} error={errors.confirm} onChange={(e) => setConfirm(e.target.value)} />

          <div className="flex flex-col gap-2">
            <label className="flex min-h-[48px] items-start gap-3">
              <input
                id="reg-privacy"
                type="checkbox"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                aria-invalid={!!errors.privacy}
                aria-describedby={errors.privacy ? "reg-privacy-error" : "reg-privacy-note"}
                className="mt-1 h-6 w-6 shrink-0 accent-primary-dark"
              />
              <span>J'accepte la politique de confidentialité</span>
            </label>
            <p id="reg-privacy-note" className="text-sm text-ink/80">
              OsteoMove réduit au maximum les données collectées : aucun dossier médical n'est demandé.
            </p>
            {errors.privacy && (
              <p id="reg-privacy-error" role="alert" className="text-sm font-medium text-red-700">
                {errors.privacy}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Création…" : "Créer mon compte"}</Button>
        </form>

        <p className="mt-8 text-center text-ink/85">
          Déjà inscrit ?{" "}
          <Link to="/login" className="font-semibold text-primary-dark underline underline-offset-4">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
}
