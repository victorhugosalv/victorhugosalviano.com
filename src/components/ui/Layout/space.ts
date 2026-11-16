/** Espaços do Figma (variáveis --space-*). */
export type Space = 2 | 4 | 6 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64 | 80 | 120;

/** Um valor só, ou um para o celular e outro a partir de 1024 px. */
export type Responsive<T> = T | { base: T; desktop: T };

export function gapClasses(styles: Readonly<Record<string, string>>, gap: Responsive<Space>) {
  if (typeof gap === "number") return styles[`g${gap}`] ?? "";
  return `${styles[`g${gap.base}`] ?? ""} ${styles[`dg${gap.desktop}`] ?? ""}`;
}
