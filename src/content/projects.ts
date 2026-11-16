import type { Project } from "./types";

/**
 * Projetos, na ordem da página. Fatos do curriculo.md; textos do Figma v4 aprovado;
 * BichedIn: texto e stack aprovados pelo Victor em 15/11/2026.
 */
export const projects = [
  {
    slug: "rinha-do-campus-iv",
    status: "concluido",
    title: "Rinha do Campus IV",
    summary:
      "Plataforma de torneios de e-sports do Campus IV (League of Legends, Counter-Strike 2 e Valorant): inscrição de equipes, pagamento pelo Mercado Pago e painel de administração.",
    period: {
      start: { label: "abr/2026", iso: "2026-04" },
      end: { label: "mai/2026", iso: "2026-05" },
    },
    tags: ["em equipe"],
    stack: ["Java", "Spring Boot", "PostgreSQL", "Next.js", "Docker"],
    repos: [
      {
        name: "gbrlmzl/api-rinha-v2",
        href: "https://github.com/gbrlmzl/api-rinha-v2",
        description: "API · Java e Spring Boot",
      },
      {
        name: "gbrlmzl/site-rinha-v2",
        href: "https://github.com/gbrlmzl/site-rinha-v2",
        description: "Site e painel · Next.js",
      },
    ],
    image: {
      name: "rinha",
      widths: [600, 1200, 1800],
      width: 1800,
      height: 893,
      alt: "Artes de League of Legends, Counter-Strike 2 e Valorant",
    },
    featured: true,
    page: {
      label: "Projeto",
      description:
        "Plataforma de torneios de e-sports do Campus IV (League of Legends, Counter-Strike 2 e Valorant): inscrição de equipes, pagamento pelo Mercado Pago e painel de administração.",
      sections: [
        {
          title: "Como funciona",
          paragraphs: [
            "As equipes se inscrevem no torneio do jogo escolhido e pagam pelo Mercado Pago. A organização acompanha inscrições e pagamentos e gerencia os torneios por um painel de administração.",
          ],
        },
        {
          title: "Linha do tempo",
          milestones: [
            {
              date: { label: "abr/2026", iso: "2026-04" },
              text: "Comecei a contribuir na versão 2, com a API em Spring Boot e o site em Next.js.",
            },
            {
              date: { label: "mai/2026", iso: "2026-05" },
              text: "Testes da administração de torneios: 17 de unidade e de controller com JUnit 5 e Mockito, além dos E2E com Cypress.",
            },
            {
              date: { label: "2026", iso: "2026" },
              text: "O torneio não aconteceu por falta de equipes.",
            },
          ],
        },
        {
          title: "Minha parte",
          items: [
            "Implementei na API REST o módulo de torneios (rotas públicas, de inscrição e de administração para criar, cancelar e gerenciar equipes), com validações, DTOs e consultas JPA.",
            "Refatorei os pagamentos para registrar os eventos do webhook do Mercado Pago e adicionei logs com identificador por requisição (MDC).",
            "Construí no front-end (Next.js) a listagem de torneios, a página do torneio e o painel de administração.",
            "Escrevi testes da administração de torneios: 17 testes de unidade e de controller com JUnit 5 e Mockito na API e testes E2E com Cypress no front-end.",
            "Criei o Dockerfile da API e separei as configurações de dev e prod para o deploy.",
          ],
        },
      ],
      stack: [
        "Java",
        "Spring Boot",
        "Spring Security",
        "JWT",
        "PostgreSQL",
        "Flyway",
        "JUnit",
        "Mockito",
        "Next.js",
        "React",
        "TypeScript",
        "Cypress",
        "Docker",
      ],
    },
  },
  {
    slug: "docenda",
    status: "em-desenvolvimento",
    title: "Docenda",
    summary: "Plataforma web para criar e avaliar planos de aula de Computação com IA.",
    period: { start: { label: "nov/2026", iso: "2026-11" }, end: { label: "atual" } },
    tags: ["em desenvolvimento"],
    stackLabel: "Stack planejada:",
    stack: ["TypeScript", "Node.js", "React", "PostgreSQL", "Docker", "API da Anthropic"],
    repos: [],
    note: "Repositório em breve",
    imagePlaceholder: "Tela quando existir",
  },
  {
    slug: "bichedin",
    status: "em-desenvolvimento",
    title: "BichedIn",
    summary:
      "Currículos gamificados de bichos de estimação: galeria com filtros, criação com prévia ao vivo e XP ganho com petiscos. Projeto de estudo de front-end sem framework, feito a partir de um design próprio no Figma.",
    period: { start: { label: "set/2026", iso: "2026-09" }, end: { label: "atual" } },
    tags: ["em desenvolvimento", "privado"],
    stack: ["HTML", "CSS", "JavaScript (módulos ES)", "localStorage", "Figma"],
    repos: [],
    note: "Repositório privado",
    image: {
      name: "bichedin",
      widths: [600, 1200],
      width: 1200,
      height: 630,
      alt: "Logo do BichedIn: uma pata e o nome",
    },
  },
] as const satisfies readonly Project[];

export const projectTexts = {
  more: "Ver mais",
  backToProjects: "Todos os projetos",
  nextProject: "Próximo projeto",
  stack: "Stack",
  repos: "Repositórios",
  newTab: "(abre em nova aba)",
  repoOnGithub: "repositório no GitHub",
} as const;
