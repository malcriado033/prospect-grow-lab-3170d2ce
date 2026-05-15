import { Link } from "@tanstack/react-router";
import { DiscordIcon } from "./DiscordIcon";

const DISCORD_URL = "https://discord.gg/sharedsolve";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full">
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
          <Link to="/" activeOptions={{ exact: true }}>Início</Link>
          <Link to="/vagas">Vagas</Link>
          <Link to="/recrutamento">Recrutamento</Link>
          <Link to="/admin">Admin</Link>
        </nav>

        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noreferrer"
          className="btn-pill btn-pill-outline hidden md:inline-flex"
        >
          <DiscordIcon className="h-4 w-4" /> Entrar
        </a>
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
