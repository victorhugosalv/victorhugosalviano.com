import { STORAGE_KEYS } from "./storage";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

/** Atributo no <html> enquanto a abertura do NSX (1ª visita) está na tela. */
export const INTRO_ATTRIBUTE = "data-intro";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * Roda no <head> antes de desenhar a página:
 * 1. tema sem "piscar": escolha salva > preferência do sistema > escuro;
 * 2. abertura do NSX só na 1ª visita e nunca com movimento reduzido.
 * O hash deste script entra na CSP (scripts/csp-hashes.ts).
 */
export const themeInitScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)});if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}d.setAttribute("data-theme",t)}catch(e){}try{if(!localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.introSeen,
)})&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){localStorage.setItem(${JSON.stringify(
  STORAGE_KEYS.introSeen,
)},"1");d.setAttribute(${JSON.stringify(INTRO_ATTRIBUTE)},"")}}catch(e){}})();`;

/** Tema aplicado agora no <html> (o script do <head> já o definiu). */
export function readTheme(): Theme {
  const value = document.documentElement.getAttribute("data-theme");
  return isTheme(value) ? value : "dark";
}

/** Aplica o tema e guarda a escolha (se o armazenamento estiver disponível). */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Armazenamento bloqueado: o tema vale só nesta visita.
  }
}
