import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DiscordIcon } from "./DiscordIcon";
import { getSession, setSession, type Session } from "@/lib/session";
import { LogOut } from "lucide-react";

const DISCORD_URL = "https://discord.gg/sharedsolve";

export function SiteHeader() {
  const [session, setS] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setS(getSession());
    sync();
    window.addEventListener("ss-session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("ss-session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground font-display text-base font-bold text-background">
            S
          </div>
          <span className="hidden font-display text-base font-semibold tracking-tight sm:inline">
            Shared Solve
          </span>
        </Link>

        <nav className="nav-pill">
          <Link to="/" activeOptions={{ exact: true }}>Empresas</Link>
          <Link to="/recrutamento">Recrutamento</Link>
          <Link to="/atendimento">Atendimento</Link>
        </nav>

        {session ? (
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--discord)] text-[10px] font-bold text-white">
                {session.avatar}
              </div>
              <span className="text-xs font-medium">{session.username}</span>
            </div>
            <button
              onClick={() => {
                setSession(null);
                navigate({ to: "/" });
              }}
              className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
              title="Sair"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-pill btn-pill-outline hidden md:inline-flex">
            <DiscordIcon className="h-4 w-4" /> Entrar
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Shared Solve</span>
        <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
          discord.gg/sharedsolve
        </a>
      </div>
    </footer>
  );
}

export { DISCORD_URL };
