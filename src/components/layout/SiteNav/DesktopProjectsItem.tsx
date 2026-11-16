"use client";

import { Icon } from "@/components/ui/Icon";
import { projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { ui } from "@/content/ui";
import { useHoverDisclosure } from "@/hooks/useHoverDisclosure";
import { PROJECTS_INDEX_PATH, projectHref, selectHomeProjects } from "@/lib/projects";

import styles from "./DesktopNav.module.css";
import type { NavLink } from "./navLinks";

/** Quantos projetos a faixa mostra (os mesmos do início). */
const STRIP_PROJECTS = 3;

interface DesktopProjectsItemProps {
  link: NavLink;
  /** "Projetos" é a seção atual (aria-current). */
  active: boolean;
  currentProject: string | undefined;
  onProjectsIndex: boolean;
}

/**
 * "Projetos" na pílula do desktop (APG: disclosure navigation menu with top-level links):
 * o link leva à seção; com o mouse em cima, ou pela seta ao lado, desce uma faixa com os
 * projetos do início e "Todos".
 */
export function DesktopProjectsItem({
  link,
  active,
  currentProject,
  onProjectsIndex,
}: DesktopProjectsItemProps) {
  const { isOpen, panelId, rootRef, buttonRef, toggle, rootProps } =
    useHoverDisclosure<HTMLLIElement>();
  const items = selectHomeProjects<Project>(projects, STRIP_PROJECTS);
  return (
    <li ref={rootRef} className={styles.projectsItem} {...rootProps}>
      <a
        href={link.href}
        aria-current={active ? "true" : undefined}
        className={`${styles.link} ${styles.projectsLink} ${active ? styles.active : ""}`}
      >
        {link.title}
      </a>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={isOpen ? ui.nav.hideProjects : ui.nav.showProjects}
        onClick={toggle}
        className={styles.projectsToggle}
      >
        <Icon name="chevron-down" size={16} />
      </button>
      <div className={styles.dropdown} data-open={isOpen}>
        <ul id={panelId} className={styles.strip}>
          {items.map((project) => (
            <li key={project.slug}>
              <a
                href={projectHref(project)}
                aria-current={project.slug === currentProject ? "page" : undefined}
                className={styles.stripLink}
              >
                {project.shortTitle ?? project.title}
              </a>
            </li>
          ))}
          <li>
            <a
              href={PROJECTS_INDEX_PATH}
              aria-label={ui.nav.allProjectsLabel}
              aria-current={onProjectsIndex ? "page" : undefined}
              className={styles.stripLink}
            >
              {ui.nav.allProjectsShort}
              <Icon name="arrow-up-right" size={16} />
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
}
