import type { ReactNode } from "react";

import { Icon, type IconName } from "../Icon";

import styles from "./Button.module.css";

interface ButtonProps {
  variant: "primary" | "secondary";
  children: ReactNode;
  /** Com href vira link; sem href, botão. */
  href?: string;
  onClick?: () => void;
  iconStart?: IconName;
  iconEnd?: IconName;
}

/** Botão ou link com cara de botão. Altura 44 (área de toque). */
export function Button({ variant, children, href, onClick, iconStart, iconEnd }: ButtonProps) {
  const content = (
    <>
      {iconStart ? <Icon name={iconStart} /> : null}
      <span>{children}</span>
      {iconEnd ? <Icon name={iconEnd} /> : null}
    </>
  );
  const className = `${styles.button} ${styles[variant]}`;
  if (href) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className}>
      {content}
    </button>
  );
}
