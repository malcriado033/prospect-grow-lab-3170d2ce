// localStorage-backed store for jobs, applications and assessments
export type Job = {
  id: string;
  title: string;
  area: string;
  location: string;
  type: string;
  description: string;
  requirements: string;
  createdAt: string;
  active: boolean;
};

export type Application = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  testScore?: number;
  status: "new" | "reviewing" | "interview" | "approved" | "rejected";
  createdAt: string;
};

const JOBS_KEY = "ss_jobs";
const APPS_KEY = "ss_applications";

const seedJobs: Job[] = [
  {
    id: "j1",
    title: "Coordenador(a) de Equipes",
    area: "Operações",
    location: "Híbrido — São Paulo",
    type: "CLT",
    description:
      "Liderar equipes alocadas em clientes, garantindo entrega coordenada e eficiente.",
    requirements: "Experiência em liderança, comunicação clara, foco em resultados.",
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: "j2",
    title: "Analista de Recrutamento",
    area: "Pessoas",
    location: "Remoto",
    type: "PJ",
    description: "Recrutar, treinar e preparar talentos para projetos da Shared Solve.",
    requirements: "Vivência em R&S, técnicas de entrevista, organização.",
    createdAt: new Date().toISOString(),
    active: true,
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getJobs(): Job[] {
  const jobs = read<Job[] | null>(JOBS_KEY, null);
  if (!jobs) {
    write(JOBS_KEY, seedJobs);
    return seedJobs;
  }
  return jobs;
}

export function saveJob(job: Job) {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === job.id);
  if (idx >= 0) jobs[idx] = job;
  else jobs.unshift(job);
  write(JOBS_KEY, jobs);
}

export function deleteJob(id: string) {
  write(
    JOBS_KEY,
    getJobs().filter((j) => j.id !== id),
  );
}

export function getJob(id: string): Job | undefined {
  return getJobs().find((j) => j.id === id);
}

export function getApplications(): Application[] {
  return read<Application[]>(APPS_KEY, []);
}

export function saveApplication(app: Application) {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === app.id);
  if (idx >= 0) apps[idx] = app;
  else apps.unshift(app);
  write(APPS_KEY, apps);
}

export function genId() {
  return Math.random().toString(36).slice(2, 10);
}
