// Copia o currículo (PDF e Markdown) da pasta de origem para public/curriculo/.
// Roda localmente, quando o currículo muda. Com --check, só compara.
// Uso: npx tsx scripts/sync-curriculo.ts [--src ../../curriculo-pdf] [--check]
import { copyFileSync, existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    src: { type: "string", default: "../../curriculo-pdf" },
    check: { type: "boolean", default: false },
  },
});

const files = [
  ["curriculo-victor-hugo-salviano.pdf", "curriculo-victor-hugo-salviano.pdf"],
  ["curriculo.md", "curriculo-victor-hugo-salviano.md"],
] as const;

let stale = 0;
for (const [from, to] of files) {
  const source = join(values.src, from);
  const target = join("public/curriculo", to);
  if (!existsSync(source)) {
    console.error(`não encontrei ${source}`);
    process.exit(1);
  }
  const same = existsSync(target) && readFileSync(source).equals(readFileSync(target));
  if (values.check) {
    if (!same) stale++;
    console.log(`${target}: ${same ? "em dia" : "DESATUALIZADO"}`);
  } else if (!same) {
    copyFileSync(source, target);
    console.log(`${target}: atualizado`);
  } else {
    console.log(`${target}: em dia`);
  }
}
if (stale) process.exit(1);
