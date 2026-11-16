import type { Project } from "./types";

/**
 * Projetos, na ordem da página. Fatos do curriculo.md; textos do Figma v4 aprovado;
 * BichedIn: texto e stack aprovados pelo Victor em 15/11/2026. Páginas do BichedIn e da
 * Docenda: TEXTOS-V6 aprovado em 16/11/2026 (Docenda: só o que é planejado, sem código).
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
      // Telas do front rodando localmente com os dados de exemplo dos testes (fictícios).
      screens: {
        label: "Telas da Rinha do Campus IV",
        images: [
          {
            name: "rinha-tela-1",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Página Explorar Torneios com um torneio de exemplo em destaque: inscrições abertas, premiação, equipes confirmadas e data.",
          },
          {
            name: "rinha-tela-2",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Página de um torneio com o cronograma, as regras gerais, a taxa por jogador e o botão de inscrição.",
          },
        ],
      },
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
    repos: [
      {
        name: "victorhugosalv/docenda",
        href: "https://github.com/victorhugosalv/docenda",
        description: "Requisitos e decisões de arquitetura",
      },
    ],
    imagePlaceholder: "Tela quando existir",
    page: {
      label: "Projeto",
      description: "Plataforma web para criar e avaliar planos de aula de Computação com IA.",
      sections: [
        {
          title: "Como funciona",
          paragraphs: [
            "Planejado: o professor ou licenciando descreve a turma de forma agregada, sem nome nem dado de aluno, e escolhe o modelo do plano. A IA sugere o conteúdo, com habilidades só do catálogo oficial da BNCC Computação e fontes reais e verificadas. O autor aceita, edita ou recusa cada sugestão, e o sistema mostra o que veio da IA.",
          ],
        },
        {
          title: "Linha do tempo",
          milestones: [
            {
              date: { label: "nov/2026", iso: "2026-11" },
              text: "Propósito e requisitos escritos e aprovados.",
            },
            {
              date: { label: "nov/2026", iso: "2026-11" },
              text: "Decisões de arquitetura registradas, cada uma com alternativas e consequências: stack, autenticação, banco, IA e segurança.",
            },
            {
              date: { label: "Próximo" },
              text: "Planejado: ambiente com Docker e o começo do código.",
            },
          ],
        },
        {
          title: "Minha parte",
          items: [
            "Projeto individual: escrevi o propósito e os requisitos e tomei as decisões de arquitetura, usando a IA para levantar alternativas e consequências.",
          ],
        },
      ],
      stackTitle: "Stack planejada",
      stack: ["TypeScript", "Node.js", "React", "PostgreSQL", "Docker", "API da Anthropic"],
    },
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
    page: {
      label: "Projeto",
      description:
        "Currículos gamificados de bichos de estimação: galeria com filtros, criação com prévia ao vivo e XP ganho com petiscos. Projeto de estudo de front-end sem framework, feito a partir de um design próprio no Figma.",
      sections: [
        {
          title: "Como funciona",
          paragraphs: [
            "A página inicial mostra bichos em destaque, e a galeria lista todos, com busca sem diferenciar acentos, filtro por espécie e ordenação, guardados no endereço para dar para compartilhar. Cada bicho tem um currículo com atributos, conquistas e experiência. No Criar, o formulário monta a prévia do cartão ao vivo, com 350 pontos para distribuir entre os atributos, e salva o bicho no próprio navegador. Dar um petisco soma 50 XP e pode subir o bicho de nível.",
          ],
        },
        {
          title: "Linha do tempo",
          milestones: [
            {
              date: { label: "set/2026", iso: "2026-09" },
              text: "Design próprio no Figma e o HTML e o CSS das quatro páginas: início, galeria, currículo e criar.",
            },
            {
              date: { label: "out/2026", iso: "2026-10" },
              text: "JavaScript sem framework: tema claro e escuro, menu do celular, cartões gerados a partir de dados e a galeria com busca e filtros.",
            },
            {
              date: { label: "out/2026", iso: "2026-10" },
              text: "Currículo de cada bicho, formulário com prévia ao vivo, dados salvos no navegador e petiscos com XP.",
            },
            {
              date: { label: "Próximo" },
              text: "Planejado: testes e esteira de CI/CD; depois, um back-end com FastAPI.",
            },
          ],
        },
        {
          title: "Minha parte",
          items: [
            "Desenhei as quatro páginas no Figma, em celular e desktop, com tema claro e escuro.",
            "Escrevi o HTML e o CSS da página inicial e dos componentes reutilizáveis (botão, chip, selo, barra e cartão), mobile-first.",
            "Em JavaScript, escrevi o tema sem piscar, os cartões gerados a partir de dados (escapando o texto do usuário), a galeria (busca, filtro, ordenação e estado na URL) e o currículo lido pelo ?id= da URL.",
            "Da persistência em diante (salvar no navegador, petiscos e avisos), trabalhei com a IA implementando e eu revisando conceito, fluxo e alternativas de cada passo.",
          ],
        },
      ],
      stack: ["HTML", "CSS", "JavaScript (módulos ES)", "localStorage", "Figma"],
      // Telas capturadas do app rodando localmente, com os bichos de exemplo (fictícios).
      screens: {
        label: "Telas do BichedIn",
        images: [
          {
            name: "bichedin-tela-1",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Página inicial do BichedIn com três bichos em destaque.",
          },
          {
            name: "bichedin-tela-2",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Galeria com a busca, o filtro por espécie e os cartões dos bichos.",
          },
          {
            name: "bichedin-tela-3",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Currículo de um bicho com atributos, conquistas e experiência.",
          },
          {
            name: "bichedin-tela-4",
            widths: [600, 1200],
            width: 1200,
            height: 750,
            alt: "Formulário Criar com a prévia do cartão ao lado.",
          },
        ],
      },
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
  previousScreen: "Tela anterior",
  nextScreen: "Próxima tela",
  /** rótulo de cada tela do carrossel para o leitor de tela ("2 de 5") */
  screenLabel: "{position} de {total}",
} as const;
