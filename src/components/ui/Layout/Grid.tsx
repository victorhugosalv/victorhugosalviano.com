import type { ReactNode } from "react";

import gap from "./gap.module.css";
import styles from "./Layout.module.css";
import { gapClasses, type Responsive, type Space } from "./space";

type Columns = 1 | 2 | 3;

interface GridProps {
  children: ReactNode;
  gap: Responsive<Space>;
  /** Colunas no celular, no tablet (768 px) e no desktop (1024 px). */
  columns: { base: Columns; tablet?: Columns; desktop?: Columns };
  as?: "div" | "ul";
}

/** Grade de colunas iguais. */
export function Grid({ children, gap: space, columns, as: Tag = "div" }: GridProps) {
  const cols = [
    styles[`cols-${columns.base}`],
    columns.tablet ? styles[`tablet-cols-${columns.tablet}`] : "",
    columns.desktop ? styles[`desktop-cols-${columns.desktop}`] : "",
  ].join(" ");
  return <Tag className={`${styles.grid} ${cols} ${gapClasses(gap, space)}`}>{children}</Tag>;
}
