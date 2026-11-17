import { Icon, type IconName } from "../Icon";

import styles from "./SplitChip.module.css";

interface SplitChipProps {
  /** Parte principal: link com ícone e rótulo. */
  label: string;
  icon: IconName;
  href: string;
  /** Botão colado à direita, só com ícone. */
  actionLabel: string;
  actionIcon: IconName;
  onAction: () => void;
  /** Texto anunciado pelo leitor de tela depois da ação (região viva). */
  announcement?: string | null;
}

/**
 * Chip dividido: link à esquerda e um botão de ação colado à direita (ex.: E-mail | copiar),
 * no mesmo desenho do chip (36 px visíveis, 44 px de área de toque).
 */
export function SplitChip({
  label,
  icon,
  href,
  actionLabel,
  actionIcon,
  onAction,
  announcement,
}: SplitChipProps) {
  return (
    <span className={styles.group}>
      <a href={href} className={styles.main}>
        <Icon name={icon} />
        <span>{label}</span>
      </a>
      <span className={styles.divider} aria-hidden="true" />
      <button
        type="button"
        aria-label={actionLabel}
        title={actionLabel}
        onClick={onAction}
        className={styles.action}
      >
        <Icon name={actionIcon} />
      </button>
      <span role="status" className={styles.srOnly}>
        {announcement}
      </span>
    </span>
  );
}
