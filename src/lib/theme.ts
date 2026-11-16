import { STORAGE_KEYS } from "./storage";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = STORAGE_KEYS.theme;

/** Atributo no <html> enquanto a abertura do NSX (1ª visita) está na tela. */
export const INTRO_ATTRIBUTE = "data-intro";

/** Cor da barra do navegador no celular (<meta name="theme-color">): o fundo de cada tema. */
export const THEME_COLORS: Record<Theme, string> = { dark: "#0e0e10", light: "#f3efe6" };

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

/**
 * A barra do navegador acompanha o tema escolhido no botão, e não só o do sistema:
 * as duas <meta name="theme-color"> (uma por media query) passam a ter a cor do tema.
 */
export function syncThemeColor(theme: Theme) {
  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", THEME_COLORS[theme]);
  }
}

/** Aplica o tema e guarda a escolha (se o armazenamento estiver disponível). */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  syncThemeColor(theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Armazenamento bloqueado: o tema vale só nesta visita.
  }
}
