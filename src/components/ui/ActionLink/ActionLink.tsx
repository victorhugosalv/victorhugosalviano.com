import { Icon, type IconName } from "../Icon";

import styles from "./ActionLink.module.css";

interface ActionLinkProps {
  label: string;
  href: string;
  icon?: IconName;
  /** texto extra lido pelo leitor de tela (ex.: o nome do projeto) */
  description?: string;
}

/** Link de texto com seta (Ver mais), na cor vermelho-texto. */
export function ActionLink({ label, href, icon = "arrow-up-right", description }: ActionLinkProps) {
  return (
    <a href={href} className={styles.link}>
      {label}
      {description ? <span className={styles.srOnly}>{description}</span> : null}
      <Icon name={icon} />
    </a>
  );
}
