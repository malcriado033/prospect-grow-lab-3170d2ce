// Per-area recruitment content: written questions + multiple choice quiz
export type WrittenQuestion = { id: string; label: string; placeholder?: string };
export type QuizQuestion = { q: string; options: string[]; answer: number };

export type AreaContent = {
  id: string;
  title: string;
  blurb: string;
  written: WrittenQuestion[];
  quiz: QuizQuestion[];
  hasSimulation?: boolean;
};

export const AREAS: AreaContent[] = [
  {
    id: "atendente",
    title: "Atendente",
    blurb: "Responde tickets de membros no Discord com clareza e empatia.",
    hasSimulation: true,
    written: [
      { id: "exp", label: "Conte uma experiência sua atendendo pessoas (online ou pessoalmente)." },
      { id: "rotina", label: "Quantas horas por dia você consegue dedicar e em quais turnos?" },
      { id: "dificil", label: "Como você lidaria com um membro irritado pedindo reembolso?" },
    ],
    quiz: [
      {
        q: "Um membro abre um ticket dizendo apenas \"não funciona\". O que você faz?",
        options: [
          "Fecha o ticket pedindo mais clareza",
          "Pede gentilmente detalhes: o que tentou fazer e qual erro apareceu",
          "Marca o supervisor",
          "Responde \"reinicia o app\"",
        ],
        answer: 1,
      },
      {
        q: "O membro está claramente irritado. Sua primeira mensagem deve:",
        options: [
          "Avisar que ele será banido se continuar",
          "Reconhecer o incômodo e mostrar disposição em ajudar",
          "Ignorar o tom e seguir o roteiro",
          "Pedir para ele se acalmar",
        ],
        answer: 1,
      },
      {
        q: "Você não sabe a resposta de uma dúvida técnica. O correto é:",
        options: [
          "Inventar uma resposta para parecer competente",
          "Dizer que vai verificar com a equipe e voltar com retorno",
          "Encerrar o ticket",
          "Mandar o membro pesquisar no Google",
        ],
        answer: 1,
      },
      {
        q: "Qual horário NÃO é apropriado para encerrar um ticket?",
        options: [
          "Quando o problema foi resolvido e confirmado",
          "Quando o membro confirma que está satisfeito",
          "Quando o membro ainda está respondendo dúvidas",
          "Após inatividade prolongada com aviso prévio",
        ],
        answer: 2,
      },
      {
        q: "Em um ticket, como você se identifica?",
        options: [
          "Sem cumprimento, vai direto ao ponto",
          "Saudação cordial + nome + se coloca à disposição",
          "Apenas \"oi\"",
          "Manda só um emoji",
        ],
        answer: 1,
      },
    ],
  },
  {
    id: "moderador",
    title: "Moderador",
    blurb: "Garante o cumprimento das regras e mantém o servidor saudável.",
    written: [
      { id: "exp", label: "Você já moderou algum servidor ou comunidade? Conte." },
      { id: "regras", label: "O que diferencia uma advertência de um ban definitivo na sua visão?" },
      { id: "conflito", label: "Como agir quando outro mod toma uma decisão que você discorda?" },
    ],
    quiz: [
      {
        q: "Dois membros estão brigando no chat. Primeiro passo:",
        options: ["Banir os dois", "Apagar mensagens e advertir", "Ignorar", "Tirar print e mostrar no público"],
        answer: 1,
      },
      {
        q: "Um amigo seu quebrou uma regra. Você:",
        options: ["Ignora", "Aplica a punição padrão", "Avisa em DM e libera", "Sai do cargo"],
        answer: 1,
      },
      {
        q: "Punições devem ser:",
        options: ["Aleatórias", "Consistentes e proporcionais", "Sempre máximas", "Decididas em grupo no público"],
        answer: 1,
      },
      {
        q: "Antes de banir definitivo, o ideal é:",
        options: ["Banir e avisar depois", "Documentar histórico e consultar o time", "Avisar no chat geral", "Pedir opinião dos membros"],
        answer: 1,
      },
    ],
  },
  {
    id: "coordenador",
    title: "Coordenador de Equipe",
    blurb: "Lidera squads de atendimento/moderação alocadas em clientes.",
    written: [
      { id: "exp", label: "Descreva uma equipe que você liderou e o resultado entregue." },
      { id: "metrica", label: "Quais métricas você usaria para medir saúde da operação?" },
      { id: "conflito", label: "Como resolve conflito entre dois liderados?" },
    ],
    quiz: [
      {
        q: "SLA da operação está estourando. Primeira ação:",
        options: ["Cobrar a equipe", "Identificar gargalo e replanejar escalas", "Esperar normalizar", "Ignorar"],
        answer: 1,
      },
      {
        q: "Feedback negativo deve ser dado:",
        options: ["No público para servir de exemplo", "Em 1:1, específico e acionável", "Por mensagem genérica", "Por outro membro"],
        answer: 1,
      },
      {
        q: "Cliente pede mudança de escopo no meio do sprint:",
        options: ["Aceita tudo", "Avalia impacto, alinha prioridades e replaneja", "Recusa de cara", "Manda o time decidir"],
        answer: 1,
      },
      {
        q: "Boa coordenação se baseia em:",
        options: ["Reuniões longas", "Ritos curtos, donos claros e documentação", "Microgerenciamento", "Sorte"],
        answer: 1,
      },
    ],
  },
];

export function getArea(id: string) {
  return AREAS.find((a) => a.id === id);
}
