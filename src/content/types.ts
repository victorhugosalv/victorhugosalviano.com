/** Tipos dos dados do site. Os componentes recebem estes tipos; nunca dados soltos. */
import type { BrandSlug } from "@/lib/brands";

export interface Section {
  /** id do elemento na página (âncora #id) */
  readonly id: string;
  /** nome na navegação e nos menus */
  readonly title: string;
  /** título na página, quando diferente do nome no menu */
  readonly heading?: string;
  /** aparece na pílula do desktop (Contatos vira o botão flutuante) */
  readonly inDesktopNav: boolean;
}

/** Imagem já otimizada em public/images/<name>-<largura>.(avif|webp). */
export interface ResponsiveImage {
  readonly name: string;
  readonly widths: readonly number[];
  /** proporção largura/altura da imagem gerada */
  readonly width: number;
  readonly height: number;
  readonly alt: string;
  /** onde apoiar o recorte (fotos de pessoas: "top") */
  readonly focus?: "center" | "top";
}

export interface Link {
  readonly label: string;
  readonly href: string;
}

export interface Skill {
  readonly name: string;
  /** marca: cor do hover e, se houver logo no Simple Icons, o logo no desktop */
  readonly brand?: BrandSlug;
}

export interface SkillGroup {
  readonly title: string;
  readonly skills: readonly Skill[];
}

export interface Repo {
  readonly name: string;
  readonly href: string;
  /** o que é (API, site…), para a página do projeto */
  readonly description?: string;
}

/** Data de um período: rótulo como aparece ("abr/2026") e o valor para <time> ("2026-04"). */
export interface DateLabel {
  readonly label: string;
  readonly iso?: string;
}

export interface Period {
  readonly start?: DateLabel;
  readonly end?: DateLabel;
}

/** Situação do projeto (filtro de /projetos/). */
export type ProjectStatus = "em-desenvolvimento" | "concluido";

export interface Project {
  readonly slug: string;
  readonly status: ProjectStatus;
  readonly title: string;
  readonly summary: string;
  readonly period: Period;
  /** rótulos depois do período: "em equipe", "em desenvolvimento", "privado" */
  readonly tags: readonly string[];
  readonly stack: readonly string[];
  /** "Stack planejada:" quando o projeto ainda não tem código */
  readonly stackLabel?: string;
  readonly repos: readonly Repo[];
  /** nota no lugar dos repositórios ("Repositório em breve") */
  readonly note?: string;
  readonly image?: ResponsiveImage;
  /** texto no lugar da imagem enquanto ela não existe */
  readonly imagePlaceholder?: string;
  readonly featured?: boolean;
  /** só projetos com página têm "Ver mais" */
  readonly page?: ProjectPage;
}

export interface ProjectPage {
  /** rótulo antes do período ("Projeto") */
  readonly label: string;
  readonly description: string;
  readonly sections: readonly ProjectPageSection[];
  /** stack completa, na coluna lateral */
  readonly stack: readonly string[];
  /** título da stack quando não é "Stack" (ex.: "Stack planejada", projeto sem código) */
  readonly stackTitle?: string;
  /** telas do projeto: com 2 ou mais, viram um carrossel no lugar da capa */
  readonly screens?: { readonly label: string; readonly images: readonly ResponsiveImage[] };
}

export interface ProjectPageSection {
  readonly title: string;
  readonly paragraphs?: readonly string[];
  readonly items?: readonly string[];
  readonly milestones?: readonly Milestone[];
}

export interface Milestone {
  readonly date: DateLabel;
  readonly text: string;
}

export interface TimelineItem {
  readonly period?: Period;
  /** rótulo no lugar do período (ex.: "Idiomas") */
  readonly label?: string;
  readonly title: string;
  readonly detail?: string;
}
