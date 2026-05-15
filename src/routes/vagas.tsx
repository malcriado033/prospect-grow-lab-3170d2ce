import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { getJobs, type Job } from "@/lib/store";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/vagas")({
  head: () => ({
    meta: [
      { title: "Vagas abertas — Shared Solve" },
      { name: "description", content: "Confira as vagas abertas na Shared Solve." },
    ],
  }),
  component: VagasPage,
});

function VagasPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  useEffect(() => {
    setJobs(getJobs().filter((j) => j.active));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-4xl font-bold">Vagas abertas</h1>
        <p className="mt-3 text-muted-foreground">
          Encontre uma oportunidade na Shared Solve e candidate-se em poucos passos.
        </p>

        <div className="mt-10 grid gap-4">
          {jobs.length === 0 && (
            <p className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
              Nenhuma vaga aberta no momento.
            </p>
          )}
          {jobs.map((job) => (
            <Link
              key={job.id}
              to="/vagas/$jobId"
              params={{ jobId: job.id }}
              className="group flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-[var(--shadow-elegant)]"
            >
              <div>
                <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
                  {job.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" /> {job.area} · {job.type}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
