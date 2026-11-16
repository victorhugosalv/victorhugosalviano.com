import { Icon } from "@/components/ui/Icon";

import styles from "./ThemeToggle.module.css";

/**
 * Sol no escuro (leva ao claro) e lua no claro. Os dois são desenhados e o CSS mostra
 * o certo pelo data-theme, então o ícone nunca "pisca" ao carregar.
 */
export function ThemeIcon({ size = 20 }: { size?: 20 | 24 }) {
  return (
    <>
      <span className={styles.whenDark}>
        <Icon name="sun" size={size} tone="sun" />
      </span>
      <span className={styles.whenLight}>
        <Icon name="moon" size={size} tone="moon" />
      </span>
    </>
  );
}
