import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NextProject } from "@/components/project/NextProject";
import { ProjectAside } from "@/components/project/ProjectAside";
import { ProjectBody } from "@/components/project/ProjectBody";
import { ProjectHeader } from "@/components/project/ProjectHeader";
import { Container } from "@/components/ui/Layout";
import { nextProjectOf, projectsWithPage } from "@/content/projectPages";
import { anchors } from "@/content/sections";
import { profile } from "@/content/profile";

import styles from "./page.module.css";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projectsWithPage.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsWithPage.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} · ${profile.name}`,
    description: project.summary,
    alternates: { canonical: `/projetos/${project.slug}/` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = projectsWithPage.find((p) => p.slug === slug);
  if (!project) notFound();
  const next = nextProjectOf(slug);
  return (
    <main id={anchors.content} className={styles.main}>
      <Container>
        <div className={styles.page}>
          <ProjectHeader project={project} page={project.page} />
          <div className={styles.columns}>
            <div className={styles.aside}>
              <ProjectAside project={project} page={project.page} />
            </div>
            <div className={styles.body}>
              <ProjectBody page={project.page} />
            </div>
          </div>
          {next ? <NextProject project={next} /> : null}
        </div>
      </Container>
    </main>
  );
}
