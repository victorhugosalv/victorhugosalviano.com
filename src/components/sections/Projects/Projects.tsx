import { Grid, Stack } from "@/components/ui/Layout";
import { projects } from "@/content/projects";

import { ProjectCard } from "./ProjectCard";

/** Projetos: o destaque ocupa a largura toda; os outros em duas colunas no desktop. */
export function Projects() {
  const featured = projects.filter((p) => "featured" in p && p.featured);
  const others = projects.filter((p) => !("featured" in p && p.featured));
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
    </Stack>
  );
}
