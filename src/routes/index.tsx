import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter, DISCORD_URL } from "@/components/SiteHeader";
import { DiscordIcon } from "@/components/DiscordIcon";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { GlassCard } from "@/components/GlassCard";
import {
  ArrowRight,
  Headphones,
  ShieldCheck,
  Users,
  Workflow,
  Zap,
  MessagesSquare,
  CheckCircle2,
  ChevronDown,
  BarChart3,
  Clock,
  TrendingUp,
  Star,
  Activity,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shared Solve — Operacao de Suporte de Elite" },
      {
        name: "description",
        content:
          "Recrutamos, treinamos e operamos equipes de atendimento integradas ao Discord da sua empresa. Resultado em dias, nao em meses.",
      },
    ],
  }),
  component: Home,
});

/* ===== Dados das empresas parceiras ===== */
const PARTNERS = [
  {
    name: "BR PAY",
    tag: "BP",
    color: "var(--brpay)",
    desc: "Plataforma de pagamentos digitais com foco em velocidade e seguranca.",
    tickets: "12.4K",
    sla: "98.7%",
    agents: 32,
    growth: "+28%",
  },
  {
    name: "PAGCI",
    tag: "PG",
    color: "var(--pagci)",
    desc: "Gateway de checkout inteligente para e-commerce de alto volume.",
    tickets: "9.8K",
    sla: "99.1%",
    agents: 24,
    growth: "+45%",
  },
  {
    name: "ALLBAY",
    tag: "AB",
    color: "var(--allbay)",
    desc: "Marketplace premium com operacoes em 3 paises da America Latina.",
    tickets: "15.2K",
    sla: "97.9%",
    agents: 41,
    growth: "+62%",
  },
  {
    name: "EASE SOLUTIONS",
    tag: "ES",
    color: "var(--ease)",
    desc: "SaaS de automacao empresarial para grandes corporacoes.",
    tickets: "5.4K",
    sla: "99.5%",
    agents: 18,
    growth: "+33%",
  },
];

const SERVICES = [
  {
    icon: Headphones,
    t: "Atendimento Omnichannel",
    d: "Equipes treinadas para atender via Discord, chat e ticket com SLA configuravel.",
  },
  {
    icon: ShieldCheck,
    t: "Supervisao em Tempo Real",
    d: "Centro de comando para monitorar cada atendente, ticket e metrica operacional ao vivo.",
  },
  {
    icon: Users,
    t: "Recrutamento Criterioso",
    d: "Processo seletivo de 3 etapas com prova pratica para garantir aderencia ao tom da sua marca.",
  },
  {
    icon: Workflow,
    t: "Gestao Operacional",
    d: "Escalas automaticas, ranking de performance e sistema de ponto integrado.",
  },
  {
    icon: Zap,
    t: "Integracao Nativa",
    d: "Plugin para o seu bot de ticket replica conversas em tempo real para o painel Shared Solve.",
  },
  {
    icon: MessagesSquare,
    t: "Coordenacao Dedicada",
    d: "Um lider de squad responsavel pelos seus KPIs, reportando direto a sua equipe.",
  },
];

const STATS = [
  { label: "Tickets resolvidos", value: 42800, suffix: "+", prefix: "" },
  { label: "Tempo medio de resposta", value: 3, suffix: "min", prefix: "<" },
  { label: "Atendentes ativos", value: 120, suffix: "+", prefix: "" },
  { label: "Uptime operacional", value: 99, suffix: ".97%", prefix: "" },
  { label: "Avaliacoes positivas", value: 98, suffix: ".2%", prefix: "" },
  { label: "Crescimento anual", value: 340, suffix: "%", prefix: "+" },
];

const FAQ_ITEMS = [
  {
    q: "Como funciona a integracao com o meu servidor Discord?",
    a: "Voce adiciona nosso bot ao servidor e ele se conecta automaticamente ao seu sistema de tickets. Os atendentes recebem as conversas no painel Shared Solve e respondem em tempo real.",
  },
  {
    q: "Quanto tempo leva para comecar a operacao?",
    a: "Em media, 5 a 7 dias uteis. Fazemos briefing do produto, selecionamos atendentes ja treinados no seu nicho e configuramos a integracao.",
  },
  {
    q: "Como e feito o controle de qualidade dos atendentes?",
    a: "Temos supervisao em tempo real, sistema de ranking com metricas de performance, avaliacoes de clientes e reciclagem mensal de scripts e politicas.",
  },
  {
    q: "Posso escalar a equipe conforme a demanda?",
    a: "Sim. Nossa operacao e modular — voce pode aumentar ou reduzir atendentes conforme o volume de tickets, sem compromisso de longo prazo.",
  },
  {
    q: "Os atendentes sao exclusivos da minha empresa?",
    a: "No plano Enterprise sim. Nos demais planos, os atendentes podem atuar em multiplas empresas, mas sempre com treinamento especifico para cada uma.",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <HeroSection />
      <ServicesSection />
      <PartnersSection />
      <StatsSection />
      <FaqSection />
      <CtaSection />
      <SiteFooter />
    </div>
  );
}

