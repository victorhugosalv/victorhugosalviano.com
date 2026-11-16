import type { ProjectPage } from "@/content/types";

import styles from "./ProjectBody.module.css";

/** Corpo do projeto: Como funciona, Linha do tempo e Minha parte (vêm dos dados). */
export function ProjectBody({ page }: { page: ProjectPage }) {
  return (
    <div className={styles.body}>
      {page.sections.map((section, index) => {
        const id = `parte-${index + 1}`;
        return (
          <section key={section.title} aria-labelledby={id} className={styles.section}>
            <h2 id={id} className={styles.title}>
              {section.title}
            </h2>
            {section.paragraphs?.map((p) => (
              <p key={p.slice(0, 24)} className={styles.paragraph}>
                {p}
              </p>
            ))}
            {section.milestones ? (
              <ol className={styles.milestones}>
                {section.milestones.map((m) => (
                  <li key={m.text} className={styles.milestone}>
                    <time {...(m.date.iso ? { dateTime: m.date.iso } : {})} className={styles.date}>
                      {m.date.label}
                    </time>
                    <p>{m.text}</p>
                  </li>
                ))}
              </ol>
            ) : null}
            {section.items ? (
              <ul className={styles.items}>
                {section.items.map((item) => (
                  <li key={item.slice(0, 24)} className={styles.item}>
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
