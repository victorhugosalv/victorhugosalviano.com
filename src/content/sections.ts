import type { Section } from "./types";

/**
 * Ordem das seções da página inicial. A navegação e os menus seguem esta ordem.
 * Sem números (decisão de 15/11/2026).
 */
export const sections = [
  { id: "skills", title: "Skills", inDesktopNav: true },
  { id: "projetos", title: "Projetos", inDesktopNav: true },
  { id: "sobre", title: "Sobre", inDesktopNav: true },
  { id: "trajetoria", title: "Trajetória", inDesktopNav: true },
  { id: "contatos", title: "Contatos", heading: "Vamos conversar?", inDesktopNav: false },
] as const satisfies readonly Section[];

export type SectionId = (typeof sections)[number]["id"];

/** Âncoras fixas da página (topo e fim do hero). */
export const anchors = {
  top: "inicio",
  heroEnd: "fim-do-topo",
  content: "conteudo",
  contact: "contatos",
  projects: "projetos",
} as const;