/* ===== HERO ===== */
function HeroSection() {
  return (
    <section className="hero-glow relative overflow-hidden">
      <ParticlesBackground className="opacity-60" />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pt-24 pb-32 text-center">
        <span className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-status-pulse" />
          Operacao ativa em 4 empresas parceiras
        </span>

        <h1 className="animate-fade-in-up mt-10 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
          Operacao de Suporte
          <br />
          <span className="bg-gradient-to-r from-accent via-ease to-brpay bg-clip-text text-transparent">
            de Elite
          </span>
        </h1>

        <p className="animate-fade-in-up delay-200 mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Recrutamos, treinamos e gerenciamos equipes de atendimento que se conectam
          direto ao seu servidor Discord. Voce foca no produto — a gente cuida do suporte.
        </p>

        <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#contratar" className="btn-pill btn-pill-accent">
            Contratar equipe <ArrowRight className="h-4 w-4" />
          </a>
          <Link to="/recrutamento" className="btn-pill btn-pill-outline">
            Quero ser atendente
          </Link>
        </div>

        {/* Floating indicators */}
        <div className="animate-fade-in-up delay-500 mt-20 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {[
            { icon: Activity, label: "Tickets/mes", val: "42.8K+" },
            { icon: Clock, label: "Resposta media", val: "< 3 min" },
            { icon: TrendingUp, label: "Crescimento", val: "+340%" },
            { icon: Star, label: "Satisfacao", val: "98.2%" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl glass">
                <s.icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm font-bold">{s.val}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== SERVICOS ===== */
function ServicesSection() {
  return (
    <section id="servicos" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">O que fazemos</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl text-balance">
          Uma operacao de suporte completa, entregue como servico.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s, i) => (
          <GlassCard
            key={s.t}
            className={`group p-6 transition-all duration-300 hover:glow-card animate-fade-in-up delay-${(i + 1) * 100}`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
              <s.icon className="h-5 w-5" />
            </div>
            <p className="mt-5 font-display text-base font-semibold">{s.t}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ===== PARCEIROS ===== */
function PartnersSection() {
  return (
    <section id="parceiros" className="border-y border-border bg-card/20">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-14 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Empresas parceiras</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl text-balance">
            Quem confia na Shared Solve para operar seu suporte.
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="group relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:border-opacity-40"
              style={{ "--partner": p.color } as React.CSSProperties}
            >
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px at 50% 0%, ${p.color}08, transparent 70%)` }}
              />
              <div className="relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-background"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.tag}
                    </div>
                    <div>
                      <p className="font-display text-lg font-bold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-4 gap-3">
                  {[
                    { label: "Tickets", value: p.tickets },
                    { label: "SLA", value: p.sla },
                    { label: "Atendentes", value: String(p.agents) },
                    { label: "Crescimento", value: p.growth },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl bg-card/60 p-3 text-center">
                      <p className="font-display text-sm font-bold" style={{ color: p.color }}>
                        {stat.value}
                      </p>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== ESTATISTICAS ===== */
function StatsSection() {
  return (
    <section id="estatisticas" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mb-14 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent">Resultados</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
          Numeros que falam por si.
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STATS.map((s) => (
          <GlassCard key={s.label} className="p-6 text-center">
            <p className="font-display text-3xl font-bold">
              <AnimatedCounter
                value={s.value}
                prefix={s.prefix}
                suffix={s.suffix}
              />
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

/* ===== FAQ ===== */
function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="border-y border-border bg-card/20">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="mb-14 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const open = openIdx === i;
            return (
              <div
                key={i}
                className={`rounded-2xl border transition-all duration-300 ${
                  open ? "border-accent/30 bg-accent/[0.02]" : "border-border bg-background"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="pr-4 font-medium">{item.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${
                      open ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    open ? "max-h-60 pb-5" : "max-h-0"
                  }`}
                >
                  <p className="px-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ===== CTA ===== */
function CtaSection() {
  return (
    <section id="contratar" className="mx-auto max-w-4xl px-6 py-24">
      <div className="hero-glow relative overflow-hidden rounded-3xl border border-border bg-card p-12 text-center md:p-16">
        <h2 className="font-display text-3xl font-bold md:text-5xl text-balance">
          Pronto para escalar seu atendimento?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Fale com a gente no Discord. Em poucos minutos te apresentamos uma proposta sob medida para a sua operacao.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <a href={DISCORD_URL} target="_blank" rel="noreferrer" className="btn-pill btn-pill-discord">
            <DiscordIcon className="h-4 w-4" /> Falar no Discord
          </a>
          <Link to="/recrutamento" className="btn-pill btn-pill-outline">
            Quero trabalhar na Shared Solve
          </Link>
        </div>
      </div>
    </section>
  );
}
