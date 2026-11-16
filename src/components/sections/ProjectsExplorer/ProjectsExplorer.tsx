"use client";

import { useId, useMemo, useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Grid } from "@/components/ui/Layout";
import { Icon } from "@/components/ui/Icon";
import {
  countLabel,
  filtersLabel,
  projectsIndexTexts as t,
  removeFilterLabel,
  statusLabels,
} from "@/content/projectsIndex";
import type { Project, ProjectStatus } from "@/content/types";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import {
  ALL_STATUSES,
  NO_FILTERS,
  filterProjects,
  hasFilters,
  parseFilters,
  serializeFilters,
  techOptions,
  type ProjectFilters,
} from "@/lib/projects";

import { ProjectCard } from "../Projects/ProjectCard";

import styles from "./ProjectsExplorer.module.css";

const STATUSES = Object.keys(statusLabels) as ProjectStatus[];

/**
 * Lista de /projetos/ com busca, Status (rádios) e o botão Filtros, que abre as tecnologias
 * (caixas de seleção). O estado fica no endereço (?q=&status=&tec=) para dar para
 * compartilhar: o endereço é a fonte da verdade (useLocationSearch). Sem JavaScript, os
 * controles somem pelo CSS e a lista aparece inteira.
 */
export function ProjectsExplorer({ projects }: { projects: readonly Project[] }) {
  const techs = useMemo(() => techOptions(projects), [projects]);
  const [search, setSearch] = useLocationSearch();
  const filters = useMemo(
    () => parseFilters(search, { statuses: [ALL_STATUSES, ...STATUSES], techs }),
    [search, techs],
  );
  const setFilters = (next: ProjectFilters) => setSearch(serializeFilters(next));
  const panel = useDisclosure();
  const searchRef = useRef<HTMLInputElement>(null);
  const ids = { search: useId(), status: useId(), statusLabel: useId(), techLabel: useId() };

  const shown = filterProjects(projects, filters);
  const update = (patch: Partial<ProjectFilters>) => setFilters({ ...filters, ...patch });
  const toggleTech = (tech: string) =>
    update({
      tec: filters.tec.includes(tech)
        ? filters.tec.filter((x) => x !== tech)
        : [...filters.tec, tech],
    });
  // Os botões de limpar somem ao clicar; o foco volta para a busca.
  const clear = () => {
    setFilters(NO_FILTERS);
    searchRef.current?.focus();
  };
  const removeTech = (tech: string) => {
    toggleTech(tech);
    searchRef.current?.focus();
  };

  return (
    <div className={styles.explorer}>
      <div className={`${styles.search} ${styles.control}`}>
        <label htmlFor={ids.search} className={styles.label}>
          {t.searchLabel}
        </label>
        <div className={styles.field}>
          <Icon name="search" size={20} />
          <input
            ref={searchRef}
            id={ids.search}
            type="search"
            autoComplete="off"
            placeholder={t.searchPlaceholder}
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            className={styles.input}
          />
        </div>
      </div>

      <div className={`${styles.status} ${styles.control}`}>
        <span id={ids.statusLabel} className={styles.label}>
          {t.status}
        </span>
        <div role="radiogroup" aria-labelledby={ids.statusLabel} className={styles.segmented}>
          {[ALL_STATUSES, ...STATUSES].map((value) => (
            <label key={value} className={styles.segment}>
              <input
                type="radio"
                name={ids.status}
                value={value}
                checked={filters.status === value}
                onChange={() => update({ status: value })}
                className={styles.visuallyHidden}
              />
              {value === ALL_STATUSES ? t.allStatuses : statusLabels[value as ProjectStatus]}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-expanded={panel.isOpen}
        aria-controls={panel.panelId}
        aria-label={filtersLabel(filters.tec.length)}
        onClick={panel.toggle}
        className={`${styles.filters} ${styles.control}`}
      >
        <Icon name="adjustments" size={18} />
        {t.filters}
        {filters.tec.length > 0 ? (
          <span className={styles.badge} aria-hidden="true">
            {filters.tec.length}
          </span>
        ) : null}
        <Icon name={panel.isOpen ? "chevron-up" : "chevron-down"} />
      </button>

      <div
        id={panel.panelId}
        hidden={!panel.isOpen}
        className={`${styles.panel} ${styles.control}`}
      >
        <div role="group" aria-labelledby={ids.techLabel}>
          <span id={ids.techLabel} className={styles.label}>
            {t.tech}
          </span>
          <p className={styles.hint}>{t.techHint}</p>
          <ul className={styles.chips}>
            {techs.map((tech) => (
              <li key={tech}>
                <label className={styles.chip}>
                  <input
                    type="checkbox"
                    checked={filters.tec.includes(tech)}
                    onChange={() => toggleTech(tech)}
                    className={styles.visuallyHidden}
                  />
                  <span className={styles.check} aria-hidden="true">
                    <Icon name="check" />
                  </span>
                  {tech}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className={styles.count} role="status">
        {countLabel(shown.length)}
      </p>

      {hasFilters(filters) ? (
        <div className={`${styles.applied} ${styles.control}`}>
          {filters.tec.map((tech) => (
            <button
              key={tech}
              type="button"
              aria-label={removeFilterLabel(tech)}
              onClick={() => removeTech(tech)}
              className={styles.appliedChip}
            >
              {tech}
              <Icon name="x" />
            </button>
          ))}
          <button type="button" onClick={clear} className={styles.clear}>
            {t.clear}
          </button>
        </div>
      ) : null}

      <div className={styles.results}>
        {shown.length > 0 ? (
          <Grid columns={{ base: 1, desktop: 2 }} gap={{ base: 20, desktop: 24 }}>
            {shown.map((project) => (
              <ProjectCard key={project.slug} project={project} headingLevel={2} />
            ))}
          </Grid>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyText}>{t.empty}</p>
            <Button variant="secondary" onClick={clear}>
              {t.clear}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
