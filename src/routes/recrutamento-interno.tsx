import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getSession, setSession, MOCK_RECRUITER } from "@/lib/session";
import { DashboardLayout } from "@/components/DashboardLayout";
import { GlassCard } from "@/components/GlassCard";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import {
  ClipboardList,
  UserCheck,
  Calendar,
  BarChart3,
  Settings,
  X,
  ChevronRight,
  Mail,
  Phone,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Video,
  MessageCircle,
} from "lucide-react";

export const Route = createFileRoute("/recrutamento-interno")({
  head: () => ({ meta: [{ title: "Central de Recrutamento — Shared Solve" }] }),
  component: RecrutamentoInternoPage,
});

type Tab = "pipeline" | "candidates" | "interviews" | "analytics" | "config";

type Candidate = {
  id: string;
  name: string;
  email: string;
  discord: string;
  area: string;
  score: number;
  total: number;
  status: "new" | "reviewing" | "interview" | "approved" | "rejected";
  date: string;
  avatar: string;
};

const MOCK_CANDIDATES: Candidate[] = [
  { id: "1", name: "Joao Pedro Silva", email: "joao@email.com", discord: "joao.pd#1234", area: "Atendente", score: 4, total: 5, status: "new", date: "16/05", avatar: "JS" },
  { id: "2", name: "Maria Oliveira", email: "maria@email.com", discord: "maria.ol#5678", area: "Atendente", score: 5, total: 5, status: "reviewing", date: "15/05", avatar: "MO" },
  { id: "3", name: "Carlos Santos", email: "carlos@email.com", discord: "carlos.s#9012", area: "Moderador", score: 3, total: 4, status: "interview", date: "14/05", avatar: "CS" },
  { id: "4", name: "Ana Beatriz Lima", email: "ana@email.com", discord: "ana.bl#3456", area: "Atendente", score: 5, total: 5, status: "approved", date: "13/05", avatar: "AL" },
  { id: "5", name: "Rafael Costa", email: "rafael@email.com", discord: "rafa.c#7890", area: "Coordenador", score: 4, total: 4, status: "approved", date: "12/05", avatar: "RC" },
  { id: "6", name: "Beatriz Mendes", email: "bia@email.com", discord: "bia.md#2345", area: "Atendente", score: 2, total: 5, status: "rejected", date: "12/05", avatar: "BM" },
  { id: "7", name: "Lucas Ferreira", email: "lucas.f@email.com", discord: "lucas.f#6789", area: "Moderador", score: 3, total: 4, status: "new", date: "16/05", avatar: "LF" },
  { id: "8", name: "Isabela Rocha", email: "isa@email.com", discord: "isa.r#0123", area: "Atendente", score: 4, total: 5, status: "reviewing", date: "15/05", avatar: "IR" },
  { id: "9", name: "Gustavo Almeida", email: "gus@email.com", discord: "gus.al#4567", area: "Atendente", score: 3, total: 5, status: "new", date: "16/05", avatar: "GA" },
  { id: "10", name: "Fernanda Dias", email: "fer@email.com", discord: "fer.d#8901", area: "Coordenador", score: 4, total: 4, status: "interview", date: "14/05", avatar: "FD" },
];

const INTERVIEWS = [
  { id: "1", candidate: "Carlos Santos", area: "Moderador", date: "17/05", time: "14:00", platform: "Discord", interviewer: "rafa.rh" },
  { id: "2", candidate: "Fernanda Dias", area: "Coordenador", date: "17/05", time: "15:30", platform: "Google Meet", interviewer: "rafa.rh" },
  { id: "3", candidate: "Joao Pedro Silva", area: "Atendente", date: "18/05", time: "10:00", platform: "Discord", interviewer: "ana.coord" },
  { id: "4", candidate: "Lucas Ferreira", area: "Moderador", date: "18/05", time: "14:00", platform: "Discord", interviewer: "rafa.rh" },
];

