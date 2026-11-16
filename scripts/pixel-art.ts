// Gera os SVGs do NSX em pixel art (public/images/nsx-<quadro>.svg) a partir da grade de
// pixels em design/pixel-art/nsx.json (fora do repositório público).
// Uso: npx tsx scripts/pixel-art.ts [--src ../design]
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({ options: { src: { type: "string", default: "../design" } } });

interface PixelArt {
  palette: Record<string, string>;
  frames: Record<string, string[]>;
}

const art = JSON.parse(readFileSync(join(values.src, "pixel-art/nsx.json"), "utf8")) as PixelArt;

/** Junta pixels vizinhos da mesma cor numa linha, um <path> por cor. */
function toSvg(rows: string[]): string {
  const paths = new Map<string, string[]>();
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x] ?? ".";
      let n = 1;
      while (row[x + n] === c) n++;
      if (c !== ".") paths.set(c, [...(paths.get(c) ?? []), `M${x} ${y}h${n}v1h-${n}z`]);
      x += n;
    }
  });
  const w = rows[0]?.length ?? 0;
  const h = rows.length;
  const body = [...paths]
    .map(([c, d]) => {
      const opacity = c === "S" ? ' fill-opacity=".35"' : "";
      return `<path fill="${art.palette[c]}"${opacity} d="${d.join("")}"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" shape-rendering="crispEdges">${body}</svg>\n`;
}

for (const [name, rows] of Object.entries(art.frames)) {
  const file = `public/images/nsx-${name}.svg`;
  writeFileSync(file, toSvg(rows));
  console.log(file);
}
