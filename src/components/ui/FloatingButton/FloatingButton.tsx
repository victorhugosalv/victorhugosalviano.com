import type { ReactNode, Ref } from "react";

import styles from "./FloatingButton.module.css";

interface FloatingButtonProps {
  /** Nome acessível (o botão só tem ícone). */
  label: string;
  /** O ícone (decorativo). */
  children: ReactNode;
  /** Com href vira link; sem href, botão. */
  href?: string;
  onClick?: () => void;
  expanded?: boolean;
  controls?: string;
  ref?: Ref<HTMLButtonElement>;
}

/** Botão redondo de vidro (48 px), usado na navegação flutuante. */
export function FloatingButton({
  label,
  children,
  href,
  onClick,
  expanded,
  controls,
  ref,
}: FloatingButtonProps) {
  if (href !== undefined) {
    return (
      <a href={href} aria-label={label} onClick={onClick} className={styles.button}>
        {children}
      </a>
    );
  }
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onClick}
      className={styles.button}
    >
      {children}
    </button>
  );
}
