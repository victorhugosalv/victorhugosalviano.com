import type { BrandSlug } from "@/lib/brands";

import { Icon, type IconName } from "../Icon";

import styles from "./Chip.module.css";

interface ChipProps {
  label: string;
  icon?: IconName;
  /** Cor do hover e do foco (borda e fundo). Sem marca, usa o vermelho. */
  brand?: BrandSlug;
  href?: string;
  onClick?: () => void;
  /** Texto lido depois do rótulo (ex.: "repositório no GitHub"). */
  description?: string;
}

/** Link (ou botão) compacto com ícone. 36 px visíveis, 44 px de área de toque. */
export function Chip({ label, icon, brand, href, onClick, description }: ChipProps) {
  const content = (
    <>
      {icon ? <Icon name={icon} /> : null}
      <span>{label}</span>
      {description ? <span className={styles.srOnly}>{description}</span> : null}
    </>
  );
  if (href) {
    return (
      <a href={href} data-brand={brand} className={styles.chip}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} data-brand={brand} className={styles.chip}>
      {content}
    </button>
  );
}
