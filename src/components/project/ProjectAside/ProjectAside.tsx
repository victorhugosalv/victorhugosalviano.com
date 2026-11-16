import { Cluster } from "@/components/ui/Layout";
import { RepoCard } from "@/components/ui/RepoCard";
import { SkillTag } from "@/components/ui/SkillTag";
import { projectTexts } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import type { Project, ProjectPage, SkillGroup } from "@/content/types";

import styles from "./ProjectAside.module.css";

const groups: readonly SkillGroup[] = skillGroups;
/** Marca de cada skill pelo nome, para a stack do projeto usar o mesmo logo e cor. */
const brandOf = new Map(groups.flatMap((g) => g.skills.map((s) => [s.name, s.brand] as const)));

/** Coluna lateral (desktop) ou bloco logo abaixo da capa (celular): Stack e Repositórios. */
export function ProjectAside({ project, page }: { project: Project; page: ProjectPage }) {
  return (
    <aside className={styles.aside}>
      <section aria-labelledby="stack-titulo" className={styles.block}>
        <h2 id="stack-titulo" className={styles.title}>
          {page.stackTitle ?? projectTexts.stack}
        </h2>
        <Cluster as="ul" gap={8}>
          {page.stack.map((name) => {
            const brand = brandOf.get(name);
            return (
              <li key={name}>
                <SkillTag label={name} {...(brand ? { brand } : {})} />
              </li>
            );
          })}
        </Cluster>
      </section>
      {project.repos.length > 0 || project.note ? (
        <section aria-labelledby="repos-titulo" className={styles.block}>
          <h2 id="repos-titulo" className={styles.title}>
            {projectTexts.repos}
          </h2>
          {/* Sem link: "Repositório privado" ou "Repositório em breve". */}
          {project.repos.length > 0 ? (
            <ul className={styles.repos}>
              {project.repos.map((repo) => (
                <li key={repo.href}>
                  <RepoCard
                    name={repo.name}
                    href={repo.href}
                    newTabLabel={projectTexts.newTab}
                    {...(repo.description ? { description: repo.description } : {})}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.note}>{project.note}</p>
          )}
        </section>
      ) : null}
    </aside>
  );
}
