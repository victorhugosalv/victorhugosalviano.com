import { ActionLink } from "@/components/ui/ActionLink";
import { Grid, Stack } from "@/components/ui/Layout";
import { projects } from "@/content/projects";
import { ui } from "@/content/ui";
import { PROJECTS_INDEX_PATH, selectHomeProjects } from "@/lib/projects";

import { ProjectCard } from "./ProjectCard";

/** Quantos projetos o início mostra: o destaque e mais dois. */
const HOME_PROJECTS = 3;

/**
 * Projetos do início: o destaque ocupa a largura toda e os outros ficam em duas colunas no
 * desktop. Embaixo, sempre, o link para a página com todos (busca e filtros).
 */
export function Projects() {
  const shown = selectHomeProjects(projects, HOME_PROJECTS);
  const featured = shown.filter((p) => "featured" in p && p.featured);
  const others = shown.filter((p) => !("featured" in p && p.featured));
  return (
    <Stack gap={{ base: 20, desktop: 40 }}>
      {featured.map((project) => (
        <ProjectCard key={project.slug} project={project} featured />
      ))}
      <Grid columns={{ base: 1, desktop: 2 }} gap={{ base: 20, desktop: 24 }}>
        {others.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </Grid>
      <div>
        <ActionLink label={ui.nav.allProjects} href={PROJECTS_INDEX_PATH} />
      </div>
    </Stack>
  );
}
