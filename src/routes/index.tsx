import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, DISCORD_URL } from "@/components/SiteHeader";
import { DiscordIcon } from "@/components/DiscordIcon";
import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
  CheckCircle2,
  MessagesSquare,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shared Solve — Equipes de atendimento sob demanda" },
      {
        name: "description",
        content:
          "Recrutamos, treinamos e operamos equipes de atendimento integradas ao Discord da sua empresa. Resultado em dias, não em meses.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="hero-glow relative overflow-hidden">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-28 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Operação plug-and-play no seu Discord
          </span>

          <h1 className="mt-8 font-display text-5xl font-bold leading-[1.05] md:text-7xl">
            Equipes prontas.
            <br />
            <span className="text-muted-foreground">Operação sem atrito.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground">
            Shared Solve recruta, treina e gerencia equipes de atendimento que se conectam direto
            ao seu servidor. Você foca no produto — a gente cuida do suporte.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="#contratar" className="btn-pill btn-pill-primary">
              Contratar equipe <ArrowRight className="h-4 w-4" />
            </a>
            <Link to="/recrutamento" className="btn-pill btn-pill-outline">
              Quero ser atendente
            </Link>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-muted-foreground">
            <span>+12 servidores ativos</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>+8.000 tickets/mês</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Resposta média &lt; 4 min</span>
          </div>
        </div>
      </section>

      {/* O QUE FAZEMOS */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-accent">O que fazemos</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Uma operação de suporte completa, entregue como serviço.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Users,
              t: "Recrutamento criterioso",
              d: "Processo seletivo de 3 etapas com prova prática para garantir aderência ao tom da sua marca.",
            },
            {
              icon: Workflow,
              t: "Treinamento contínuo",
              d: "Onboarding sobre o seu produto + reciclagem mensal de scripts, políticas e tom de voz.",
            },
            {
              icon: Headphones,
              t: "Atendimento 7 dias",
              d: "Equipes em escalas que cobrem horários críticos. SLA configurável por canal.",
            },
            {
              icon: ShieldCheck,
              t: "Moderação inclusa",
              d: "Time treinado para identificar abusos, golpes e violações de regra antes que escalem.",
            },
            {
              icon: Zap,
              t: "Integração nativa",
              d: "Plugin para o seu bot de ticket replica conversas em tempo real para o painel Shared Solve.",
            },
            {
              icon: MessagesSquare,
              t: "Coordenação dedicada",
              d: "Um líder de squad responsável pelos seus KPIs, reportando direto à sua equipe.",
            },
          ].map((s) => (
            <div
              key={s.t}
              className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <s.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 font-semibold">{s.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-accent">Como funciona</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Do briefing à operação rodando em menos de 7 dias.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            {[
              { n: "01", t: "Briefing", d: "Você conta sobre o produto, o público e os SLAs esperados." },
              { n: "02", t: "Match de equipe", d: "Selecionamos atendentes já treinados no seu nicho." },
              { n: "03", t: "Integração", d: "Conectamos seu bot de ticket ao painel da Shared Solve." },
              { n: "04", t: "Operação", d: "Tickets fluem 24/7 com dashboards e relatórios semanais." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-border bg-background p-6">
                <p className="font-display text-2xl font-bold text-accent">{s.n}</p>
                <p className="mt-4 font-semibold">{s.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING / CONTRATAR */}
      <section id="contratar" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-widest text-accent">Contratar</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Planos que escalam com seu servidor.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              name: "Starter",
              price: "R$ 1.490",
              sub: "/mês",
              desc: "Para comunidades em crescimento.",
              features: ["1 atendente dedicado", "Até 500 tickets/mês", "Horário comercial", "Relatório mensal"],
              cta: "Falar com vendas",
              highlight: false,
            },
            {
              name: "Growth",
              price: "R$ 3.890",
              sub: "/mês",
              desc: "Operação contínua com squad.",
              features: ["Squad de 3 atendentes", "Até 2.500 tickets/mês", "Cobertura 7 dias", "Coordenador dedicado", "Moderação inclusa"],
              cta: "Começar agora",
              highlight: true,
            },
            {
              name: "Enterprise",
              price: "Sob consulta",
              sub: "",
              desc: "Para grandes comunidades e empresas.",
              features: ["Squads múltiplos", "Tickets ilimitados", "24/7 com SLA contratual", "Integrações customizadas", "Account manager"],
              cta: "Conversar com time",
              highlight: false,
            },
          ].map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl border p-6 ${
                p.highlight
                  ? "border-accent bg-accent/[0.04] shadow-[var(--shadow-glow)]"
                  : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
                  Mais escolhido
                </span>
              )}
              <p className="font-display text-lg font-semibold">{p.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-3xl font-bold">{p.price}</span>
                <span className="text-xs text-muted-foreground">{p.sub}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noreferrer"
                className={`btn-pill mt-8 w-full justify-center ${
                  p.highlight ? "btn-pill-primary" : "btn-pill-outline"
                }`}
              >
                {p.cta} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="hero-glow relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">
            Pronto para terceirizar seu atendimento?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Fale com a gente no Discord. Em poucos minutos te apresentamos uma proposta sob medida.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn-pill btn-pill-discord">
              <DiscordIcon className="h-4 w-4" /> Falar no Discord
            </a>
            <Link to="/recrutamento" className="btn-pill btn-pill-outline">
              Quero trabalhar na Shared Solve
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
