import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { AREAS, getArea } from "@/lib/areas";
import { setDraft, getDraft, saveApplication, genId } from "@/lib/store";
import { ArrowRight, CheckCircle2, FileText, MessagesSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Step = "intro" | "form" | "quiz" | "done";

export const Route = createFileRoute("/recrutamento")({
  head: () => ({ meta: [{ title: "Processo seletivo — Shared Solve" }] }),
  component: Recrutamento,
});

function Recrutamento() {
  const [step, setStep] = useState<Step>("intro");
  const [areaId, setAreaId] = useState<string>("");
  const [profile, setProfile] = useState({ name: "", email: "", discord: "", age: "" });
  const [written, setWritten] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<number[]>([]);
  const [appId, setAppId] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const d = getDraft();
    if (d?.area) setAreaId(d.area);
  }, []);

  const area = getArea(areaId);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Stepper step={step} />

        {step === "intro" && (
          <IntroStep
            areaId={areaId}
            setAreaId={setAreaId}
            onNext={() => {
              if (!areaId) return toast.error("Selecione uma área");
              setDraft({ area: areaId });
              setAnswers(Array(getArea(areaId)!.quiz.length).fill(-1));
              setStep("form");
            }}
          />
        )}

        {step === "form" && area && (
          <FormStep
            area={area}
            profile={profile}
            setProfile={setProfile}
            written={written}
            setWritten={setWritten}
            onBack={() => setStep("intro")}
            onNext={() => {
              if (!profile.name || !profile.email || !profile.discord)
                return toast.error("Preencha nome, email e Discord");
              for (const q of area.written) {
                if (!written[q.id] || written[q.id].trim().length < 10)
                  return toast.error("Responda todas as perguntas com pelo menos 10 caracteres");
              }
              setStep("quiz");
            }}
          />
        )}

        {step === "quiz" && area && (
          <QuizStep
            area={area}
            answers={answers}
            setAnswers={setAnswers}
            onBack={() => setStep("form")}
            onNext={() => {
              if (answers.some((a) => a < 0)) return toast.error("Responda todas as questões");
              const score = answers.reduce(
                (acc, a, i) => acc + (a === area.quiz[i].answer ? 1 : 0),
                0,
              );
              const id = genId();
              saveApplication({
                id,
                area: area.id,
                jobId: area.id,
                name: profile.name,
                email: profile.email,
                discord: profile.discord,
                age: profile.age,
                written,
                quizScore: score,
                quizTotal: area.quiz.length,
                status: "new",
                createdAt: new Date().toISOString(),
              });
              setAppId(id);
              setDraft(null);
              setStep("done");
            }}
          />
        )}

        {step === "done" && area && (
          <DoneStep
            area={area}
            onSimulation={() =>
              navigate({ to: "/simulacao", search: { appId } as never })
            }
          />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { id: "intro", label: "Área" },
    { id: "form", label: "Sobre você" },
    { id: "quiz", label: "Conhecimento" },
    { id: "done", label: "Conclusão" },
  ];
  const idx = items.findIndex((i) => i.id === step);
  return (
    <div className="mb-10 flex items-center gap-2 text-xs text-muted-foreground">
      {items.map((it, i) => (
        <div key={it.id} className="flex items-center gap-2">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
              i <= idx ? "border-accent bg-accent/10 text-foreground" : "border-border"
            }`}
          >
            {i + 1}
          </span>
          <span className={i === idx ? "text-foreground" : ""}>{it.label}</span>
          {i < items.length - 1 && <span className="mx-1 h-px w-6 bg-border" />}
        </div>
      ))}
    </div>
  );
}

function IntroStep({
  areaId,
  setAreaId,
  onNext,
}: {
  areaId: string;
  setAreaId: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h1 className="text-4xl font-bold md:text-5xl">Processo seletivo</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Três etapas rápidas: sobre você, prova de conhecimento e — para algumas áreas — simulação prática.
        Leva cerca de 10 minutos.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: FileText, t: "Formulário", d: "Conte sua experiência" },
          { icon: Sparkles, t: "Prova", d: "Múltipla escolha objetiva" },
          { icon: MessagesSquare, t: "Simulação", d: "Atendimento real no Discord" },
        ].map((s) => (
          <div key={s.t} className="rounded-xl border border-border bg-card p-4">
            <s.icon className="h-4 w-4 text-accent" />
            <p className="mt-3 text-sm font-medium">{s.t}</p>
            <p className="text-xs text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Selecione a área
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {AREAS.map((a) => {
          const selected = areaId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => setAreaId(a.id)}
              className={`rounded-xl border p-5 text-left transition-all ${
                selected
                  ? "border-accent bg-accent/5 shadow-[var(--shadow-glow)]"
                  : "border-border bg-card hover:border-accent/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{a.title}</p>
                {selected && <CheckCircle2 className="h-4 w-4 text-accent" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{a.blurb}</p>
            </button>
          );
        })}
      </div>

      {areaId && (
        <div className="mt-10 flex justify-end">
          <button onClick={onNext} className="btn-pill btn-pill-primary">
            Iniciar processo seletivo <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <p className="mt-8 text-xs text-muted-foreground">
        Não está pronto?{" "}
        <Link to="/vagas" className="underline hover:text-foreground">
          Ver vagas abertas
        </Link>
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  textarea,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const cls =
    "mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent";
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea
          className={cls}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      ) : (
        <input
          className={cls}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
    </label>
  );
}

function FormStep({
  area,
  profile,
  setProfile,
  written,
  setWritten,
  onBack,
  onNext,
}: {
  area: ReturnType<typeof getArea> & object;
  profile: { name: string; email: string; discord: string; age: string };
  setProfile: (p: typeof profile) => void;
  written: Record<string, string>;
  setWritten: (w: Record<string, string>) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">Sobre você — {area!.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Responda com calma. Queremos te conhecer de verdade.
      </p>

      <div className="mt-8 grid gap-4 rounded-xl border border-border bg-card p-6 sm:grid-cols-2">
        <Field label="Nome completo" value={profile.name} onChange={(v) => setProfile({ ...profile, name: v })} />
        <Field label="Email" type="email" value={profile.email} onChange={(v) => setProfile({ ...profile, email: v })} />
        <Field label="Usuário Discord" value={profile.discord} onChange={(v) => setProfile({ ...profile, discord: v })} placeholder="ex: usuario#0000" />
        <Field label="Idade" value={profile.age} onChange={(v) => setProfile({ ...profile, age: v })} />
      </div>

      <div className="mt-6 space-y-4 rounded-xl border border-border bg-card p-6">
        {area!.written.map((q) => (
          <Field
            key={q.id}
            label={q.label}
            value={written[q.id] || ""}
            onChange={(v) => setWritten({ ...written, [q.id]: v })}
            placeholder={q.placeholder}
            textarea
            rows={4}
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="btn-pill btn-pill-outline">
          Voltar
        </button>
        <button onClick={onNext} className="btn-pill btn-pill-primary">
          Continuar para prova <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function QuizStep({
  area,
  answers,
  setAnswers,
  onBack,
  onNext,
}: {
  area: ReturnType<typeof getArea> & object;
  answers: number[];
  setAnswers: (a: number[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const letters = ["A", "B", "C", "D"];
  return (
    <div>
      <h1 className="text-3xl font-bold">Prova de conhecimento — {area!.title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Escolha apenas uma alternativa por questão.
      </p>

      <div className="mt-8 space-y-4">
        {area!.quiz.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6">
            <p className="font-medium">
              {i + 1}. {q.q}
            </p>
            <div className="mt-4 space-y-2">
              {q.options.map((opt, j) => {
                const sel = answers[i] === j;
                return (
                  <button
                    key={j}
                    type="button"
                    onClick={() => {
                      const next = [...answers];
                      next[i] = j;
                      setAnswers(next);
                    }}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                      sel
                        ? "border-accent bg-accent/5"
                        : "border-border bg-background/30 hover:border-accent/40"
                    }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-semibold ${
                        sel ? "border-accent bg-accent text-accent-foreground" : "border-border text-muted-foreground"
                      }`}
                    >
                      {letters[j]}
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-between">
        <button onClick={onBack} className="btn-pill btn-pill-outline">
          Voltar
        </button>
        <button onClick={onNext} className="btn-pill btn-pill-primary">
          Finalizar etapa <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function DoneStep({
  area,
  onSimulation,
}: {
  area: ReturnType<typeof getArea> & object;
  onSimulation: () => void;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-10 text-center">
      <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />
      <h1 className="mt-4 text-3xl font-bold">Candidatura registrada</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Recebemos sua aplicação para <strong className="text-foreground">{area!.title}</strong>.
      </p>

      {area!.hasSimulation ? (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            Próxima etapa: simulação prática de atendimento no Discord.
          </p>
          <button onClick={onSimulation} className="btn-pill btn-pill-primary mt-6">
            Iniciar simulação <ArrowRight className="h-4 w-4" />
          </button>
        </>
      ) : (
        <Link to="/" className="btn-pill btn-pill-outline mt-6">
          Voltar ao início
        </Link>
      )}
    </div>
  );
}
