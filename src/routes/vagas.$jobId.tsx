import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getJob, saveApplication, genId, type Job } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/vagas/$jobId")({
  component: VagaDetail,
});

function VagaDetail() {
  const { jobId } = Route.useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | undefined>();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setJob(getJob(jobId));
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold">Vaga não encontrada</h1>
          <Link to="/vagas" className="mt-4 inline-block text-primary underline">
            Voltar para vagas
          </Link>
        </main>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Preencha nome e email");
      return;
    }
    setSubmitting(true);
    saveApplication({
      id: genId(),
      jobId: job!.id,
      ...form,
      status: "new",
      createdAt: new Date().toISOString(),
    });
    toast.success("Candidatura enviada! Em breve entraremos em contato.");
    setTimeout(() => navigate({ to: "/testes", search: { jobId: job!.id } as never }), 800);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link
          to="/vagas"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Todas as vagas
        </Link>

        <h1 className="mt-6 text-4xl font-bold">{job.title}</h1>
        <p className="mt-2 text-muted-foreground">
          {job.area} · {job.type} · {job.location}
        </p>

        <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-8">
          <section>
            <h2 className="text-lg font-semibold">Sobre a vaga</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
              {job.description}
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold">Requisitos</h2>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
              {job.requirements}
            </p>
          </section>
        </div>

        <form onSubmit={submit} className="mt-10 space-y-5 rounded-xl border border-border bg-card p-8">
          <h2 className="text-xl font-semibold">Candidate-se</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Nome completo</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="experience">Anos de experiência</Label>
              <Input id="experience" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Por que você é a pessoa certa?</Label>
            <Textarea
              id="message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button type="submit" size="lg" disabled={submitting}>
            Enviar candidatura
          </Button>
          <p className="text-xs text-muted-foreground">
            Após enviar, você poderá fazer um teste prático para acelerar sua avaliação.
          </p>
        </form>
      </main>
      <SiteFooter />
    </div>
  );
}
