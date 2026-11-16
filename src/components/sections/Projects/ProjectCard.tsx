import { ActionLink } from "@/components/ui/ActionLink";
import { Chip } from "@/components/ui/Chip";
import { Cluster } from "@/components/ui/Layout";
import { Period } from "@/components/ui/Period";
import { Picture } from "@/components/ui/Picture";
import { projectTexts } from "@/content/projects";
import type { Project } from "@/content/types";

import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: Project;
  /** destaque: no desktop, imagem à esquerda e texto à direita */
  featured?: boolean;
  /** h3 dentro da seção Projetos do início; h2 na página /projetos/ */
  headingLevel?: 2 | 3;
}

/** Cartão de projeto. O cartão não é link: os links são os repositórios e "Ver mais". */
export function ProjectCard({ project, featured = false, headingLevel = 3 }: ProjectCardProps) {
  const headingId = `${project.slug}-titulo`;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article
      id={project.slug}
      aria-labelledby={headingId}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
    >
      <div className={styles.media}>
        {project.image ? (
          <Picture
            {...project.image}
            sizes={
              featured
                ? "(min-width: 1024px) 600px, (min-width: 768px) 640px, calc(100vw - 48px)"
                : "(min-width: 1024px) 588px, (min-width: 768px) 640px, calc(100vw - 48px)"
            }
          />
        ) : (
          <p className={styles.placeholder} aria-hidden="true">
            {project.imagePlaceholder}
          </p>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.heading}>
          <Heading id={headingId} className={styles.title}>
            {project.title}
          </Heading>
          <Period {...project.period} after={project.tags} />
        </div>
        <p className={styles.summary}>{project.summary}</p>
        <p className={styles.stack}>
          {project.stackLabel ? `${project.stackLabel} ` : null}
          {project.stack.join(" · ")}
        </p>
        {project.repos.length > 0 ? (
          <Cluster as="ul" gap={8}>
            {project.repos.map((repo) => (
              <li key={repo.href}>
                <Chip
                  icon="github"
                  brand="github"
                  label={repo.name.split("/")[1] ?? repo.name}
                  href={repo.href}
                  description={`, ${projectTexts.repoOnGithub}`}
                />
              </li>
            ))}
          </Cluster>
        ) : null}
        {project.note ? <p className={styles.note}>{project.note}</p> : null}
        {project.page ? (
          <ActionLink
            label={projectTexts.more}
            href={`/projetos/${project.slug}/`}
            description={`: ${project.title}`}
          />
        ) : null}
      </div>
    </article>
  );
}
