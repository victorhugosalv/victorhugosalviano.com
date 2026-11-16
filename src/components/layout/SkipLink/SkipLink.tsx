import { anchors } from "@/content/sections";
import { ui } from "@/content/ui";

import styles from "./SkipLink.module.css";

/** Primeiro item do Tab: pula a navegação. */
export function SkipLink() {
  return (
    <a href={`#${anchors.content}`} className={styles.link}>
      {ui.skipLink}
    </a>
  );
}
