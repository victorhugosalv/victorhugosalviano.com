import type { KeyboardEvent, Ref } from "react";

import { Icon, type IconName } from "../Icon";

import styles from "./DownloadMenu.module.css";

export interface DownloadItem {
  label: string;
  href: string;
  icon: IconName;
  /** Nome do arquivo baixado. */
  fileName: string;
}

interface MenuProps {
  ref: Ref<HTMLDivElement>;
  id: string;
  role: "menu";
  "aria-labelledby": string;
  hidden: boolean;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
}

interface ItemProps {
  ref: (el: HTMLElement | null) => void;
  role: "menuitem";
  tabIndex: number;
  onClick: () => void;
}

interface DownloadMenuProps {
  items: readonly DownloadItem[];
  menuProps: MenuProps;
  getItemProps: (index: number) => ItemProps;
}

/** Lista do menu de download (PDF e Markdown). O comportamento vem do useMenuButton. */
export function DownloadMenu({ items, menuProps, getItemProps }: DownloadMenuProps) {
  return (
    <div {...menuProps} className={styles.menu}>
      {items.map((item, index) => (
        <a
          key={item.href}
          href={item.href}
          download={item.fileName}
          {...getItemProps(index)}
          className={styles.item}
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </a>
      ))}
    </div>
  );
}
