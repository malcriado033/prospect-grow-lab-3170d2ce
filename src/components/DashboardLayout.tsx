import { Link, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Wallet,
  ShoppingBag,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Eye,
  UserCheck,
  ClipboardList,
  Calendar,
  BarChart3,
  Users,
  Menu,
  X,
} from "lucide-react";
import { getSession, setSession, type Session } from "@/lib/session";
import { StatusIndicator } from "./StatusIndicator";

type NavItem = {
  id: string;
  label: string;
  icon: typeof Inbox;
  badge?: string;
  href?: string;
};

const ATENDENTE_NAV: NavItem[] = [
  { id: "tickets", label: "Tickets", icon: Inbox, badge: "8" },
  { id: "dashboard", label: "Meu painel", icon: LayoutDashboard },
  { id: "saldo", label: "Saldo & saques", icon: Wallet },
  { id: "loja", label: "Loja", icon: ShoppingBag },
  { id: "config", label: "Configuracoes", icon: Settings },
];

const SUPERVISOR_NAV: NavItem[] = [
  { id: "overview", label: "Visao geral", icon: BarChart3 },
  { id: "agents", label: "Atendentes", icon: Users },
  { id: "tickets", label: "Tickets", icon: Inbox, badge: "24" },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "config", label: "Configuracoes", icon: Settings },
];

const RECRUITER_NAV: NavItem[] = [
  { id: "pipeline", label: "Pipeline", icon: ClipboardList, badge: "12" },
  { id: "candidates", label: "Candidatos", icon: UserCheck },
  { id: "interviews", label: "Entrevistas", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "config", label: "Configuracoes", icon: Settings },
];

function getNavForRole(role: Session["role"]): NavItem[] {
  switch (role) {
    case "supervisor": return SUPERVISOR_NAV;
    case "recrutador": return RECRUITER_NAV;
    default: return ATENDENTE_NAV;
  }
}

function getRoleLabel(role: Session["role"]): string {
  switch (role) {
    case "supervisor": return "Supervisor";
    case "recrutador": return "Recrutador";
    case "atendente": return "Atendente";
    default: return "Candidato";
  }
}

function getCentralLabel(role: Session["role"]): string {
  switch (role) {
    case "supervisor": return "Central do Supervisor";
    case "recrutador": return "Central de Recrutamento";
    default: return "Central do Atendente";
  }
}

export function DashboardLayout({
  children,
  activeTab,
  onTabChange,
  session,
}: {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  session: Session;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const navItems = getNavForRole(session.role);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-sidebar-border px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-display text-sm font-bold text-accent-foreground">
              S
            </div>
            <span className="font-display text-sm font-semibold">Shared Solve</span>
          </Link>
          <button
            className="rounded-md p-1 text-muted-foreground md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          <p className="px-3 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {getCentralLabel(session.role)}
          </p>
          {navItems.map((it) => {
            const active = activeTab === it.id;
            return (
              <button
                key={it.id}
                onClick={() => {
                  onTabChange(it.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                  active
                    ? "bg-accent/10 text-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <it.icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} />
                  {it.label}
                </span>
                {it.badge && (
                  <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                    {it.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex w-full items-center gap-2.5 rounded-xl p-2 transition-colors hover:bg-sidebar-accent"
            >
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {session.avatar}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5">
                  <StatusIndicator status="online" size="sm" />
                </span>
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-sm font-medium">{session.username}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {getRoleLabel(session.role)} · Online
                </p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-xl border border-border bg-popover p-1 shadow-lg">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Trocar central
                </p>
                {[
                  { label: "Central do Atendente", href: "/dashboard", icon: Inbox },
                  { label: "Central do Supervisor", href: "/supervisor", icon: Eye },
                  { label: "Central de Recrutamento", href: "/recrutamento-interno", icon: UserCheck },
                ].map((item) => (
                  <button
                    key={item.href}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate({ to: item.href });
                    }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/10 hover:text-foreground"
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </button>
                ))}
                <div className="my-1 border-t border-border" />
                <button
                  onClick={() => {
                    setSession(null);
                    navigate({ to: "/" });
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center justify-between border-b border-border bg-card/30 px-6 py-3">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-border p-2 text-muted-foreground md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar..."
                className="w-64 rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs outline-none transition-colors focus:border-accent"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                3
              </span>
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}
