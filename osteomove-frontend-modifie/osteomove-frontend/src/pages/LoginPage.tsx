import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Card, Input } from "../components/ui";
import { KEYS, writeStorage } from "../hooks/useLocalStorage";
import { apiRequest } from "../lib/api";
import { isValidEmail } from "../lib/utils";
import type { UserAccount } from "../types";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showForgot, setShowForgot] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: { email?: string; password?: string } = {};
    if (!isValidEmail(email)) next.email = "Saisissez une adresse e-mail valide.";
    if (password.length < 1) next.password = "Saisissez votre mot de passe.";
    setErrors(next); setServerError("");
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    try {
      const result = await apiRequest<{ user: UserAccount }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      writeStorage(KEYS.user, result.user);
      navigate("/program");
    } catch (error) { setServerError(error instanceof Error ? error.message : "Connexion impossible."); }
    finally { setLoading(false); }
  };

  return (
    <div className="container-page flex justify-center py-16">
      <Card className="w-full max-w-md">
        <h1 className="mb-2 text-3xl font-semibold">Connexion</h1>
        <p className="mb-6 text-ink/85">Accédez à votre programme et à votre suivi.</p>

        {serverError && <p role="alert" className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{serverError}</p>}
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Input
            id="login-email"
            label="Adresse e-mail"
            type="email"
            autoComplete="email"
            value={email}
            error={errors.email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="login-password"
            label="Mot de passe"
            type="password"
            autoComplete="current-password"
            value={password}
            error={errors.password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Connexion…" : "Se connecter"}</Button>
        </form>

        <div className="mt-5 flex flex-col gap-3">
          <button
            type="button"
            className="min-h-[48px] self-start font-medium text-primary-dark underline underline-offset-4"
            onClick={() => setShowForgot((v) => !v)}
            aria-expanded={showForgot}
          >
            Mot de passe oublié ?
          </button>
          {showForgot && (
            <p role="status" className="rounded-xl bg-secondary p-4">
              La réinitialisation automatique n’est pas encore activée. Contactez l’équipe OsteoMove pour obtenir de l’aide.
            </p>
          )}
        </div>

        <p className="mt-8 text-center text-ink/85">
          Pas encore de compte ?{" "}
          <Link to="/register" className="font-semibold text-primary-dark underline underline-offset-4">
            Créer un compte
          </Link>
        </p>
      </Card>
    </div>
  );
}
