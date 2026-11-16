import styles from "./SectionHeading.module.css";

interface SectionHeadingProps {
  title: string;
  /** id do h2, para o aria-labelledby da seção. */
  id: string;
  align?: "start" | "center";
}

/** Título de seção (h2), sem número. */
export function SectionHeading({ title, id, align = "start" }: SectionHeadingProps) {
  return (
    <h2 id={id} className={`${styles.heading} ${styles[align]}`}>
      {title}
    </h2>
  );
}
