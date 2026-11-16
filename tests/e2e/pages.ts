/** Páginas que existem no site. Cada fase acrescenta as suas. */
export const PAGES = ["/", "/projetos/rinha-do-campus-iv/"] as const;

export const THEMES = ["dark", "light"] as const;
export type ThemeName = (typeof THEMES)[number];

/** Larguras do PLANO-NOITE §4. */
export const WIDTHS = [320, 360, 390, 768, 1024, 1280, 1440, 1920] as const;
