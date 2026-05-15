import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getJob, type Job } from "@/lib/store";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/vagas/$jobId")({
  component: VagaDetail,
});

function VagaDetail() {
  const { jobId } = Route.useParams();
  const [job, setJob] = useState<Job | undefined>();

  useEffect(() => {
    setJob(getJob(jobId));
  }, [jobId]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold">Vaga não encontrada</h1>
          <Link to="/vagas" className="mt-4 inline-block text-accent underline">
            Voltar para vagas
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <Link to="/vagas" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Todas as vagas
        </Link>

        <h1 className="mt-6 text-4xl font-bold">{job.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {job.area} · {job.type} · {job.location}
        </p>

        <div className="mt-8 space-y-6 rounded-xl border border-border bg-card p-8">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Sobre a vaga
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm">{job.description}</p>
          </section>
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Requisitos
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm">{job.requirements}</p>
          </section>
        </div>

        <div className="mt-8 flex justify-end">
          <Link to="/recrutamento" className="btn-pill btn-pill-primary">
            Iniciar processo seletivo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
