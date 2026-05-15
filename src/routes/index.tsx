import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Target, Briefcase } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shared Solve — Equipes coordenadas para sua empresa" },
      {
        name: "description",
        content:
          "Recrutamento, treinamento e preparação de equipes para entregar trabalho coordenado e eficiente.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section
        className="relative overflow-hidden text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-6xl px-6 py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-wider">
              Shared Solve
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-6xl">
              Equipes preparadas para resolver o que importa.
            </h1>
            <p className="mt-6 text-lg text-white/75">
              Recrutamos, treinamos e coordenamos profissionais para entregar trabalho
              eficiente e consistente para a sua empresa.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/vagas">
                  Ver vagas abertas <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/testes">Fazer um teste prático</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              icon: Users,
              title: "Recrutamento",
              text: "Encontramos pessoas certas com processos estruturados e testes práticos.",
            },
            {
              icon: Target,
              title: "Treinamento",
              text: "Preparamos equipes para o contexto e exigência de cada cliente.",
            },
            {
              icon: Briefcase,
              title: "Coordenação",
              text: "Acompanhamos a operação garantindo entrega coordenada e eficiente.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
