import { useState, type FormEvent } from "react";
import { Clock, Mail } from "lucide-react";
import { Button, Card, Input } from "../components/ui";
import { MedicalDisclaimer } from "../components/MedicalDisclaimer";
import { useToast } from "../components/Toast";
import { isValidEmail } from "../lib/utils";
import { apiRequest } from "../lib/api";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const toast = useToast();
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next: { name?: string; email?: string; message?: string } = {};
    if (name.trim().length < 2) next.name = "Saisissez votre nom.";
    if (!isValidEmail(email)) next.email = "Saisissez une adresse e-mail valide.";
    if (message.trim().length < 10) next.message = "Votre message doit contenir au moins 10 caractères.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setSending(true);
    try {
      const result = await apiRequest<{ message: string }>("/contact", { method: "POST", body: JSON.stringify({ name, email, message }) });
      toast.show(result.message); setName(""); setEmail(""); setMessage("");
    } catch (error) { toast.show(error instanceof Error ? error.message : "Envoi impossible. Réessayez plus tard."); }
    finally { setSending(false); }
  };

  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
      <section className="flex flex-col gap-6">
        <h1 className="text-4xl font-semibold">Nous contacter</h1>
        <p className="text-lg text-ink/85">Une question sur l'application ? Écrivez-nous.</p>

        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
          <Input id="contact-name" label="Votre nom" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <Input id="contact-email" label="Votre adresse e-mail" type="email" value={email} error={errors.email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <div className="flex flex-col gap-2">
            <label htmlFor="contact-message" className="font-medium">Votre message</label>
            <textarea
              id="contact-message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              className="rounded-xl border-2 border-ink/20 bg-white p-4 text-base outline-none focus:border-primary"
            />
            {errors.message && (
              <p id="contact-message-error" role="alert" className="text-sm font-medium text-red-700">{errors.message}</p>
            )}
          </div>
          <div>
            <Button type="submit" disabled={sending}>{sending ? "Envoi…" : "Envoyer le message"}</Button>
          </div>
        </form>
      </section>

      <aside className="flex flex-col gap-6">
        <MedicalDisclaimer>
          Pour toute question médicale, adressez-vous à votre médecin ou à un professionnel de santé. OsteoMove ne
          répond pas aux questions de diagnostic. En cas d'urgence, appelez les services d'urgence.
        </MedicalDisclaimer>
        <Card className="flex flex-col gap-4">
          <p className="flex items-center gap-3">
            <Clock className="h-5 w-5" aria-hidden="true" />
            <span>Lundi au vendredi, 9 h à 17 h</span>
          </p>
          <p className="flex items-center gap-3">
            <Mail className="h-5 w-5" aria-hidden="true" />
            <span>Adresse de contact configurée par l’équipe OsteoMove</span>
          </p>
        </Card>
      </aside>
    </div>
  );
}
