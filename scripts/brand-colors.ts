// Gera src/styles/brand-colors.css: [data-brand="react"] { --brand: #61dafb } …
// A cor vem do Simple Icons (src/lib/brands.ts). Se a marca tiver menos de 3:1 de contraste
// com o fundo de um tema (ex.: Next.js e GitHub, pretos), usa a cor do texto nesse tema.
// Uso: npx tsx scripts/brand-colors.ts [--check]
import { readFileSync, writeFileSync } from "node:fs";

import { brandHex, brandSlugs } from "../src/lib/brands";

const OUT = "src/styles/brand-colors.css";
const BG = { dark: "0e0e10", light: "f3efe6" } as const;
const MIN_CONTRAST = 3;

function luminance(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const pick = (hex: string, bg: string) =>
  contrast(hex, bg) >= MIN_CONTRAST ? `#${hex.toLowerCase()}` : "var(--color-text)";

const dark: string[] = [];
const light: string[] = [];
for (const slug of [...brandSlugs].sort()) {
  const hex = brandHex(slug);
  dark.push(`[data-brand="${slug}"] {\n  --brand: ${pick(hex, BG.dark)};\n}`);
  const l = pick(hex, BG.light);
  if (l !== pick(hex, BG.dark)) {
    light.push(`:root[data-theme="light"] [data-brand="${slug}"] {\n  --brand: ${l};\n}`);
  }
}

const css = `/* Gerado por scripts/brand-colors.ts. Não edite à mão. */\n\n${dark.join("\n\n")}\n${
  light.length ? `\n${light.join("\n\n")}\n` : ""
}`;

if (process.argv.includes("--check")) {
  if (readFileSync(OUT, "utf8") !== css) {
    console.error(`${OUT} está desatualizado: rode npm run brand-colors`);
    process.exit(1);
  }
  console.log(`${OUT} em dia`);
} else {
  writeFileSync(OUT, css);
  console.log(`${OUT}: ${brandSlugs.length} marcas`);
}
