"use client";

import { Icon } from "@/components/ui/Icon";
import { projects } from "@/content/projects";
import { ui } from "@/content/ui";
import { useDisclosure } from "@/hooks/useDisclosure";
import { PROJECTS_INDEX_PATH, menuProjects, projectHref } from "@/lib/projects";

import styles from "./MobileNav.module.css";
import type { NavLink } from "./navLinks";

/** Quantos projetos o menu mostra (os mesmos do início). */
const MENU_PROJECTS = 3;

interface ProjectsMenuItemProps {
  link: NavLink;
  /** "Projetos" é a seção atual (aria-current). */
  current: boolean;
  currentProject: string | undefined;
  onProjectsIndex: boolean;
  /** Fecha o menu inteiro (ao escolher um link). */
  onNavigate: () => void;
}

/**
 * "Projetos" no menu do celular (APG: disclosure navigation menu with top-level links):
 * o link leva à seção e a seta ao lado abre a lista. Na página de um projeto e em
 * /projetos/, a lista já começa aberta, com a página atual marcada.
 */
export function ProjectsMenuItem({
  link,
  current,
  currentProject,
  onProjectsIndex,
  onNavigate,
}: ProjectsMenuItemProps) {
  const sub = useDisclosure(currentProject !== undefined || onProjectsIndex);
  const items = menuProjects(projects, MENU_PROJECTS, currentProject);
  return (
    <>
      <div className={styles.row}>
        <a
          href={link.href}
          onClick={onNavigate}
          aria-current={current ? "true" : undefined}
          className={styles.link}
        >
          {link.title}
        </a>
        <button
          type="button"
          aria-expanded={sub.isOpen}
          aria-controls={sub.panelId}
          aria-label={sub.isOpen ? ui.nav.hideProjects : ui.nav.showProjects}
          onClick={sub.toggle}
          className={styles.subToggle}
        >
          <Icon name={sub.isOpen ? "chevron-up" : "chevron-down"} size={20} />
        </button>
      </div>
      <ul id={sub.panelId} hidden={!sub.isOpen} className={styles.sublist}>
        {items.map((project) => (
          <li key={project.slug}>
            <a
              href={projectHref(project)}
              onClick={onNavigate}
              aria-current={project.slug === currentProject ? "page" : undefined}
              className={styles.sublink}
            >
              {project.title}
            </a>
          </li>
        ))}
        <li>
          <a
            href={PROJECTS_INDEX_PATH}
            onClick={onNavigate}
            aria-current={onProjectsIndex ? "page" : undefined}
            className={styles.sublink}
          >
            {ui.nav.allProjects}
            <Icon name="arrow-up-right" size={16} />
          </a>
        </li>
      </ul>
    </>
  );
}
