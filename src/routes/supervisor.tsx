import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, setSession, MOCK_SUPERVISOR } from "@/lib/session";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { StatusIndicator } from "@/components/StatusIndicator";
import {
  Users,
  Inbox,
  Clock,
  TrendingUp,
  AlertTriangle,
  Eye,
  ShieldAlert,
  Ban,
  FileText,
  Activity,
  BarChart3,
  CheckCircle2,
  Star,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/supervisor")({
  head: () => ({ meta: [{ title: "Central do Supervisor — Shared Solve" }] }),
  component: SupervisorPage,
});

type Tab = "overview" | "agents" | "tickets" | "analytics" | "config";

const MOCK_AGENTS = [
  { id: "1", name: "lucas.sv", avatar: "LS", status: "online" as const, company: "BR PAY", companyColor: "var(--brpay)", ticket: "T-2841", time: "2h 14m", tickets: 18, score: 94 },
  { id: "2", name: "ana.lv", avatar: "AL", status: "online" as const, company: "PAGCI", companyColor: "var(--pagci)", ticket: "T-2840", time: "3h 02m", tickets: 24, score: 98 },
  { id: "3", name: "rafa_2", avatar: "R2", status: "busy" as const, company: "ALLBAY", companyColor: "var(--allbay)", ticket: "T-2839", time: "1h 45m", tickets: 15, score: 87 },
  { id: "4", name: "duda.pq", avatar: "DP", status: "online" as const, company: "EASE SOLUTIONS", companyColor: "var(--ease)", ticket: "T-2838", time: "4h 10m", tickets: 21, score: 91 },
  { id: "5", name: "thi.mr", avatar: "TM", status: "away" as const, company: "BR PAY", companyColor: "var(--brpay)", ticket: "-", time: "0m", tickets: 12, score: 82 },
  { id: "6", name: "bea.costa", avatar: "BC", status: "offline" as const, company: "PAGCI", companyColor: "var(--pagci)", ticket: "-", time: "-", tickets: 0, score: 89 },
  { id: "7", name: "pedro.hx", avatar: "PH", status: "online" as const, company: "ALLBAY", companyColor: "var(--allbay)", ticket: "T-2835", time: "1h 30m", tickets: 16, score: 93 },
  { id: "8", name: "carol.mg", avatar: "CM", status: "online" as const, company: "EASE SOLUTIONS", companyColor: "var(--ease)", ticket: "T-2834", time: "2h 55m", tickets: 19, score: 96 },
];

const ALERTS = [
  { type: "warning", msg: "SLA estourando no ticket T-2841 (BR PAY) — 4m sem resposta", time: "agora" },
  { type: "info", msg: "thi.mr ficou ausente ha 15 minutos", time: "15 min" },
  { type: "success", msg: "ana.lv bateu recorde: 24 tickets em 3h", time: "28 min" },
  { type: "warning", msg: "Volume de tickets ALLBAY acima da media (+40%)", time: "1h" },
];

const LOGS = [
  { time: "14:42", agent: "lucas.sv", action: "Resolveu ticket T-2837", type: "success" },
  { time: "14:38", agent: "ana.lv", action: "Iniciou atendimento T-2841", type: "info" },
  { time: "14:35", agent: "rafa_2", action: "Transferiu T-2839 para lucas.sv", type: "info" },
  { time: "14:30", agent: "duda.pq", action: "Recebeu advertencia — tempo de resposta", type: "warning" },
  { time: "14:22", agent: "thi.mr", action: "Status alterado para ausente", type: "warning" },
  { time: "14:15", agent: "carol.mg", action: "Resolveu ticket T-2833", type: "success" },
];

function SupervisorPage() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(getSession());
  const [tab, setTab] = useState<Tab>("overview");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      setSession(MOCK_SUPERVISOR);
      setSessionState(MOCK_SUPERVISOR);
      return;
    }
    setSessionState(s);
  }, [navigate]);

  if (!session) return null;

  return (
    <DashboardLayout activeTab={tab} onTabChange={(t) => setTab(t as Tab)} session={{ ...session, role: "supervisor" }}>
      {tab === "overview" && <OverviewView />}
      {tab === "agents" && <AgentsView />}
      {tab === "tickets" && <TicketsView />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "config" && <ConfigView />}
    </DashboardLayout>
  );
}

