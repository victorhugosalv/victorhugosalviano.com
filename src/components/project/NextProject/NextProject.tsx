import { Icon } from "@/components/ui/Icon";
import { projectTexts } from "@/content/projects";
import type { Project } from "@/content/types";

import styles from "./NextProject.module.css";

/** Cartão para o próximo projeto: a página dele, ou o cartão no início se não tiver página. */
export function NextProject({ project }: { project: Project }) {
  const href = project.page ? `/projetos/${project.slug}/` : `/#${project.slug}`;
  return (
    <a href={href} className={styles.card}>
      <span className={styles.texts}>
        <span className={styles.label}>{projectTexts.nextProject}</span>
        <span className={styles.title}>{project.title}</span>
      </span>
      <span className={styles.arrow}>
        <Icon name="arrow-up-right" size={20} />
      </span>
    </a>
  );
}
