import { anchors, sections } from "@/content/sections";
import { ui } from "@/content/ui";

export interface NavLink {
  id: string;
  title: string;
  href: string;
}

/** Contatos existe em todas as páginas, então o link fica na própria página. */
const toLink = (s: { id: string; title: string }): NavLink => ({
  id: s.id,
  title: s.title,
  href: s.id === anchors.contact ? `#${s.id}` : `/#${s.id}`,
});

/** Links do menu do celular: Início e todas as seções, na ordem dos dados. */
export const mobileLinks: readonly NavLink[] = [
  toLink({ id: anchors.top, title: ui.nav.home }),
  ...sections.map(toLink),
];

/** Pílula do desktop: as seções marcadas, divididas ao meio pelo logo VHS. */
const desktop = sections.filter((s) => s.inDesktopNav).map(toLink);
const middle = Math.ceil(desktop.length / 2);
export const desktopLinks = { left: desktop.slice(0, middle), right: desktop.slice(middle) };

export const sectionIds = sections.map((s) => s.id);

/** Na página de um projeto, "Projetos" fica marcado. */
export const projectsSectionId = anchors.projects;