const STATUS_MAP: Record<Candidate["status"], { label: string; color: string; bg: string }> = {
  new: { label: "Novo", color: "text-brpay", bg: "bg-brpay/10 border-brpay/20" },
  reviewing: { label: "Em analise", color: "text-pagci", bg: "bg-pagci/10 border-pagci/20" },
  interview: { label: "Entrevista", color: "text-ease", bg: "bg-ease/10 border-ease/20" },
  approved: { label: "Aprovado", color: "text-accent", bg: "bg-accent/10 border-accent/20" },
  rejected: { label: "Recusado", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

function RecrutamentoInternoPage() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(getSession());
  const [tab, setTab] = useState<Tab>("pipeline");

  useEffect(() => {
    const s = getSession();
    if (!s) {
      setSession(MOCK_RECRUITER);
      setSessionState(MOCK_RECRUITER);
      return;
    }
    setSessionState(s);
  }, [navigate]);

  if (!session) return null;

  return (
    <DashboardLayout activeTab={tab} onTabChange={(t) => setTab(t as Tab)} session={{ ...session, role: "recrutador" }}>
      {tab === "pipeline" && <PipelineView />}
      {tab === "candidates" && <CandidatesView />}
      {tab === "interviews" && <InterviewsView />}
      {tab === "analytics" && <AnalyticsView />}
      {tab === "config" && <ConfigView />}
    </DashboardLayout>
  );
}

/* ===== PIPELINE ===== */

function PipelineView() {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const columns: { status: Candidate["status"]; label: string }[] = [
    { status: "new", label: "Novo" },
    { status: "reviewing", label: "Em analise" },
    { status: "interview", label: "Entrevista" },
    { status: "approved", label: "Aprovado" },
    { status: "rejected", label: "Recusado" },
  ];

  return (
    <div className="flex-1 overflow-hidden">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Pipeline de Recrutamento</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visualize e gerencie candidatos em cada etapa do processo.</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 border-b border-border bg-background/40 px-8 py-4">
        <div className="text-center">
          <p className="font-display text-2xl font-bold"><AnimatedCounter value={MOCK_CANDIDATES.length} /></p>
          <p className="text-[10px] text-muted-foreground">Total candidatos</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-accent"><AnimatedCounter value={2} /></p>
          <p className="text-[10px] text-muted-foreground">Aprovados</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-pagci">40%</p>
          <p className="text-[10px] text-muted-foreground">Taxa de aprovacao</p>
        </div>
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-ease">5d</p>
          <p className="text-[10px] text-muted-foreground">Tempo medio</p>
        </div>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto p-6">
        {columns.map((col) => {
          const candidates = MOCK_CANDIDATES.filter((c) => c.status === col.status);
          const info = STATUS_MAP[col.status];
          return (
            <div key={col.status} className="flex w-64 shrink-0 flex-col rounded-2xl border border-border bg-card/30">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className={`flex items-center gap-2 text-sm font-semibold ${info.color}`}>
                  <span className={`h-2 w-2 rounded-full ${info.color.replace("text-", "bg-")}`} />
                  {col.label}
                </span>
                <span className="rounded-full bg-border px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {candidates.length}
                </span>
              </div>
              <div className="flex-1 space-y-2 overflow-y-auto p-3">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCandidate(c)}
                    className="w-full rounded-xl border border-border bg-background p-3 text-left transition-all hover:border-accent/30 hover:shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-discord text-[10px] font-bold text-foreground">
                        {c.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold">{c.name}</p>
                        <p className="text-[10px] text-muted-foreground">{c.area}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>Prova: {c.score}/{c.total}</span>
                      <span>{c.date}</span>
                    </div>
                  </button>
                ))}
                {candidates.length === 0 && (
                  <p className="p-4 text-center text-xs text-muted-foreground">Nenhum candidato</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedCandidate && (
        <CandidateModal candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} />
      )}
    </div>
  );
}

function CandidateModal({ candidate, onClose }: { candidate: Candidate; onClose: () => void }) {
  const info = STATUS_MAP[candidate.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-discord text-lg font-bold text-foreground">
            {candidate.avatar}
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">{candidate.name}</h2>
            <p className="text-sm text-muted-foreground">{candidate.area}</p>
          </div>
          <span className={`ml-auto rounded-full border px-3 py-1 text-xs font-semibold ${info.bg} ${info.color}`}>
            {info.label}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-3.5 w-3.5" /> {candidate.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" /> {candidate.discord}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">Resultado da prova</p>
          <div className="mt-2 flex items-center gap-3">
            <p className="font-display text-3xl font-bold">{candidate.score}/{candidate.total}</p>
            <div className="flex-1">
              <div className="h-2 rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${(candidate.score / candidate.total) * 100}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-accent">{Math.round((candidate.score / candidate.total) * 100)}%</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-semibold text-muted-foreground">Historico</p>
          <div className="mt-3 space-y-2">
            {[
              { date: candidate.date, action: "Candidatura enviada", icon: ClipboardList },
              ...(candidate.status !== "new" ? [{ date: candidate.date, action: "Em analise pelo RH", icon: Search }] : []),
              ...(candidate.status === "interview" || candidate.status === "approved" ? [{ date: candidate.date, action: "Entrevista agendada", icon: Calendar }] : []),
              ...(candidate.status === "approved" ? [{ date: candidate.date, action: "Aprovado!", icon: CheckCircle2 }] : []),
              ...(candidate.status === "rejected" ? [{ date: candidate.date, action: "Candidatura recusada", icon: XCircle }] : []),
            ].map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-muted-foreground">{h.date}</span>
                <h.icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{h.action}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <button className="btn-pill btn-pill-accent flex-1 justify-center !text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" /> Aprovar
          </button>
          <button className="btn-pill btn-pill-outline flex-1 justify-center !text-xs">
            <Calendar className="h-3.5 w-3.5" /> Agendar Entrevista
          </button>
          <button className="rounded-xl border border-destructive/30 px-4 py-2 text-xs text-destructive hover:bg-destructive/10">
            <XCircle className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== CANDIDATES TABLE ===== */

function CandidatesView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = MOCK_CANDIDATES.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.discord.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Candidatos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Lista completa com filtros avancados.</p>
      </div>
      <div className="p-8">
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome ou discord..."
              className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none focus:border-accent"
            />
          </div>
          <div className="flex gap-1">
            {["all", "new", "reviewing", "interview", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`rounded-full border px-3 py-1 text-[11px] transition-colors ${
                  statusFilter === f ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground"
                }`}
              >
                {f === "all" ? "Todos" : STATUS_MAP[f as Candidate["status"]]?.label}
              </button>
            ))}
          </div>
        </div>

        <GlassCard className="overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border">
                <th className="px-6 py-3 text-left font-medium">Candidato</th>
                <th className="px-6 py-3 text-left font-medium">Area</th>
                <th className="px-6 py-3 text-left font-medium">Prova</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Data</th>
                <th className="px-6 py-3 text-right font-medium">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const info = STATUS_MAP[c.status];
                return (
                  <tr key={c.id} className="border-b border-border last:border-0 hover:bg-card/30">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-discord text-[10px] font-bold text-foreground">
                          {c.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground">{c.discord}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-xs">{c.area}</td>
                    <td className="px-6 py-3">
                      <span className="text-xs font-medium">{c.score}/{c.total}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${info.bg} ${info.color}`}>
                        {info.label}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-muted-foreground">{c.date}</td>
                    <td className="px-6 py-3 text-right">
                      <button className="rounded-lg border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  );
}

/* ===== INTERVIEWS ===== */

function InterviewsView() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-border bg-card/30 px-8 py-6">
        <h1 className="font-display text-2xl font-bold">Entrevistas</h1>
        <p className="mt-1 text-sm text-muted-foreground">Calendario de entrevistas agendadas.</p>
      </div>
      <div className="p-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Calendar mock */}
          <GlassCard className="p-6">
            <p className="font-semibold">Maio 2026</p>
            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                <span key={i} className="py-2 text-muted-foreground">{d}</span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                const hasInterview = d === 17 || d === 18;
                const isToday = d === 16;
                return (
                  <button
                    key={d}
                    className={`rounded-lg py-2 text-xs transition-colors ${
                      isToday ? "bg-accent text-accent-foreground font-bold" :
                      hasInterview ? "bg-ease/10 text-ease font-semibold" :
                      "hover:bg-card text-muted-foreground"
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Upcoming */}
          <div className="space-y-3">
            <p className="font-semibold">Proximas entrevistas</p>
            {INTERVIEWS.map((iv) => (
              <GlassCard key={iv.id} className="p-4 transition-all hover:glow-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{iv.candidate}</p>
                    <p className="text-[10px] text-muted-foreground">{iv.area} · Entrevistador: {iv.interviewer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{iv.time}</p>
                    <p className="text-[10px] text-muted-foreground">{iv.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Video className="h-3.5 w-3.5" /> {iv.platform}
                  </span>
                  <button className="btn-pill btn-pill-outline !py-1 !px-3 !text-[10px]">
                    Iniciar chamada
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Schedule new */}
        <GlassCard className="mt-6 p-6">
          <p className="font-semibold">Agendar nova entrevista</p>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Candidato</label>
              <select className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent">
                <option>Selecionar...</option>
                {MOCK_CANDIDATES.filter((c) => c.status !== "approved" && c.status !== "rejected").map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Data</label>
              <input type="date" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Horario</label>
              <input type="time" className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Plataforma</label>
              <select className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent">
                <option>Discord</option>
                <option>Google Meet</option>
              </select>
            </div>
          </div>
          <button className="btn-pill btn-pill-accent mt-4 !text-xs">
            <Calendar className="h-3.5 w-3.5" /> Agendar
          </button>
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
        <h1 className="font-display text-2xl font-bold">Analytics de Recrutamento</h1>
      </div>
      <div className="space-y-6 p-8">
        <div className="grid gap-4 md:grid-cols-4">
          <GlassCard className="p-5">
            <p className="text-xs text-muted-foreground">Total de candidaturas</p>
            <p className="mt-2 font-display text-3xl font-bold"><AnimatedCounter value={247} /></p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-muted-foreground">Taxa de aprovacao</p>
            <p className="mt-2 font-display text-3xl font-bold text-accent">32%</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-muted-foreground">Tempo medio do processo</p>
            <p className="mt-2 font-display text-3xl font-bold text-ease">4.2d</p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-xs text-muted-foreground">Nota media da prova</p>
            <p className="mt-2 font-display text-3xl font-bold text-pagci">78%</p>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <p className="font-semibold">Candidaturas por area</p>
          <div className="mt-4 space-y-3">
            {[
              { area: "Atendente", count: 156, pct: 63 },
              { area: "Moderador", count: 58, pct: 24 },
              { area: "Coordenador", count: 33, pct: 13 },
            ].map((a) => (
              <div key={a.area} className="flex items-center gap-4">
                <span className="w-24 text-sm">{a.area}</span>
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-border">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${a.pct}%` }} />
                  </div>
                </div>
                <span className="w-16 text-right text-xs font-semibold">{a.count} ({a.pct}%)</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <p className="font-semibold">Funil de conversao</p>
          <div className="mt-6 flex items-end justify-center gap-6">
            {[
              { label: "Candidaturas", value: 247, h: 100 },
              { label: "Em analise", value: 124, h: 50 },
              { label: "Entrevista", value: 62, h: 25 },
              { label: "Aprovados", value: 79, h: 32 },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-2">
                <span className="text-xs font-semibold"><AnimatedCounter value={s.value} /></span>
                <div
                  className="w-20 rounded-t-lg bg-gradient-to-t from-accent/40 to-accent"
                  style={{ height: `${s.h * 1.5}px` }}
                />
                <span className="text-[10px] text-muted-foreground">{s.label}</span>
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
          <p className="font-semibold">Template de email</p>
          <p className="mt-1 text-xs text-muted-foreground">Personalize o email enviado para candidatos aprovados.</p>
          <textarea
            rows={6}
            defaultValue={`Ola {nome},\n\nParabens! Voce foi aprovado(a) no processo seletivo da Shared Solve para a area de {area}.\n\nProximos passos:\n1. Entre no nosso servidor Discord\n2. Confirme sua presenca no canal #novos-membros\n3. Aguarde a atribuicao do cargo\n\nBem-vindo(a) ao time!\nEquipe Shared Solve`}
            className="mt-3 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none focus:border-accent"
          />
        </GlassCard>
        <GlassCard className="p-6">
          <p className="font-semibold">Criterios de aprovacao automatica</p>
          <p className="mt-1 text-xs text-muted-foreground">Candidatos que atinjam a nota minima podem ser aprovados automaticamente.</p>
          <div className="mt-4 flex items-center gap-3">
            <label className="text-xs text-muted-foreground">Nota minima:</label>
            <input type="number" defaultValue={80} min={0} max={100} className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-center text-xs outline-none focus:border-accent" />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
