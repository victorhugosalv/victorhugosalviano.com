import { Icon } from "@/components/ui/Icon";
import { Period } from "@/components/ui/Period";
import { Picture } from "@/components/ui/Picture";
import { projectTexts } from "@/content/projects";
import { anchors } from "@/content/sections";
import type { Project, ProjectPage } from "@/content/types";

import styles from "./ProjectHeader.module.css";

/** Topo da página do projeto: voltar, rótulo, título, descrição e capa. */
export function ProjectHeader({ project, page }: { project: Project; page: ProjectPage }) {
  return (
    <header className={styles.header}>
      <a href={`/#${anchors.projects}`} className={styles.back}>
        <Icon name="arrow-left" />
        {projectTexts.backToProjects}
      </a>
      <div className={styles.titles}>
        <Period {...project.period} before={[page.label]} after={project.tags} />
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.lead}>{page.description}</p>
      </div>
      {project.image ? (
        <div className={styles.cover}>
          <Picture
            {...project.image}
            sizes="(min-width: 1024px) 1200px, calc(100vw - 48px)"
            priority
          />
        </div>
      ) : null}
    </header>
  );
}
