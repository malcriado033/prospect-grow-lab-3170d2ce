import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getJobs,
  saveJob,
  deleteJob,
  getApplications,
  saveApplication,
  genId,
  type Job,
  type Application,
} from "@/lib/store";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Shared Solve" }] }),
  component: AdminPage,
});

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("ss_admin") === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-sm px-6 py-24">
          <Card className="p-8">
            <h1 className="text-xl font-semibold">Acesso administrativo</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Senha de demonstração: <code className="font-mono">sharedsolve</code>
            </p>
            <form
              className="mt-6 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (pwd === "sharedsolve") {
                  sessionStorage.setItem("ss_admin", "1");
                  setAuthed(true);
                } else toast.error("Senha incorreta");
              }}
            >
              <div>
                <Label htmlFor="pwd">Senha</Label>
                <Input id="pwd" type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold">Painel administrativo</h1>
        <Tabs defaultValue="jobs" className="mt-8">
          <TabsList>
            <TabsTrigger value="jobs">Vagas</TabsTrigger>
            <TabsTrigger value="apps">Candidaturas</TabsTrigger>
          </TabsList>
          <TabsContent value="jobs" className="mt-6">
            <JobsPanel />
          </TabsContent>
          <TabsContent value="apps" className="mt-6">
            <ApplicationsPanel />
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

const empty: Job = {
  id: "",
  title: "",
  area: "",
  location: "",
  type: "CLT",
  description: "",
  requirements: "",
  createdAt: "",
  active: true,
};

function JobsPanel() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Job>(empty);
  const refresh = () => setJobs(getJobs());
  useEffect(refresh, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) return toast.error("Título é obrigatório");
    saveJob({
      ...form,
      id: form.id || genId(),
      createdAt: form.createdAt || new Date().toISOString(),
    });
    setForm(empty);
    refresh();
    toast.success("Vaga salva");
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1.2fr]">
      <Card className="p-6">
        <h2 className="font-semibold">{form.id ? "Editar vaga" : "Nova vaga"}</h2>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <div>
            <Label>Título</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Área</Label>
              <Input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
            </div>
            <div>
              <Label>Tipo</Label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} />
            </div>
          </div>
          <div>
            <Label>Localização</Label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <Label>Descrição</Label>
            <Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div>
            <Label>Requisitos</Label>
            <Textarea rows={3} value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit">
              <Plus className="mr-1 h-4 w-4" /> Salvar
            </Button>
            {form.id && (
              <Button type="button" variant="outline" onClick={() => setForm(empty)}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </Card>

      <div className="space-y-3">
        {jobs.map((j) => (
          <Card key={j.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{j.title}</p>
              <p className="text-xs text-muted-foreground">
                {j.area} · {j.location}
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setForm(j)}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  deleteJob(j.id);
                  refresh();
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

const statusLabels: Record<Application["status"], string> = {
  new: "Novo",
  reviewing: "Em análise",
  interview: "Entrevista",
  approved: "Aprovado",
  rejected: "Recusado",
};

function ApplicationsPanel() {
  const [apps, setApps] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const refresh = () => {
    setApps(getApplications());
    setJobs(getJobs());
  };
  useEffect(refresh, []);

  if (apps.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
        Nenhuma candidatura ainda.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {apps.map((a) => {
        const job = jobs.find((j) => j.id === a.jobId);
        return (
          <Card key={a.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.email} {a.discord && `· ${a.discord}`}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Área: {a.area}{job ? ` · ${job.title}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{statusLabels[a.status]}</Badge>
                <Select
                  value={a.status}
                  onValueChange={(v) => {
                    saveApplication({ ...a, status: v as Application["status"] });
                    refresh();
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>
                        {v}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {typeof a.quizScore === "number" && (
              <p className="mt-3 text-xs text-muted-foreground">
                Prova: <span className="text-foreground">{a.quizScore}/{a.quizTotal}</span>
              </p>
            )}
            {a.written && Object.keys(a.written).length > 0 && (
              <div className="mt-3 space-y-2 rounded bg-muted/40 p-3 text-xs">
                {Object.entries(a.written).map(([k, v]) => (
                  <div key={k}>
                    <p className="font-medium text-muted-foreground">{k}</p>
                    <p className="whitespace-pre-line">{v}</p>
                  </div>
                ))}
              </div>
            )}
            {a.simulationLog && a.simulationLog.length > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Simulação: {a.simulationLog.length} mensagens trocadas
              </p>
            )}
          </Card>
        );
      })}
    </div>
  );
}
