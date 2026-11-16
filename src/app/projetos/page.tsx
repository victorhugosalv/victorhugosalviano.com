import type { Metadata } from "next";

import { ProjectsExplorer } from "@/components/sections/ProjectsExplorer";
import { Container } from "@/components/ui/Layout";
import { projects } from "@/content/projects";
import { projectsIndexTexts } from "@/content/projectsIndex";
import { anchors } from "@/content/sections";
import { PROJECTS_INDEX_PATH } from "@/lib/projects";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: projectsIndexTexts.metaTitle,
  description: projectsIndexTexts.metaDescription,
  alternates: { canonical: PROJECTS_INDEX_PATH },
};

export default function ProjectsIndexPage() {
  return (
    <main id={anchors.content} className={styles.main}>
      <Container>
        <div className={styles.page}>
          <header className={styles.header}>
            <h1 className={styles.title}>{projectsIndexTexts.title}</h1>
            <p className={styles.lead}>{projectsIndexTexts.lead}</p>
          </header>
          <ProjectsExplorer projects={projects} />
        </div>
      </Container>
    </main>
  );
}
