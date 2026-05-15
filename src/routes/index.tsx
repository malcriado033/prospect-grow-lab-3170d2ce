import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, DISCORD_URL } from "@/components/SiteHeader";
import { DiscordIcon } from "@/components/DiscordIcon";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shared Solve — Equipes para Discord" },
      {
        name: "description",
        content:
          "Recrutamento, treinamento e operação de equipes integradas ao seu servidor do Discord.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-32 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Equipes 100% integradas ao Discord
          </span>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Equipes prontas.
            <br />
            <span className="text-muted-foreground">Operação no Discord.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base text-muted-foreground">
            Shared Solve recruta, treina e coordena equipes que operam direto no seu servidor.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link to="/recrutamento" className="btn-pill btn-pill-primary">
              Iniciar processo seletivo <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-pill btn-pill-discord"
            >
              <DiscordIcon className="h-4 w-4" /> Entrar no Discord
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
