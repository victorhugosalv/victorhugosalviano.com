import { projects } from "./projects";
import type { Project, ProjectPage } from "./types";

const all: readonly Project[] = projects;

/** Projetos que têm página própria (hoje, só a Rinha). */
export const projectsWithPage = all.filter(
  (p): p is Project & { page: ProjectPage } => p.page !== undefined,
);

/** O projeto seguinte na ordem da página (volta ao primeiro no fim). */
export function nextProjectOf(slug: string): Project | undefined {
  const index = all.findIndex((p) => p.slug === slug);
  return index < 0 ? undefined : all[(index + 1) % all.length];
}
