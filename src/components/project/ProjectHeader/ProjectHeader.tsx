import { Carousel } from "@/components/ui/Carousel";
import { Icon } from "@/components/ui/Icon";
import { Period } from "@/components/ui/Period";
import { Picture } from "@/components/ui/Picture";
import { projectTexts } from "@/content/projects";
import type { Project, ProjectPage } from "@/content/types";
import { PROJECTS_INDEX_PATH } from "@/lib/projects";

import styles from "./ProjectHeader.module.css";

/** Com 2 telas ou mais, um carrossel; senão, a capa (se houver). */
function ProjectMedia({ project, page }: { project: Project; page: ProjectPage }) {
  if (page.screens && page.screens.images.length >= 2) {
    return (
      <Carousel
        label={page.screens.label}
        slideLabel={projectTexts.screenLabel}
        previousLabel={projectTexts.previousScreen}
        nextLabel={projectTexts.nextScreen}
      >
        {page.screens.images.map((image, index) => (
          <Picture
            key={image.name}
            {...image}
            sizes="(min-width: 1024px) 1200px, 90vw"
            priority={index === 0}
          />
        ))}
      </Carousel>
    );
  }
  if (!project.image) return null;
  return (
    <div className={styles.cover}>
      <Picture {...project.image} sizes="(min-width: 1024px) 1200px, calc(100vw - 48px)" priority />
    </div>
  );
}

/**
 * Topo da página do projeto: voltar, rótulo, título, descrição e capa. Com 2 telas ou
 * mais, um carrossel ocupa o lugar da capa.
 */
export function ProjectHeader({ project, page }: { project: Project; page: ProjectPage }) {
  return (
    <header className={styles.header}>
      <a href={PROJECTS_INDEX_PATH} className={styles.back}>
        <Icon name="arrow-left" />
        {projectTexts.backToProjects}
      </a>
      <div className={styles.titles}>
        <Period {...project.period} before={[page.label]} after={project.tags} />
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.lead}>{page.description}</p>
      </div>
      <ProjectMedia project={project} page={page} />
    </header>
  );
}
