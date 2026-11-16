import { Container } from "@/components/ui/Layout";
import { sections } from "@/content/sections";
import type { Section } from "@/content/types";
import { ui } from "@/content/ui";

import { Contact } from "./Contact";
import styles from "./SiteFooter.module.css";

const contact: Section | undefined = sections.find((s) => s.id === "contatos");

/**
 * Fim de todas as páginas: a faixa "Vamos conversar?" (id="contatos") e o rodapé, numa
 * faixa de superfície de ponta a ponta.
 */
export function SiteFooter() {
  return (
    <div className={styles.band}>
      <Container>
        {contact ? <Contact section={contact} /> : null}
        <footer className={styles.footer}>
          <p>{ui.footer.privacy}</p>
          <p>{ui.footer.copyright}</p>
        </footer>
      </Container>
    </div>
  );
}
