import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DiscordIcon } from "@/components/DiscordIcon";
import { getSession, setSession } from "@/lib/session";
import {
  Inbox,
  LayoutDashboard,
  Wallet,
  ShoppingBag,
  Settings,
  LogOut,
  Search,
  Send,
  Hash,
  Circle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  Award,
  Coins,
  ArrowUpRight,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/atendimento")({
  head: () => ({ meta: [{ title: "Painel do atendente — Shared Solve" }] }),
  component: AtendimentoPage,
});

type Tab = "tickets" | "dashboard" | "saldo" | "loja" | "config";

function AtendimentoPage() {
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("tickets");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate({ to: "/login", search: { redirect: "/atendimento" } as never });
      return;
    }
    setAuthed(true);
  }, [navigate]);

  if (!authed) return null;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      <Sidebar tab={tab} setTab={setTab} />
      <main className="flex flex-1 flex-col overflow-hidden">
        {tab === "tickets" && <TicketsView />}
        {tab === "dashboard" && <DashboardView />}
        {tab === "saldo" && <SaldoView />}
        {tab === "loja" && <LojaView />}
        {tab === "config" && <ConfigView />}
      </main>
    </div>
  );
}

/* ============================== SIDEBAR ============================== */

function Sidebar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const navigate = useNavigate();
  const session = getSession();
  const items: { id: Tab; label: string; icon: typeof Inbox; badge?: string }[] = [
    { id: "tickets", label: "Tickets", icon: Inbox, badge: "8" },
    { id: "dashboard", label: "Área do atendente", icon: LayoutDashboard },
    { id: "saldo", label: "Saldo & saques", icon: Wallet },
    { id: "loja", label: "Loja de recompensas", icon: ShoppingBag },
    { id: "config", label: "Configurações", icon: Settings },
  ];
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/40">
      <Link to="/" className="flex items-center gap-2 border-b border-border px-5 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground font-display text-sm font-bold text-background">
          S
        </div>
        <span className="font-display text-sm font-semibold">Shared Solve</span>
      </Link>

      <nav className="flex-1 space-y-0.5 p-3">
        <p className="px-3 pb-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Operação
        </p>
        {items.map((it) => {
          const active = tab === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-accent/10 text-foreground"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <it.icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} />
                {it.label}
              </span>
              {it.badge && (
                <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                  {it.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg p-2">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--discord)] text-sm font-bold text-white">
              {session?.avatar}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-accent" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{session?.username}</p>
            <p className="truncate text-[11px] text-muted-foreground">Atendente · Online</p>
          </div>
          <button
            onClick={() => {
              setSession(null);
              navigate({ to: "/" });
            }}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-card hover:text-foreground"
            title="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ============================== TICKETS ============================== */

type Ticket = {
  id: string;
  user: { name: string; avatar: string };
  company: { name: string; tag: string; color: string };
  subject: string;
  last: string;
  status: "open" | "waiting" | "closed";
  unread: number;
  time: string;
  priority: "low" | "med" | "high";
};

const MOCK_TICKETS: Ticket[] = [
  {
    id: "T-2841",
    user: { name: "joaopx", avatar: "JP" },
    company: { name: "NovaPlay", tag: "NP", color: "oklch(0.65 0.18 25)" },
    subject: "Não recebi meu produto Premium",
    last: "paguei R$50 e ainda não recebi nada…",
    status: "open",
    unread: 3,
    time: "agora",
    priority: "high",
  },
  {
    id: "T-2840",
    user: { name: "maria_v", avatar: "MV" },
    company: { name: "GuildaX", tag: "GX", color: "oklch(0.7 0.16 280)" },
    subject: "Como troco de plano?",
    last: "queria saber se posso fazer upgrade no meio do mês",
    status: "waiting",
    unread: 1,
    time: "2 min",
    priority: "med",
  },
  {
    id: "T-2839",
    user: { name: "ricardo.kz", avatar: "RK" },
    company: { name: "NovaPlay", tag: "NP", color: "oklch(0.65 0.18 25)" },
    subject: "Bug no painel",
    last: "to vendo um erro 500 quando entro",
    status: "open",
    unread: 2,
    time: "5 min",
    priority: "med",
  },
  {
    id: "T-2838",
    user: { name: "anna.dev", avatar: "AD" },
    company: { name: "Codex Hub", tag: "CH", color: "oklch(0.7 0.14 200)" },
    subject: "Reembolso do plano anual",
    last: "preciso cancelar e pedir reembolso",
    status: "waiting",
    unread: 0,
    time: "12 min",
    priority: "high",
  },
  {
    id: "T-2837",
    user: { name: "felipe_b", avatar: "FB" },
    company: { name: "GuildaX", tag: "GX", color: "oklch(0.7 0.16 280)" },
    subject: "Dúvida sobre cargo VIP",
    last: "obrigado pela ajuda!",
    status: "closed",
    unread: 0,
    time: "1h",
    priority: "low",
  },
  {
    id: "T-2836",
    user: { name: "leo.r", avatar: "LR" },
    company: { name: "Codex Hub", tag: "CH", color: "oklch(0.7 0.14 200)" },
    subject: "Não consigo logar",
    last: "ta dando erro de senha",
    status: "open",
    unread: 1,
    time: "1h",
    priority: "med",
  },
];

function TicketsView() {
  const [selected, setSelected] = useState<string>(MOCK_TICKETS[0].id);
  const [filter, setFilter] = useState<"all" | "open" | "waiting" | "closed">("all");
  const tickets = useMemo(
    () => (filter === "all" ? MOCK_TICKETS : MOCK_TICKETS.filter((t) => t.status === filter)),
    [filter],
  );
  const current = MOCK_TICKETS.find((t) => t.id === selected) ?? MOCK_TICKETS[0];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* List */}
      <div className="flex w-[360px] shrink-0 flex-col border-r border-border">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-lg font-semibold">Fila de tickets</h1>
            <button className="rounded-md p-1.5 text-muted-foreground hover:bg-card hover:text-foreground">
              <Filter className="h-4 w-4" />
            </button>
          </div>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar usuário, empresa, assunto…"
              className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-accent"
            />
          </div>
          <div className="mt-3 flex gap-1">
            {(["all", "open", "waiting", "closed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 text-[11px] capitalize transition-colors ${
                  filter === f
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f === "open" ? "Abertos" : f === "waiting" ? "Aguardando" : "Fechados"}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tickets.map((t) => {
            const active = selected === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`flex w-full gap-3 border-b border-border p-4 text-left transition-colors ${
                  active ? "bg-accent/5" : "hover:bg-card/60"
                }`}
              >
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-background"
                  style={{ backgroundColor: t.company.color }}
                  title={t.company.name}
                >
                  {t.company.tag}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium">{t.user.name}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{t.time}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-foreground">{t.subject}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{t.last}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <StatusPill status={t.status} />
                    <span className="text-[10px] text-muted-foreground">· {t.company.name}</span>
                    {t.unread > 0 && (
                      <span className="ml-auto rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">
                        {t.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conversation */}
      <TicketConversation ticket={current} />
    </div>
  );
}

function StatusPill({ status }: { status: Ticket["status"] }) {
  const map = {
    open: { label: "aberto", color: "text-accent", dot: "bg-accent" },
    waiting: { label: "aguardando", color: "text-amber-400", dot: "bg-amber-400" },
    closed: { label: "fechado", color: "text-muted-foreground", dot: "bg-muted-foreground" },
  } as const;
  const v = map[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] ${v.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} />
      {v.label}
    </span>
  );
}

function TicketConversation({ ticket }: { ticket: Ticket }) {
  const [draft, setDraft] = useState("");
  const messages = [
    { from: "user" as const, text: "Oi boa tarde 😞", t: "14:32" },
    { from: "user" as const, text: ticket.last, t: "14:32" },
    {
      from: "agent" as const,
      text: "Oi! Tudo bem? Já estou verificando seu caso. Pode me passar o ID do pedido?",
      t: "14:33",
    },
    { from: "user" as const, text: "claro, é #PD-19284", t: "14:34" },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card/40 px-6 py-3.5">
        <div className="flex items-center gap-3">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">ticket-{ticket.id.toLowerCase()}</p>
            <p className="text-[11px] text-muted-foreground">
              {ticket.subject} · {ticket.company.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-1 text-[10px] text-muted-foreground">
            Prioridade: {ticket.priority === "high" ? "Alta" : ticket.priority === "med" ? "Média" : "Baixa"}
          </span>
          <button className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-card">
            Transferir
          </button>
          <button className="btn-pill btn-pill-primary !py-1.5 !px-3 !text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Resolver
          </button>
        </div>
      </div>

      {/* Channel context bar */}
      <div className="flex items-center gap-2 border-b border-border bg-background/60 px-6 py-2 text-[11px] text-muted-foreground">
        <Circle className="h-2 w-2 fill-accent text-accent" />
        Conectado via plugin Shared Solve ao servidor <strong className="text-foreground">{ticket.company.name}</strong> · canal #suporte-tickets
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
        {messages.map((m, i) => {
          const isAgent = m.from === "agent";
          return (
            <div key={i} className="flex gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                  isAgent ? "bg-accent text-accent-foreground" : "bg-[var(--discord)]"
                }`}
              >
                {isAgent ? "SS" : ticket.user.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className={`text-sm font-semibold ${isAgent ? "text-accent" : ""}`}>
                    {isAgent ? "Você" : ticket.user.name}
                  </span>
                  {isAgent && (
                    <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-accent">
                      Atendente
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">Hoje às {m.t}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed text-foreground/90">{m.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Composer */}
      <div className="border-t border-border bg-card/40 px-6 py-4">
        <div className="flex items-end gap-2 rounded-xl border border-border bg-background px-3 py-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`Mensagem para #ticket-${ticket.id.toLowerCase()}`}
            rows={1}
            className="flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="rounded-lg bg-accent p-2 text-accent-foreground transition-opacity hover:opacity-90">
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Cada ticket resolvido gera <strong className="text-accent">R$ 1,20</strong> em saldo na sua conta.
        </p>
      </div>
    </div>
  );
}

/* ============================== DASHBOARD ============================== */

function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/40 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Área do atendente</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sua performance, ranking e ganhos do mês.
        </p>
      </div>

      <div className="space-y-6 p-8">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Tickets resolvidos" value="284" sub="+12% vs. mês anterior" icon={CheckCircle2} accent />
          <StatCard label="Tempo médio" value="3m 42s" sub="meta: < 5 min" icon={Clock} />
          <StatCard label="Avaliação" value="4.9" sub="de 5.0 · 218 votos" icon={Star} />
          <StatCard label="Saldo no mês" value="R$ 340,80" sub="+R$ 28,40 hoje" icon={Coins} accent />
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">Atividade dos últimos 14 dias</p>
                <p className="text-xs text-muted-foreground">Tickets resolvidos por dia</p>
              </div>
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <FakeChart />
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" />
              <p className="font-semibold">Ranking da semana</p>
            </div>
            <ul className="mt-4 space-y-3">
              {[
                { p: 1, n: "ana.lv", t: 98, you: false },
                { p: 2, n: "lucas.sv", t: 84, you: true },
                { p: 3, n: "rafa_2", t: 71, you: false },
                { p: 4, n: "duda.pq", t: 62, you: false },
                { p: 5, n: "thi.mr", t: 55, you: false },
              ].map((r) => (
                <li
                  key={r.n}
                  className={`flex items-center gap-3 rounded-lg p-2 ${
                    r.you ? "bg-accent/10" : ""
                  }`}
                >
                  <span className="w-5 text-xs font-bold text-muted-foreground">#{r.p}</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--discord)] text-[10px] font-bold text-white">
                    {r.n.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="flex-1 text-sm">
                    {r.n}{" "}
                    {r.you && (
                      <span className="text-[10px] text-accent">(você)</span>
                    )}
                  </span>
                  <span className="text-xs font-semibold">{r.t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Empresas que você atende</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { n: "NovaPlay", t: 142, c: "oklch(0.65 0.18 25)" },
              { n: "GuildaX", t: 89, c: "oklch(0.7 0.16 280)" },
              { n: "Codex Hub", t: 53, c: "oklch(0.7 0.14 200)" },
            ].map((c) => (
              <div key={c.n} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold text-background"
                  style={{ backgroundColor: c.c }}
                >
                  {c.n.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{c.n}</p>
                  <p className="text-[11px] text-muted-foreground">{c.t} tickets · este mês</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: typeof Inbox;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        accent ? "border-accent/30 bg-accent/[0.04]" : "border-border bg-card"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${accent ? "text-accent" : "text-muted-foreground"}`} />
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{sub}</p>
    </div>
  );
}

function FakeChart() {
  const bars = [40, 55, 38, 62, 70, 48, 80, 65, 90, 72, 60, 85, 95, 78];
  const max = Math.max(...bars);
  return (
    <div className="mt-6 flex h-40 items-end gap-2">
      {bars.map((b, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-gradient-to-t from-accent/60 to-accent"
            style={{ height: `${(b / max) * 100}%` }}
          />
          <span className="text-[9px] text-muted-foreground">{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================== SALDO ============================== */

function SaldoView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/40 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Saldo & saques</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Cada ticket resolvido vira saldo. Saque via Pix ou troque por recompensas.
        </p>
      </div>

      <div className="space-y-6 p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-accent/30 bg-accent/[0.05] p-6 md:col-span-2">
            <p className="text-xs text-muted-foreground">Saldo disponível</p>
            <p className="mt-2 font-display text-5xl font-bold">R$ 340,80</p>
            <p className="mt-1 text-xs text-muted-foreground">Acumulado em 284 tickets este mês</p>
            <div className="mt-6 flex gap-2">
              <button className="btn-pill btn-pill-primary">
                Sacar via Pix <ArrowUpRight className="h-4 w-4" />
              </button>
              <button className="btn-pill btn-pill-outline">Trocar por recompensa</button>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="text-xs text-muted-foreground">Acumulado total</p>
            <p className="mt-2 font-display text-3xl font-bold">R$ 2.184,60</p>
            <p className="mt-1 text-xs text-muted-foreground">Desde mar/2025</p>
            <div className="mt-6 space-y-2 border-t border-border pt-4 text-xs">
              <Row k="Valor por ticket" v="R$ 1,20" />
              <Row k="Bônus de avaliação 5★" v="+R$ 0,30" />
              <Row k="Mínimo para saque" v="R$ 50,00" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <p className="font-semibold">Histórico</p>
          </div>
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium">Data</th>
                <th className="px-6 py-3 text-left font-medium">Descrição</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Valor</th>
              </tr>
            </thead>
            <tbody>
              {[
                { d: "16/05", desc: "Saque via Pix", s: "concluído", v: "-R$ 200,00", neg: true },
                { d: "16/05", desc: "284 tickets · NovaPlay", s: "creditado", v: "+R$ 56,40" },
                { d: "15/05", desc: "Bônus avaliação 5★", s: "creditado", v: "+R$ 12,00" },
                { d: "14/05", desc: "Troca · Nitro Mensal", s: "entregue", v: "-R$ 45,00", neg: true },
                { d: "12/05", desc: "189 tickets · GuildaX", s: "creditado", v: "+R$ 226,80" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 text-xs text-muted-foreground">{r.d}</td>
                  <td className="px-6 py-3">{r.desc}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                      {r.s}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-3 text-right font-semibold ${
                      r.neg ? "text-muted-foreground" : "text-accent"
                    }`}
                  >
                    {r.v}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}

/* ============================== LOJA ============================== */

function LojaView() {
  const items = [
    { n: "Discord Nitro · 1 mês", p: 45, tag: "Popular" },
    { n: "Steam Gift Card R$ 50", p: 60 },
    { n: "Cargo VIP Shared Solve", p: 30, tag: "Exclusivo" },
    { n: "Mentoria 1:1 com coordenador", p: 80 },
    { n: "Camiseta Shared Solve", p: 120 },
    { n: "Curso de atendimento avançado", p: 150, tag: "Novo" },
  ];
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/40 px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold">Loja de recompensas</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Troque seu saldo por benefícios e produtos exclusivos.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2">
            <Coins className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold">R$ 340,80</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => (
          <div
            key={it.n}
            className="group flex flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
          >
            <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-background">
              <ShoppingBag className="h-10 w-10 text-accent/70" />
            </div>
            <div className="mt-4 flex items-start justify-between gap-2">
              <p className="font-semibold leading-snug">{it.n}</p>
              {it.tag && (
                <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-bold text-accent">
                  {it.tag}
                </span>
              )}
            </div>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="font-display text-lg font-bold">R$ {it.p}</span>
              <button className="btn-pill btn-pill-outline !py-1.5 !px-3 !text-xs">
                Trocar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================== CONFIG ============================== */

function ConfigView() {
  const s = getSession();
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/40 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Configurações</h1>
      </div>
      <div className="max-w-2xl space-y-4 p-8">
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Conta Discord vinculada</p>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-background p-4">
            <DiscordIcon className="h-6 w-6 text-[var(--discord)]" />
            <div className="flex-1">
              <p className="text-sm font-medium">
                {s?.username}
                {s?.tag}
              </p>
              <p className="text-[11px] text-muted-foreground">Cargo verificado: Atendente</p>
            </div>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold text-accent">
              Ativo
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Pix para saques</p>
          <input
            placeholder="sua-chave@pix.com"
            className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="font-semibold">Disponibilidade</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Defina os horários em que você está disponível para receber tickets.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Manhã", "Tarde", "Noite", "Madrugada", "Fim de semana"].map((h) => (
              <button
                key={h}
                className="rounded-full border border-border px-3 py-1.5 text-xs hover:border-accent"
              >
                {h}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
