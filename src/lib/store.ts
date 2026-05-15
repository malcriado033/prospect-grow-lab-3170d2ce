// localStorage-backed store
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
  area: string;
  jobId?: string;
  name: string;
  email: string;
  discord: string;
  age: string;
  written: Record<string, string>;
  quizScore?: number;
  quizTotal?: number;
  simulationLog?: { from: "user" | "agent"; text: string; at: string }[];
  status: "new" | "reviewing" | "interview" | "approved" | "rejected";
  createdAt: string;
};

const JOBS_KEY = "ss_jobs_v2";
const APPS_KEY = "ss_applications_v2";

const seedJobs: Job[] = [
  {
    id: "atendente",
    title: "Atendente",
    area: "Atendimento",
    location: "Remoto · Discord",
    type: "Voluntário",
    description:
      "Atender membros via tickets no Discord, com cordialidade e agilidade, garantindo a melhor experiência possível.",
    requirements: "Boa escrita, paciência, disponibilidade mínima de 2h/dia.",
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: "moderador",
    title: "Moderador",
    area: "Moderação",
    location: "Remoto · Discord",
    type: "Voluntário",
    description: "Garantir o cumprimento das regras e manter o servidor saudável.",
    requirements: "Maturidade, imparcialidade, boa comunicação.",
    createdAt: new Date().toISOString(),
    active: true,
  },
  {
    id: "coordenador",
    title: "Coordenador de Equipe",
    area: "Coordenação",
    location: "Remoto · Discord",
    type: "Contrato",
    description: "Liderar squads de atendimento e moderação alocadas em clientes.",
    requirements: "Liderança, organização, experiência prévia em equipes.",
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
  const i = jobs.findIndex((j) => j.id === job.id);
  if (i >= 0) jobs[i] = job;
  else jobs.unshift(job);
  write(JOBS_KEY, jobs);
}
export function deleteJob(id: string) {
  write(JOBS_KEY, getJobs().filter((j) => j.id !== id));
}
export function getJob(id: string) {
  return getJobs().find((j) => j.id === id);
}

export function getApplications(): Application[] {
  return read<Application[]>(APPS_KEY, []);
}
export function saveApplication(app: Application) {
  const apps = getApplications();
  const i = apps.findIndex((a) => a.id === app.id);
  if (i >= 0) apps[i] = app;
  else apps.unshift(app);
  write(APPS_KEY, apps);
}
export function genId() {
  return Math.random().toString(36).slice(2, 10);
}

// Draft for in-progress recruitment
const DRAFT_KEY = "ss_app_draft";
export function getDraft(): Partial<Application> | null {
  return read<Partial<Application> | null>(DRAFT_KEY, null);
}
export function setDraft(d: Partial<Application> | null) {
  if (!d) localStorage.removeItem(DRAFT_KEY);
  else write(DRAFT_KEY, d);
}
