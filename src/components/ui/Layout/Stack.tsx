import type { ReactNode } from "react";

import gap from "./gap.module.css";
import styles from "./Layout.module.css";
import { gapClasses, type Responsive, type Space } from "./space";

interface StackProps {
  children: ReactNode;
  gap: Responsive<Space>;
  align?: "stretch" | "start" | "center";
  as?: "div" | "ul" | "ol";
}

/** Filhos um embaixo do outro, separados por `gap`. */
export function Stack({ children, gap: space, align = "stretch", as: Tag = "div" }: StackProps) {
  return (
    <Tag className={`${styles.stack} ${styles[`align-${align}`]} ${gapClasses(gap, space)}`}>
      {children}
    </Tag>
  );
}
