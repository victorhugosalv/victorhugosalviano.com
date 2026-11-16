import { Icon } from "../Icon";

import styles from "./RepoCard.module.css";

interface RepoCardProps {
  name: string;
  description?: string;
  href: string;
  /** aviso lido pelo leitor de tela: o link abre em nova aba */
  newTabLabel: string;
}

/** Cartão de repositório: link externo que abre em nova aba (avisando no nome acessível). */
export function RepoCard({ name, description, href, newTabLabel }: RepoCardProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={styles.card}>
      <Icon name="github" size={20} />
      <span className={styles.texts}>
        <span className={styles.name}>{name}</span>
        {description ? <span className={styles.description}>{description}</span> : null}
      </span>
      <span className={styles.srOnly}>{newTabLabel}</span>
      <span className={styles.arrow}>
        <Icon name="arrow-up-right" size={18} />
      </span>
    </a>
  );
}
