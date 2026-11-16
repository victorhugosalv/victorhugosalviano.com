import type { ReactNode } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";

import styles from "./PageSection.module.css";

interface PageSectionProps {
  id: string;
  title: string;
  align?: "start" | "center";
  children?: ReactNode;
}

/** Seção da página inicial: <section> com título h2 ligado por aria-labelledby. */
export function PageSection({ id, title, align = "start", children }: PageSectionProps) {
  const headingId = `${id}-titulo`;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <SectionHeading id={headingId} title={title} align={align} />
      {children}
    </section>
  );
}
