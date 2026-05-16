// Mock Discord session (visual demo only)
export type Session = {
  id: string;
  username: string;
  tag: string;
  avatar: string;
  role: "atendente" | "supervisor" | "recrutador" | "candidato";
};

const KEY = "ss_session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(s: Session | null) {
  if (typeof window === "undefined") return;
  if (!s) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("ss-session"));
}

export const MOCK_AGENT: Session = {
  id: "184729301847291",
  username: "lucas.sv",
  tag: "#0001",
  avatar: "L",
  role: "atendente",
};

export const MOCK_SUPERVISOR: Session = {
  id: "284729301847292",
  username: "ana.coord",
  tag: "#0002",
  avatar: "A",
  role: "supervisor",
};

export const MOCK_RECRUITER: Session = {
  id: "384729301847293",
  username: "rafa.rh",
  tag: "#0003",
  avatar: "R",
  role: "recrutador",
};
