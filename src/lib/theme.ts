import { STORAGE_KEYS } from "./storage";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * Roda no <head> antes de desenhar a página, para o tema não "piscar".
 * Escolha salva > preferência do sistema > escuro.
 * O hash deste script entra na CSP (scripts/csp-hashes.ts).
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})();`;
