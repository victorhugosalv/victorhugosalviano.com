"use client";

import { useMenuButton } from "@/hooks/useMenuButton";

import { DownloadMenu, type DownloadItem } from "../DownloadMenu";
import { Icon, type IconName } from "../Icon";

import styles from "./SplitButton.module.css";

interface SplitButtonProps {
  /** Ação principal (link). */
  label: string;
  href: string;
  icon: IconName;
  /** Nome acessível do botão do menu. */
  menuLabel: string;
  items: readonly DownloadItem[];
}

/** Botão dividido: à esquerda abre o arquivo; à direita, menu para baixar em outros formatos. */
export function SplitButton({ label, href, icon, menuLabel, items }: SplitButtonProps) {
  const { isOpen, buttonProps, menuProps, getItemProps } = useMenuButton(items.length);
  return (
    <div className={styles.group}>
      <a href={href} className={styles.main}>
        <Icon name={icon} />
        {label}
      </a>
      <span className={styles.divider} aria-hidden="true" />
      <button
        {...buttonProps}
        aria-label={menuLabel}
        className={`${styles.toggle} ${isOpen ? styles.open : ""}`}
      >
        <Icon name="download" />
      </button>
      <DownloadMenu items={items} menuProps={menuProps} getItemProps={getItemProps} />
    </div>
  );
}
