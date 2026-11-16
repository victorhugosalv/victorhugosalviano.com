import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/** Os quadros do NSX não têm sombra: as rodas encostam direto na linha do asfalto. */
const FRAMES = ["fechado", "aberto", "roda1", "roda2"] as const;
const SHADOW = "S";

/** A grade de pixels fica fora do repositório público; só é conferida onde existe. */
const source = resolve("../design/pixel-art/nsx.json");

describe("NSX em pixel art", () => {
  it.skipIf(!existsSync(source))("nenhum quadro do nsx.json usa a cor da sombra", () => {
    const art = JSON.parse(readFileSync(source, "utf8")) as {
      h: number;
      palette: Record<string, string>;
      frames: Record<string, string[]>;
    };
    expect(art.palette).not.toHaveProperty(SHADOW);
    for (const [name, rows] of Object.entries(art.frames)) {
      expect(rows.join(""), name).not.toContain(SHADOW);
      expect(rows, name).toHaveLength(art.h);
      // a última linha é a das rodas: nada embaixo delas
      expect(rows.at(-1)?.replaceAll(".", "").length, name).toBeGreaterThan(0);
    }
  });

  for (const name of FRAMES) {
    it(`nsx-${name}.svg termina nas rodas, sem sombra preta`, () => {
      const svg = readFileSync(resolve(`public/images/nsx-${name}.svg`), "utf8");
      expect(svg).not.toMatch(/fill="#000000"|fill-opacity/);
      const height = Number(/viewBox="0 0 \d+ (\d+)"/.exec(svg)?.[1]);
      // há pixel desenhado na última linha (y = altura - 1)
      expect(svg).toContain(` ${height - 1}h`);
    });
  }
});
