import { ui } from "@/content/ui";

import styles from "./Footer.module.css";

/** Rodapé igual em todas as páginas, centralizado. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>{ui.footer.privacy}</p>
      <p>{ui.footer.copyright}</p>
    </footer>
  );
}
