import type { BrandSlug } from "@/lib/brands";

import { BrandLogo } from "../BrandLogo";

import styles from "./SkillTag.module.css";

interface SkillTagProps {
  label: string;
  /** Marca da tecnologia: dá a cor do hover e, se houver, o logo (só no desktop). */
  brand?: BrandSlug;
}

/** Tag de tecnologia. O nome fica no texto; o logo é decorativo. */
export function SkillTag({ label, brand }: SkillTagProps) {
  return (
    <span data-brand={brand} className={styles.tag}>
      {brand ? (
        <span className={styles.logo}>
          <BrandLogo brand={brand} />
        </span>
      ) : null}
      {label}
    </span>
  );
}
