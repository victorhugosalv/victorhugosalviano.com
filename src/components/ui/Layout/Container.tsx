import type { ReactNode } from "react";

import styles from "./Layout.module.css";

/** Largura máxima do conteúdo e margens laterais da página. */
export function Container({ children }: { children: ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}
