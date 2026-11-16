"use client";

import { FloatingButton } from "@/components/ui/FloatingButton";
import { ui } from "@/content/ui";
import { useTheme } from "@/hooks/useTheme";

import { ThemeIcon } from "./ThemeIcon";
import styles from "./ThemeToggle.module.css";

/** Botão redondo do tema (desktop, canto superior direito, na coluna do contato). */
export function ThemeToggleFloating() {
  const { theme, toggleTheme } = useTheme();
  return (
    <FloatingButton
      label={theme === "dark" ? ui.theme.toLightLabel : ui.theme.toDarkLabel}
      onClick={toggleTheme}
      size="large"
    >
      <ThemeIcon size={24} />
    </FloatingButton>
  );
}

/** Linha do tema dentro do menu do celular: ícone e o nome do modo para o qual muda. */
export function ThemeToggleRow() {
  const { toggleTheme } = useTheme();
  return (
    <button type="button" onClick={toggleTheme} className={styles.row}>
      <span className={styles.box}>
        <ThemeIcon />
      </span>
      <span className={styles.whenDark}>{ui.theme.toLight}</span>
      <span className={styles.whenLight}>{ui.theme.toDark}</span>
    </button>
  );
}
