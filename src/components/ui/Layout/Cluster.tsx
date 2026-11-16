import type { ReactNode } from "react";

import gap from "./gap.module.css";
import styles from "./Layout.module.css";
import { gapClasses, type Responsive, type Space } from "./space";

interface ClusterProps {
  children: ReactNode;
  gap: Responsive<Space>;
  justify?: "start" | "center";
  as?: "div" | "ul";
}

/** Filhos lado a lado, quebrando linha quando falta espaço. */
export function Cluster({
  children,
  gap: space,
  justify = "start",
  as: Tag = "div",
}: ClusterProps) {
  return (
    <Tag className={`${styles.cluster} ${styles[`justify-${justify}`]} ${gapClasses(gap, space)}`}>
      {children}
    </Tag>
  );
}
