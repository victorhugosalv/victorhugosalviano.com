import {
  siClaude,
  siCss,
  siCypress,
  siDocker,
  siFlyway,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siJunit5,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siReact,
  siSpringboot,
  siSpringsecurity,
  siTailwindcss,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

/**
 * Marcas usadas no site. Com logo: ícone do Simple Icons (CC0; Java usa o do OpenJDK).
 * Sem logo (só cor do hover): LinkedIn, que saiu do Simple Icons.
 * As cores do hover saem daqui para o brand-colors.css (scripts/brand-colors.ts).
 */
const logos = {
  java: siOpenjdk,
  typescript: siTypescript,
  javascript: siJavascript,
  python: siPython,
  springboot: siSpringboot,
  springsecurity: siSpringsecurity,
  flyway: siFlyway,
  jwt: siJsonwebtokens,
  nodejs: siNodedotjs,
  html: siHtml5,
  css: siCss,
  react: siReact,
  nextjs: siNextdotjs,
  tailwind: siTailwindcss,
  postgresql: siPostgresql,
  mysql: siMysql,
  docker: siDocker,
  git: siGit,
  junit: siJunit5,
  cypress: siCypress,
  claude: siClaude,
  github: siGithub,
} as const satisfies Record<string, SimpleIcon>;

/** Marcas sem logo no Simple Icons, só com a cor oficial. */
const colorOnly = {
  linkedin: "0A66C2",
} as const;

export type BrandSlug = keyof typeof logos | keyof typeof colorOnly;

export function brandIcon(slug: BrandSlug): SimpleIcon | undefined {
  return slug in logos ? logos[slug as keyof typeof logos] : undefined;
}

export function brandHex(slug: BrandSlug): string {
  return slug in logos
    ? logos[slug as keyof typeof logos].hex
    : colorOnly[slug as keyof typeof colorOnly];
}

export const brandSlugs = [...Object.keys(logos), ...Object.keys(colorOnly)] as BrandSlug[];
