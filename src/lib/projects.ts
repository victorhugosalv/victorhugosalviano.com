/** Regras puras sobre a lista de projetos (sem React e sem os dados). */

interface Listed {
  readonly slug: string;
  readonly featured?: boolean;
  readonly page?: unknown;
}

/** Endereço da página que lista todos os projetos. */
export const PROJECTS_INDEX_PATH = "/projetos/";

/** Página do projeto, ou o cartão dele no início quando ainda não tem página. */
export function projectHref(project: Listed): string {
  return project.page ? `${PROJECTS_INDEX_PATH}${project.slug}/` : "/#projetos";
}

/** Projetos do início: o destaque primeiro e depois os outros, na ordem dos dados, até `max`. */
export function selectHomeProjects<T extends Listed>(projects: readonly T[], max: number): T[] {
  const featured = projects.filter((p) => p.featured === true);
  const others = projects.filter((p) => p.featured !== true);
  return [...featured, ...others].slice(0, max);
}

/** Projetos do menu do celular: os do início e, se ficou de fora, o projeto atual. */
export function menuProjects<T extends Listed>(
  projects: readonly T[],
  max: number,
  currentSlug?: string,
): T[] {
  const list = selectHomeProjects(projects, max);
  const current = projects.find((p) => p.slug === currentSlug);
  return current && !list.includes(current) ? [...list, current] : list;
}

/** Slug do projeto quando o endereço é /projetos/<slug>/. */
export function projectSlugFromPath(pathname: string): string | undefined {
  return /^\/projetos\/([^/]+)\/?$/.exec(pathname)?.[1];
}

/** true em /projetos/ (com ou sem a barra no fim). */
export function isProjectsIndex(pathname: string): boolean {
  return pathname.replace(/\/$/, "") === PROJECTS_INDEX_PATH.replace(/\/$/, "");
}

/* ---------- Busca e filtros da página /projetos/ ---------- */

/** O que a busca e os filtros olham em cada projeto. */
interface Filterable {
  readonly title: string;
  readonly summary: string;
  readonly stack: readonly string[];
  readonly status: string;
}

export const ALL_STATUSES = "todos";

export interface ProjectFilters {
  /** texto da busca */
  readonly q: string;
  /** "todos" ou um status dos dados */
  readonly status: string;
  /** tecnologias marcadas (o projeto precisa ter qualquer uma delas) */
  readonly tec: readonly string[];
}

export const NO_FILTERS: ProjectFilters = { q: "", status: ALL_STATUSES, tec: [] };

/** Minúsculas e sem acentos (NFD tira os diacríticos), para "programacao" achar "Programação". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/**
 * Busca no nome, na descrição e na stack. Dentro das tecnologias vale qualquer uma
 * marcada; entre busca, status e tecnologia, o projeto precisa atender a todos.
 */
export function filterProjects<T extends Filterable>(
  projects: readonly T[],
  f: ProjectFilters,
): T[] {
  const query = normalize(f.q);
  return projects.filter((p) => {
    if (f.status !== ALL_STATUSES && p.status !== f.status) return false;
    if (f.tec.length > 0 && !f.tec.some((t) => p.stack.includes(t))) return false;
    if (!query) return true;
    return normalize([p.title, p.summary, ...p.stack].join(" ")).includes(query);
  });
}

/** Tecnologias das stacks, sem repetir, na ordem em que aparecem. */
export function techOptions(projects: readonly { readonly stack: readonly string[] }[]): string[] {
  return [...new Set(projects.flatMap((p) => p.stack))];
}

/** Quantos filtros estão ativos (busca não conta: ela tem o próprio campo). */
export function activeFilterCount(f: ProjectFilters): number {
  return (f.status !== ALL_STATUSES ? 1 : 0) + f.tec.length;
}

export function hasFilters(f: ProjectFilters): boolean {
  return f.q.trim() !== "" || activeFilterCount(f) > 0;
}

/** Lê ?q=&status=&tec=&tec= ignorando valores que não existem nos dados. */
export function parseFilters(
  search: string,
  allowed: { statuses: readonly string[]; techs: readonly string[] },
): ProjectFilters {
  const params = new URLSearchParams(search);
  const status = params.get("status") ?? ALL_STATUSES;
  return {
    q: params.get("q") ?? "",
    status: allowed.statuses.includes(status) ? status : ALL_STATUSES,
    tec: [...new Set(params.getAll("tec"))].filter((t) => allowed.techs.includes(t)),
  };
}

/** O inverso de parseFilters: só o que difere do padrão ("" quando não há filtro). */
export function serializeFilters(f: ProjectFilters): string {
  const params = new URLSearchParams();
  // a busca vai como foi digitada (com espaços), para o campo não perder o que se digita
  if (f.q.trim()) params.set("q", f.q);
  if (f.status !== ALL_STATUSES) params.set("status", f.status);
  for (const t of f.tec) params.append("tec", t);
  const query = params.toString();
  return query ? `?${query}` : "";
}
