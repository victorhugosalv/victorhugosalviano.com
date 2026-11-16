import type { ProjectStatus } from "./types";

/** Textos da página /projetos/ (aprovados pelo Victor em 16/11/2026, v6.1). */
export const projectsIndexTexts = {
  title: "Projetos",
  lead: "Projetos da faculdade, em equipe e de estudo. Busque pelo nome ou filtre por status e tecnologia.",
  metaTitle: "Projetos · Victor Hugo Salviano",
  metaDescription:
    "Projetos de Victor Hugo Salviano: o que cada um é, stack, período e repositórios.",
  searchLabel: "Buscar projeto",
  searchPlaceholder: "Nome, descrição ou tecnologia",
  status: "Status",
  allStatuses: "Todos",
  filters: "Filtros",
  tech: "Tecnologia",
  techHint: "Mostra os projetos que usam qualquer uma das marcadas.",
  empty: "Nenhum projeto com esses filtros.",
  clear: "Limpar filtros",
} as const;

export const statusLabels: Record<ProjectStatus, string> = {
  "em-desenvolvimento": "Em desenvolvimento",
  concluido: "Concluído",
};

export const countLabel = (n: number) => (n === 1 ? "1 projeto" : `${n} projetos`);
export const filtersLabel = (n: number) =>
  n === 0
    ? projectsIndexTexts.filters
    : `${projectsIndexTexts.filters}, ${n} ${n === 1 ? "ativo" : "ativos"}`;
export const removeFilterLabel = (tech: string) => `Remover filtro ${tech}`;
