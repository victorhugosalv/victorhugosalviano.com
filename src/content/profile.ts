import type { Link, ResponsiveImage } from "./types";

const email = "contato@victorhugosalviano.com";

/** Fatos do currículo (curriculo-pdf/curriculo.md). */
export const profile = {
  name: "Victor Hugo Salviano",
  /** o nome em duas linhas, como no Figma */
  nameLines: ["Victor Hugo", "Salviano"],
  fullName: "Victor Hugo Salviano Trajano da Silva",
  headline: "Estudante de Ciência da Computação (UFPB) · Engenharia de software e IA",
  photo: {
    name: "foto",
    widths: [400, 700, 1000],
    width: 1000,
    height: 1160,
    alt: "Victor sorrindo, de blazer escuro",
    focus: "top",
  } satisfies ResponsiveImage,
  email,
  links: {
    github: { label: "GitHub", href: "https://github.com/victorhugosalv" },
    linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/victor-hugo-salviano" },
    email: { label: "E-mail", href: `mailto:${email}` },
  } satisfies Record<string, Link>,
} as const;

/** Ações do hero. */
export const heroActions = {
  projects: "Ver projetos",
  cv: {
    label: "Currículo",
    href: "/curriculo/curriculo-victor-hugo-salviano.pdf",
    menuLabel: "Baixar o currículo",
    downloads: [
      {
        label: "PDF",
        href: "/curriculo/curriculo-victor-hugo-salviano.pdf",
        icon: "file-type-pdf",
        fileName: "curriculo-victor-hugo-salviano.pdf",
      },
      {
        label: "Markdown (.md)",
        href: "/curriculo/curriculo-victor-hugo-salviano.md",
        icon: "markdown",
        fileName: "curriculo-victor-hugo-salviano.md",
      },
    ],
  },
} as const;
