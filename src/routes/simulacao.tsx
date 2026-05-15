import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { DiscordIcon } from "@/components/DiscordIcon";
import { getApplications, saveApplication } from "@/lib/store";
import { Hash, Send, Ticket, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

type Msg = { from: "user" | "agent"; text: string; at: string };

// Scripted customer behaviour. Each "turn" represents a customer follow-up
// that fires after the candidate replies.
const customerScript = {
  opening:
    "Oi, boa tarde 😞 acabei de comprar o produto Premium aqui no servidor mas não recebi nada ainda. Já faz 20 minutos. O que faço?",
  followups: [
    "ah ok... o pagamento foi por Pix. já caiu na minha conta como pago",
    "meu usuário no servidor é joaopx#1234. tentei reiniciar o discord, não mudou nada",
    "olha sinceramente eu to ficando irritado, paguei R$ 50 e não tenho nada. vocês vão me devolver?",
    "aaah entendi. e quanto tempo isso costuma demorar? to com pressa pq queria usar agora",
    "beleza, valeu pela paciência. obrigado pelo atendimento!",
  ],
};

const customer = {
  name: "joaopx",
  tag: "#1234",
  avatar: "JP",
};

export const Route = createFileRoute("/simulacao")({
  head: () => ({ meta: [{ title: "Simulação — Atendente · Shared Solve" }] }),
  validateSearch: (s: Record<string, unknown>) => ({
    appId: typeof s.appId === "string" ? s.appId : undefined,
  }),
  component: Simulacao,
});

function Simulacao() {
  const { appId } = Route.useSearch();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [turn, setTurn] = useState(0); // index into followups
  const [typing, setTyping] = useState(false);
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initial customer message
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => {
      setMessages([{ from: "user", text: customerScript.opening, at: nowTime() }]);
      setTyping(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  // Autoscroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send() {
    const text = input.trim();
    if (!text || done) return;
    const newMsgs: Msg[] = [...messages, { from: "agent", text, at: nowTime() }];
    setMessages(newMsgs);
    setInput("");

    // Schedule customer reply
    if (turn < customerScript.followups.length) {
      setTyping(true);
      const reply = customerScript.followups[turn];
      const delay = 1100 + Math.min(reply.length * 25, 2500);
      setTimeout(() => {
        setMessages((m) => [...m, { from: "user", text: reply, at: nowTime() }]);
        setTyping(false);
        setTurn((t) => t + 1);
      }, delay);
    } else {
      // simulation complete
      setTimeout(() => {
        setDone(true);
        if (appId) {
          const app = getApplications().find((a) => a.id === appId);
          if (app) saveApplication({ ...app, simulationLog: newMsgs });
        }
      }, 600);
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <ServerSidebar />
        <ChannelSidebar />
        <main className="flex flex-1 flex-col bg-[oklch(0.13_0_0)]">
          <ChannelHeader />
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
            <TicketIntro />
            <div className="mt-4 space-y-4">
              {messages.map((m, i) => (
                <Message key={i} msg={m} prev={messages[i - 1]} />
              ))}
              {typing && <TypingIndicator />}
              {done && <SimulationComplete />}
            </div>
          </div>
          <Composer
            value={input}
            setValue={setInput}
            onSend={send}
            disabled={done || typing}
          />
        </main>
        <MembersSidebar />
      </div>
    </div>
  );
}

function nowTime() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function TopBar() {
  return (
    <div className="flex h-10 items-center justify-between border-b border-border bg-[oklch(0.08_0_0)] px-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-2">
        <DiscordIcon className="h-4 w-4 text-foreground" />
        <span className="font-medium text-foreground">Simulação · Atendimento Premium</span>
      </div>
      <Link to="/recrutamento" className="hover:text-foreground">Sair</Link>
    </div>
  );
}

function ServerSidebar() {
  return (
    <aside className="hidden w-[72px] flex-col items-center gap-3 border-r border-border bg-[oklch(0.05_0_0)] py-4 sm:flex">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-base font-bold text-background hover:rounded-xl transition-all">
        S
      </div>
      <div className="h-px w-8 bg-border" />
      <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-card text-xs text-muted-foreground hover:rounded-xl transition-all">
        ATD
      </div>
    </aside>
  );
}

function ChannelSidebar() {
  return (
    <aside className="hidden w-60 flex-col border-r border-border bg-[oklch(0.09_0_0)] md:flex">
      <div className="border-b border-border p-4">
        <p className="text-sm font-semibold">Shared Solve · Cliente</p>
        <p className="text-[11px] text-muted-foreground">Servidor de simulação</p>
      </div>
      <div className="px-3 py-3 text-xs">
        <p className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground">Tickets</p>
        <div className="mt-1 space-y-0.5">
          <ChannelItem name="ticket-0042" active />
          <ChannelItem name="ticket-0041" />
          <ChannelItem name="ticket-0040" />
        </div>
        <p className="mt-4 px-2 text-[11px] uppercase tracking-wider text-muted-foreground">Geral</p>
        <div className="mt-1 space-y-0.5">
          <ChannelItem name="boas-vindas" />
          <ChannelItem name="anúncios" />
        </div>
      </div>
    </aside>
  );
}

function ChannelItem({ name, active = false }: { name: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 rounded px-2 py-1.5 text-sm ${
        active ? "bg-[oklch(0.15_0_0)] text-foreground" : "text-muted-foreground hover:bg-[oklch(0.13_0_0)]"
      }`}
    >
      <Hash className="h-3.5 w-3.5" />
      <span>{name}</span>
    </div>
  );
}

function ChannelHeader() {
  return (
    <div className="flex h-12 items-center gap-3 border-b border-border px-5 text-sm">
      <Ticket className="h-4 w-4 text-accent" />
      <span className="font-semibold">ticket-0042</span>
      <span className="text-muted-foreground">— suporte premium · {customer.name}</span>
    </div>
  );
}

function TicketIntro() {
  return (
    <div className="rounded-lg border border-border bg-[oklch(0.10_0_0)] p-4 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">Ticket aberto por {customer.name}{customer.tag}</p>
      <p className="mt-1">Categoria: Compras · Plano: Premium · Aberto agora</p>
      <p className="mt-2">
        Você é o atendente responsável. Responda como faria em uma situação real.
      </p>
    </div>
  );
}

function Message({ msg, prev }: { msg: Msg; prev?: Msg }) {
  const grouped = prev && prev.from === msg.from;
  const isUser = msg.from === "user";
  const name = isUser ? customer.name : "você";
  const avatar = isUser ? customer.avatar : "AT";
  const nameColor = isUser ? "text-[oklch(0.78_0.15_270)]" : "text-accent";

  if (grouped) {
    return (
      <div className="flex gap-4 pl-[52px] pr-4">
        <p className="text-sm leading-relaxed">{msg.text}</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4 px-4 hover:bg-[oklch(0.11_0_0)] rounded">
      <div
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isUser ? "bg-[oklch(0.30_0.10_270)] text-white" : "bg-accent text-accent-foreground"
        }`}
      >
        {avatar}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className={`text-sm font-semibold ${nameColor}`}>{name}</span>
          <span className="text-[11px] text-muted-foreground">hoje às {msg.at}</span>
        </div>
        <p className="mt-0.5 whitespace-pre-line text-sm leading-relaxed">{msg.text}</p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 text-xs text-muted-foreground">
      <div className="flex gap-1">
        <Dot delay={0} />
        <Dot delay={150} />
        <Dot delay={300} />
      </div>
      <span>{customer.name} está digitando…</span>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted-foreground"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}

function SimulationComplete() {
  return (
    <div className="mt-6 rounded-xl border border-accent/40 bg-accent/5 p-6 text-center">
      <CheckCircle2 className="mx-auto h-8 w-8 text-accent" />
      <p className="mt-2 font-semibold">Simulação concluída</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Sua conversa foi salva e será avaliada pelo time de recrutamento.
      </p>
      <Link to="/" className="btn-pill btn-pill-primary mt-4 inline-flex">
        Voltar ao início
      </Link>
    </div>
  );
}

function Composer({
  value,
  setValue,
  onSend,
  disabled,
}: {
  value: string;
  setValue: (v: string) => void;
  onSend: () => void;
  disabled: boolean;
}) {
  return (
    <div className="border-t border-border p-4">
      <div className="flex items-end gap-2 rounded-xl border border-border bg-[oklch(0.10_0_0)] px-3 py-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={disabled ? "Aguardando…" : `Mensagem em #ticket-0042`}
          rows={1}
          disabled={disabled}
          className="max-h-32 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={disabled || !value.trim()}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity disabled:opacity-30"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Enter para enviar · Shift + Enter para quebrar linha
      </p>
    </div>
  );
}

function MembersSidebar() {
  return (
    <aside className="hidden w-56 flex-col border-l border-border bg-[oklch(0.09_0_0)] p-3 lg:flex">
      <p className="px-2 text-[11px] uppercase tracking-wider text-muted-foreground">No ticket — 2</p>
      <div className="mt-2 space-y-1">
        <MemberRow name={customer.name} role="Cliente" color="bg-[oklch(0.30_0.10_270)]" initials={customer.avatar} status="online" />
        <MemberRow name="você" role="Atendente" color="bg-accent text-accent-foreground" initials="AT" status="online" />
      </div>
    </aside>
  );
}

function MemberRow({
  name,
  role,
  color,
  initials,
  status,
}: {
  name: string;
  role: string;
  color: string;
  initials: string;
  status: "online" | "idle";
}) {
  return (
    <div className="flex items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-[oklch(0.13_0_0)]">
      <div className={`relative flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${color}`}>
        {initials}
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[oklch(0.09_0_0)] ${
            status === "online" ? "bg-accent" : "bg-yellow-500"
          }`}
        />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm">{name}</p>
        <p className="text-[10px] text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
