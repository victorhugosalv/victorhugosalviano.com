import { brandIcon, type BrandSlug } from "@/lib/brands";

import styles from "./BrandLogo.module.css";

interface BrandLogoProps {
  brand: BrandSlug;
  size?: 14 | 16;
}

/** Logo monocromático (Simple Icons, CC0) na cor do texto. Decorativo. */
export function BrandLogo({ brand, size = 14 }: BrandLogoProps) {
  const icon = brandIcon(brand);
  if (!icon) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={styles.logo}
    >
      <path d={icon.path} />
    </svg>
  );
}
