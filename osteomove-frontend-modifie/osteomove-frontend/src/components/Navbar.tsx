import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { HeartPulse, Menu, X } from "lucide-react";
import { cn, initials } from "../lib/utils";
import { KEYS, useLocalStorage } from "../hooks/useLocalStorage";
import type { UserAccount } from "../types";
import { apiRequest } from "../lib/api";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/exercises", label: "Exercices", end: false },
  { to: "/videos", label: "Vidéos", end: false },
  { to: "/program", label: "Mon programme", end: false },
  { to: "/progress", label: "Suivi", end: false },
  { to: "/education", label: "Éducation", end: false },
  { to: "/contact", label: "Contact", end: false },
];

export function Logo() {
  return (
    <Link to="/" className="flex min-h-[48px] items-center gap-2 rounded-lg">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-dark text-white">
        <HeartPulse className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="font-heading text-xl font-semibold text-ink">OsteoMove</span>
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user] = useLocalStorage<UserAccount | null>(KEYS.user, null);
  const location = useLocation();
  const logout = async () => {
    try { await apiRequest<{ message: string }>("/auth/logout", { method: "POST" }); }
    catch { /* La session locale est effacée même si l’API est temporairement indisponible. */ }
    finally { window.localStorage.removeItem(KEYS.user); window.dispatchEvent(new CustomEvent("osteomove:storage", { detail: KEYS.user })); window.location.assign("/"); }
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "flex min-h-[48px] items-center rounded-lg px-3 font-medium transition-colors",
      isActive ? "bg-secondary text-primary-dark" : "text-ink hover:bg-secondary",
    );

  return (
    <header className="sticky top-0 z-40 border-b border-secondary bg-white/95 backdrop-blur">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile" aria-label="Mon profil" className="flex min-h-[48px] min-w-[48px] items-center justify-center gap-2 rounded-xl bg-secondary px-3 font-semibold text-ink">
                <span aria-hidden="true">{initials(user.name || user.email)}</span>
                <span className="hidden md:inline">Mon profil</span>
              </Link>
              <button type="button" onClick={logout} className="hidden min-h-[48px] rounded-xl px-3 text-sm font-semibold text-primary-dark hover:bg-secondary md:block">Déconnexion</button>
            </>
          ) : (
            <Link to="/login" className="hidden min-h-[48px] items-center rounded-xl border-2 border-primary-dark px-4 font-semibold text-primary-dark hover:bg-secondary md:flex">Connexion</Link>
          )}

          <button
            type="button"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-xl hover:bg-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-7 w-7" aria-hidden="true" /> : <Menu className="h-7 w-7" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Menu mobile" className="border-t border-secondary bg-white lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to={user ? "/profile" : "/login"} className={linkClass}>
                {user ? "Mon profil" : "Connexion"}
              </NavLink>
            </li>
            {user && <li><button type="button" onClick={logout} className={linkClass({ isActive: false }) + " w-full text-left"}>Déconnexion</button></li>}
          </ul>
        </nav>
      )}
    </header>
  );
}