/* ===== OVERVIEW ===== */

function OverviewView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Centro de Comando</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visao geral da operacao em tempo real.</p>
      </div>

      <div className="space-y-6 p-8">
        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <SummaryCard label="Atendentes online" value="6" icon={Users} color="text-accent" />
          <SummaryCard label="Tickets ativos" value="24" icon={Inbox} color="text-brpay" />
          <SummaryCard label="SLA medio" value="98.2%" icon={TrendingUp} color="text-accent" />
          <SummaryCard label="Tempo medio resposta" value="2m 48s" icon={Clock} color="text-ease" />
        </div>

        {/* Alerts */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-pagci" />
            <p className="font-semibold">Alertas em tempo real</p>
          </div>
          <div className="mt-4 space-y-2">
            {ALERTS.map((a, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-xl p-3 text-sm ${
                  a.type === "warning" ? "bg-pagci/5 border border-pagci/20" :
                  a.type === "success" ? "bg-accent/5 border border-accent/20" :
                  "bg-card border border-border"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${
                  a.type === "warning" ? "bg-pagci" :
                  a.type === "success" ? "bg-accent" :
                  "bg-brpay"
                }`} />
                <span className="flex-1">{a.msg}</span>
                <span className="text-xs text-muted-foreground">{a.time}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Quick agent status */}
          <GlassCard className="p-6">
            <p className="font-semibold">Status dos atendentes</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {MOCK_AGENTS.slice(0, 6).map((a) => (
                <div key={a.id} className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
                  <div className="relative">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-discord text-[10px] font-bold text-foreground">
                      {a.avatar}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <StatusIndicator status={a.status} size="sm" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.company} · {a.tickets} tickets</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Activity log */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-accent" />
              <p className="font-semibold">Log de atividades</p>
            </div>
            <div className="mt-4 space-y-3">
              {LOGS.map((l, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 text-[10px] font-mono text-muted-foreground">{l.time}</span>
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    l.type === "success" ? "bg-accent" : l.type === "warning" ? "bg-pagci" : "bg-brpay"
                  }`} />
                  <span>
                    <strong className="text-foreground">{l.agent}</strong>{" "}
                    <span className="text-muted-foreground">{l.action}</span>
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Company performance */}
        <GlassCard className="p-6">
          <p className="font-semibold">Performance por empresa</p>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {[
              { n: "BR PAY", c: "var(--brpay)", tickets: 142, sla: "98.7%", avg: "2m 32s" },
              { n: "PAGCI", c: "var(--pagci)", tickets: 89, sla: "99.1%", avg: "2m 18s" },
              { n: "ALLBAY", c: "var(--allbay)", tickets: 124, sla: "97.9%", avg: "3m 05s" },
              { n: "EASE SOLUTIONS", c: "var(--ease)", tickets: 67, sla: "99.5%", avg: "1m 54s" },
            ].map((c) => (
              <div key={c.n} className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded" style={{ backgroundColor: c.c }} />
                  <p className="text-sm font-semibold">{c.n}</p>
                </div>
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Tickets</span><span className="font-medium">{c.tickets}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">SLA</span><span className="font-medium" style={{ color: c.c }}>{c.sla}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tempo medio</span><span className="font-medium">{c.avg}</span></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Users; color: string }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <p className="mt-3 font-display text-3xl font-bold">{value}</p>
    </GlassCard>
  );
}

/* ===== AGENTS ===== */

function AgentsView() {
  const [filterStatus, setFilterStatus] = useState<"all" | "online" | "busy" | "away" | "offline">("all");
  const filtered = filterStatus === "all" ? MOCK_AGENTS : MOCK_AGENTS.filter((a) => a.status === filterStatus);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Monitoramento de Atendentes</h1>
        <p className="mt-1 text-sm text-muted-foreground">Acompanhe cada atendente em tempo real.</p>
      </div>

      <div className="p-8">
        <div className="mb-6 flex gap-2">
          {(["all", "online", "busy", "away", "offline"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                filterStatus === f ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground"
              }`}
            >
              {f === "all" ? "Todos" : f === "online" ? "Online" : f === "busy" ? "Ocupado" : f === "away" ? "Ausente" : "Offline"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((a) => (
            <GlassCard key={a.id} className="p-5 transition-all hover:glow-card">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-discord text-xs font-bold text-foreground">
                    {a.avatar}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5">
                    <StatusIndicator status={a.status} size="sm" />
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="text-[10px] text-muted-foreground">{a.company}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket atual</span>
                  <span className="font-mono font-medium">{a.ticket}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo ativo</span>
                  <span className="font-medium">{a.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tickets hoje</span>
                  <span className="font-medium">{a.tickets}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Score</span>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-16 rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${a.score}%` }}
                      />
                    </div>
                    <span className="font-medium text-accent">{a.score}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-1.5">
                <button className="flex-1 rounded-lg border border-border px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-card hover:text-foreground" title="Acompanhar">
                  <Eye className="mx-auto h-3.5 w-3.5" />
                </button>
                <button className="flex-1 rounded-lg border border-border px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-card hover:text-foreground" title="Advertir">
                  <ShieldAlert className="mx-auto h-3.5 w-3.5" />
                </button>
                <button className="flex-1 rounded-lg border border-border px-2 py-1.5 text-[10px] text-muted-foreground hover:bg-card hover:text-foreground" title="Logs">
                  <FileText className="mx-auto h-3.5 w-3.5" />
                </button>
                <button className="flex-1 rounded-lg border border-destructive/30 px-2 py-1.5 text-[10px] text-destructive hover:bg-destructive/10" title="Bloquear">
                  <Ban className="mx-auto h-3.5 w-3.5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ===== TICKETS (Supervisor view) ===== */

function TicketsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Visao de Tickets</h1>
        <p className="mt-1 text-sm text-muted-foreground">Todos os tickets ativos em todas as empresas.</p>
      </div>
      <div className="p-8">
        <GlassCard className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">Empresa</th>
                <th className="px-6 py-3 text-left font-medium">Atendente</th>
                <th className="px-6 py-3 text-left font-medium">Assunto</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Prioridade</th>
                <th className="px-6 py-3 text-left font-medium">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "T-2841", co: "BR PAY", cc: "var(--brpay)", agent: "lucas.sv", sub: "Nao recebi meu produto", st: "open", pr: "high", time: "4m" },
                { id: "T-2840", co: "PAGCI", cc: "var(--pagci)", agent: "ana.lv", sub: "Como troco de plano?", st: "waiting", pr: "med", time: "12m" },
                { id: "T-2839", co: "ALLBAY", cc: "var(--allbay)", agent: "rafa_2", sub: "Bug no painel", st: "open", pr: "med", time: "18m" },
                { id: "T-2838", co: "EASE SOLUTIONS", cc: "var(--ease)", agent: "duda.pq", sub: "Reembolso plano anual", st: "waiting", pr: "high", time: "25m" },
                { id: "T-2835", co: "ALLBAY", cc: "var(--allbay)", agent: "pedro.hx", sub: "Erro na entrega", st: "open", pr: "med", time: "32m" },
                { id: "T-2834", co: "EASE SOLUTIONS", cc: "var(--ease)", agent: "carol.mg", sub: "Integracao API", st: "open", pr: "low", time: "45m" },
              ].map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0 hover:bg-card/30">
                  <td className="px-6 py-3 font-mono text-xs font-medium">{t.id}</td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: t.cc }} />
                      <span className="text-xs">{t.co}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs">{t.agent}</td>
                  <td className="px-6 py-3 text-xs">{t.sub}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] ${
                      t.st === "open" ? "text-accent" : "text-pagci"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${t.st === "open" ? "bg-accent" : "bg-pagci"}`} />
                      {t.st === "open" ? "Aberto" : "Aguardando"}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] ${
                      t.pr === "high" ? "border-destructive/30 text-destructive" : t.pr === "med" ? "border-pagci/30 text-pagci" : "border-border text-muted-foreground"
                    }`}>
                      {t.pr === "high" ? "Alta" : t.pr === "med" ? "Media" : "Baixa"}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-xs text-muted-foreground">{t.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===== ANALYTICS ===== */

function AnalyticsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Metricas detalhadas da operacao.</p>
      </div>
      <div className="space-y-6 p-8">
        <div className="grid gap-4 md:grid-cols-3">
          <GlassCard className="p-6">
            <p className="text-xs text-muted-foreground">Taxa de resolucao</p>
            <p className="mt-2 font-display text-4xl font-bold text-accent">94.3%</p>
            <p className="mt-1 text-xs text-muted-foreground">+2.1% vs. semana anterior</p>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-xs text-muted-foreground">CSAT medio</p>
            <p className="mt-2 font-display text-4xl font-bold">4.8</p>
            <div className="mt-2 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= 4 ? "fill-accent text-accent" : "fill-accent/30 text-accent/30"}`} />
              ))}
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="text-xs text-muted-foreground">Tickets esta semana</p>
            <p className="mt-2 font-display text-4xl font-bold">
              <AnimatedCounter value={1284} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Meta: 1.500</p>
          </GlassCard>
        </div>

        {/* Ranking global */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-accent" />
            <p className="font-semibold">Ranking global da semana</p>
          </div>
          <div className="mt-4 space-y-2">
            {MOCK_AGENTS
              .sort((a, b) => b.tickets - a.tickets)
              .map((a, i) => (
                <div key={a.id} className={`flex items-center gap-3 rounded-xl p-3 ${i < 3 ? "bg-accent/5" : ""}`}>
                  <span className="w-6 text-center text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-discord text-[10px] font-bold text-foreground">
                    {a.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{a.name}</p>
                    <p className="text-[10px] text-muted-foreground">{a.company}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">{a.tickets} tickets</span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 w-20 rounded-full bg-border">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${a.score}%` }} />
                      </div>
                      <span className="font-semibold text-accent">{a.score}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===== CONFIG ===== */

function ConfigView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Configuracoes</h1>
      </div>
      <div className="max-w-2xl space-y-4 p-8">
        <GlassCard className="p-6">
          <p className="font-semibold">SLA por empresa</p>
          <p className="mt-1 text-xs text-muted-foreground">Configure o tempo maximo de resposta por empresa.</p>
          <div className="mt-4 space-y-3">
            {[
              { n: "BR PAY", c: "var(--brpay)", sla: "5 min" },
              { n: "PAGCI", c: "var(--pagci)", sla: "4 min" },
              { n: "ALLBAY", c: "var(--allbay)", sla: "6 min" },
              { n: "EASE SOLUTIONS", c: "var(--ease)", sla: "3 min" },
            ].map((c) => (
              <div key={c.n} className="flex items-center justify-between rounded-xl border border-border bg-background p-3">
                <span className="flex items-center gap-2 text-sm">
                  <span className="h-2.5 w-2.5 rounded" style={{ backgroundColor: c.c }} />
                  {c.n}
                </span>
                <input
                  defaultValue={c.sla}
                  className="w-20 rounded-lg border border-border bg-card px-2 py-1 text-center text-xs outline-none focus:border-accent"
                />
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard className="p-6">
          <p className="font-semibold">Notificacoes</p>
          <p className="mt-1 text-xs text-muted-foreground">Configure quando voce quer ser alertado.</p>
          <div className="mt-4 space-y-3">
            {["SLA estourando", "Atendente offline", "Volume anormal", "Ticket sem resposta > 5min"].map((n) => (
              <label key={n} className="flex items-center justify-between rounded-xl border border-border bg-background p-3 text-sm">
                {n}
                <input type="checkbox" defaultChecked className="h-4 w-4 accent-accent" />
              </label>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
