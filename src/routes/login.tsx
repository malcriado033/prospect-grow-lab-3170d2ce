import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { DiscordIcon } from "@/components/DiscordIcon";
import { ParticlesBackground } from "@/components/ParticlesBackground";
import { GlassCard } from "@/components/GlassCard";
import { setSession, MOCK_AGENT } from "@/lib/session";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar com Discord — Shared Solve" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : "/dashboard",
  }),
  component: Login,
});

function Login() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setVerified(true);
      setSession(MOCK_AGENT);
      setTimeout(() => navigate({ to: redirect }), 700);
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="relative mx-auto flex max-w-md flex-col items-center px-6 py-20">
        <ParticlesBackground className="opacity-30" />

        <GlassCard glow className="relative w-full p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-discord/15 text-discord">
            <DiscordIcon className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold">Entrar com Discord</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Verificamos sua funcao no servidor da Shared Solve para liberar o painel.
          </p>

          <button
            onClick={handleLogin}
            disabled={loading || verified}
            className="btn-pill btn-pill-discord mt-8 w-full justify-center"
          >
            {verified ? (
              <><CheckCircle2 className="h-4 w-4" /> Verificado</>
            ) : loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Verificando funcao...</>
            ) : (
              <><DiscordIcon className="h-4 w-4" /> Continuar com Discord</>
            )}
          </button>

          <div className="mt-6 flex items-start gap-2 rounded-xl border border-border bg-background/40 p-3 text-left text-xs text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>
              Demo visual. Em producao, o bot Shared Solve valida cargos no Discord antes de liberar o painel.
            </span>
          </div>
        </GlassCard>

        <p className="mt-6 text-xs text-muted-foreground">
          {"Ainda nao e atendente? "}
          <Link to="/recrutamento" className="underline hover:text-foreground">
            Faca o processo seletivo
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
