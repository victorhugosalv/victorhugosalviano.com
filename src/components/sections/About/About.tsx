import { about } from "@/content/about";

import styles from "./About.module.css";

/** Sobre: texto alinhado ao PDF e, ao lado (desktop), o cartão "Fora do código". */
export function About() {
  return (
    <div className={styles.columns}>
      <div className={styles.text}>
        {about.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
      <aside className={styles.aside}>
        <p className={styles.note}>{about.outsideCode}</p>
      </aside>
    </div>
  );
}
