import type { ReactNode, Ref } from "react";

import styles from "./FloatingButton.module.css";

interface FloatingButtonProps {
  /** glass: vidro de 48 px (navegação). accent: 56 px em vermelho (atalho de ação). */
  variant?: "glass" | "accent";
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

/** Botão redondo da navegação flutuante: de vidro (48 px) ou de destaque (56 px). */
export function FloatingButton({
  variant = "glass",
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
      <a
        href={href}
        aria-label={label}
        onClick={onClick}
        className={`${styles.button} ${styles[variant]}`}
      >
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
      className={`${styles.button} ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
