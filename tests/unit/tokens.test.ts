import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { figmaColors } from "./figma-variables";

const css = readFileSync(resolve(process.cwd(), "src/styles/tokens.css"), "utf8");

/** Devolve as declarações "--nome: valor" do primeiro bloco que começa com o seletor. */
function block(selector: string): Record<string, string> {
  const start = css.indexOf(`${selector} {`);
  if (start < 0) throw new Error(`bloco ${selector} não encontrado`);
  const body = css.slice(css.indexOf("{", start) + 1, css.indexOf("}", start));
  const entries = [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]?.trim()]);
  return Object.fromEntries(entries) as Record<string, string>;
}

describe("tokens.css", () => {
  const dark = block(":root");
  const light = block(':root[data-theme="light"]');
  const lightNoJs = block(":root:not([data-theme])");

  it("tema escuro bate com as variáveis do Figma", () => {
    for (const [name, value] of Object.entries(figmaColors.dark)) {
      expect(dark[name], name).toBe(value);
    }
  });

  it("tema claro bate com as variáveis do Figma", () => {
    for (const [name, value] of Object.entries(figmaColors.light)) {
      expect(light[name], name).toBe(value);
    }
  });

  it("o claro sem JavaScript é igual ao claro escolhido no botão", () => {
    expect(lightNoJs).toEqual(light);
  });

  it("espaços e raios batem com o Figma", () => {
    for (const n of figmaColors.space) expect(dark[`--space-${n}`]).toBe(`${n}px`);
    for (const [k, n] of Object.entries(figmaColors.radius))
      expect(dark[`--radius-${k}`]).toBe(`${n}px`);
  });
});
