import { Link } from "@tanstack/react-router";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-display font-bold">
            S
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">
            Shared Solve
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/vagas" className="text-muted-foreground hover:text-foreground transition-colors">
            Vagas
          </Link>
          <Link to="/testes" className="text-muted-foreground hover:text-foreground transition-colors">
            Testes
          </Link>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-6 py-10 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Shared Solve — Recrutamento, treinamento e equipes coordenadas.
      </div>
    </footer>
  );
}
