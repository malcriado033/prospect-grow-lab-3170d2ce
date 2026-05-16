import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DiscordIcon } from "./DiscordIcon";
import { getSession, setSession, type Session } from "@/lib/session";
import { LogOut, Menu, X } from "lucide-react";

const DISCORD_URL = "https://discord.gg/sharedsolve";

export function SiteHeader() {
  const [session, setS] = useState<Session | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass-strong shadow-[0_1px_0_oklch(1_0_0/0.06)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-accent-foreground">
            S
          </div>
          <span className="hidden font-display text-base font-semibold tracking-tight sm:inline">
            Shared Solve
          </span>
        </Link>

        <nav className="nav-pill hidden md:inline-flex">
          <Link to="/" activeOptions={{ exact: true }}>Empresas</Link>
          <Link to="/recrutamento">Recrutamento</Link>
          <Link to="/dashboard">Painel</Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <div className="hidden items-center gap-2 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
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
            <Link to="/login" className="btn-pill btn-pill-accent hidden md:inline-flex">
              Acessar Painel
            </Link>
          )}

          <button
            className="rounded-lg border border-border p-2 text-muted-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="glass-strong border-t border-border p-6 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Empresas
            </Link>
            <Link to="/recrutamento" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Recrutamento
            </Link>
            <Link to="/dashboard" className="text-sm font-medium" onClick={() => setMobileOpen(false)}>
              Painel
            </Link>
            {session ? (
              <button
                onClick={() => {
                  setSession(null);
                  navigate({ to: "/" });
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <LogOut className="h-3.5 w-3.5" /> Sair
              </button>
            ) : (
              <Link
                to="/login"
                className="btn-pill btn-pill-accent mt-2 justify-center"
                onClick={() => setMobileOpen(false)}
              >
                Acessar Painel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent font-display text-sm font-bold text-accent-foreground">
                S
              </div>
              <span className="font-display text-base font-semibold">Shared Solve</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Equipes de suporte operacional de elite para empresas de tecnologia.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Empresa</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              <a href="#servicos" className="text-sm text-foreground/70 hover:text-foreground">Servicos</a>
              <a href="#parceiros" className="text-sm text-foreground/70 hover:text-foreground">Parceiros</a>
              <a href="#estatisticas" className="text-sm text-foreground/70 hover:text-foreground">Resultados</a>
              <a href="#faq" className="text-sm text-foreground/70 hover:text-foreground">FAQ</a>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plataforma</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link to="/login" className="text-sm text-foreground/70 hover:text-foreground">Acessar Painel</Link>
              <Link to="/recrutamento" className="text-sm text-foreground/70 hover:text-foreground">Processo Seletivo</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comunidade</p>
            <nav className="mt-4 flex flex-col gap-2.5">
              <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground">
                <DiscordIcon className="h-4 w-4" /> Discord
              </a>
            </nav>
          </div>
        </div>
        <div className="mt-12 flex items-center justify-between border-t border-border pt-8 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Shared Solve. Todos os direitos reservados.</span>
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="hover:text-foreground">
            discord.gg/sharedsolve
          </a>
        </div>
      </div>
    </footer>
  );
}

export { DISCORD_URL };
