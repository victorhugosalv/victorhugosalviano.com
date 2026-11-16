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
