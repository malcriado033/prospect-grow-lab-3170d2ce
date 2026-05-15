import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

type Question = {
  q: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    q: "Sua equipe está atrasada em uma entrega crítica para o cliente. Qual é a primeira ação?",
    options: [
      "Trabalhar mais horas sem comunicar",
      "Avaliar o gargalo, comunicar o cliente e replanejar",
      "Esperar a próxima reunião semanal",
      "Cobrar individualmente cada membro",
    ],
    answer: 1,
  },
  {
    q: "Um membro da equipe não está performando. O que fazer primeiro?",
    options: [
      "Substituí-lo imediatamente",
      "Conversar 1:1 para entender contexto e oferecer apoio",
      "Reportar ao cliente",
      "Ignorar até melhorar",
    ],
    answer: 1,
  },
  {
    q: "Coordenação eficiente entre times exige principalmente:",
    options: [
      "Mais reuniões",
      "Documentação clara, ritos curtos e responsáveis definidos",
      "Microgerenciamento",
      "Ferramentas caras",
    ],
    answer: 1,
  },
  {
    q: "Ao receber uma demanda ambígua de um cliente, o melhor é:",
    options: [
      "Começar e ajustar depois",
      "Recusar a demanda",
      "Fazer perguntas para alinhar escopo e critérios de sucesso",
      "Pedir para outra pessoa decidir",
    ],
    answer: 2,
  },
  {
    q: "Treinar uma nova equipe para um cliente requer:",
    options: [
      "Apenas manuais",
      "Contexto do negócio, prática guiada e feedback contínuo",
      "Apostila padrão",
      "Vídeo único de 2 horas",
    ],
    answer: 1,
  },
];

export const Route = createFileRoute("/testes")({
  head: () => ({
    meta: [{ title: "Testes práticos — Shared Solve" }],
  }),
  component: TestesPage,
});

function TestesPage() {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce(
    (acc, a, i) => acc + (a === questions[i].answer ? 1 : 0),
    0,
  );
  const pct = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-bold">Simulação prática</h1>
        <p className="mt-3 text-muted-foreground">
          Cinco situações reais do dia a dia de equipes coordenadas pela Shared Solve.
          Escolha a melhor resposta para cada uma.
        </p>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-10 space-y-6"
          >
            {questions.map((q, i) => (
              <Card key={i} className="p-6">
                <p className="font-medium">
                  {i + 1}. {q.q}
                </p>
                <div className="mt-4 space-y-2">
                  {q.options.map((opt, j) => (
                    <label
                      key={j}
                      className={`flex cursor-pointer items-start gap-3 rounded-md border p-3 text-sm transition-colors ${
                        answers[i] === j
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="mt-1 accent-[var(--color-primary)]"
                        checked={answers[i] === j}
                        onChange={() => {
                          const next = [...answers];
                          next[i] = j;
                          setAnswers(next);
                        }}
                        required
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
            <Button type="submit" size="lg">
              Ver resultado
            </Button>
          </form>
        ) : (
          <Card className="mt-10 p-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold">Resultado: {pct}%</h2>
            <p className="mt-2 text-muted-foreground">
              Você acertou {score} de {questions.length} situações.
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              Nossa equipe vai considerar este resultado junto com sua candidatura.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setAnswers(Array(questions.length).fill(-1));
                setSubmitted(false);
              }}
            >
              Refazer
            </Button>
          </Card>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
