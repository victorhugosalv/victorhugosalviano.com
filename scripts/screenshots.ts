// Tira prints de página inteira em várias larguras e nos dois temas e monta uma galeria.
// Uso: npx tsx scripts/screenshots.ts --out <pasta> [--paths /,/projetos/x/] [--widths 320,1440]
// Precisa do build pronto em out/. Sobe o servidor local sozinho.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

import { chromium } from "@playwright/test";

import { STORAGE_KEYS } from "../src/lib/storage";

const { values } = parseArgs({
  options: {
    out: { type: "string", default: "screenshots" },
    paths: { type: "string", default: "/" },
    widths: { type: "string", default: "320,360,390,768,1024,1280,1440,1920" },
    title: { type: "string", default: "Prints" },
  },
});

const PORT = 4174;
const out = values.out;
const paths = values.paths.split(",");
const widths = values.widths.split(",").map(Number);
const themes = ["dark", "light"] as const;

mkdirSync(out, { recursive: true });
const server = spawn("node", ["scripts/serve.mjs", String(PORT)], { stdio: "ignore" });
for (let i = 0; ; i++) {
  try {
    await fetch(`http://localhost:${PORT}/`);
    break;
  } catch (error) {
    if (i > 50) throw error;
    await new Promise((r) => setTimeout(r, 100));
  }
}

const browser = await chromium.launch();
const shots: { file: string; path: string; theme: string; width: number }[] = [];
try {
  for (const path of paths) {
    for (const theme of themes) {
      for (const width of widths) {
        const isMobile = width < 1024;
        const context = await browser.newContext({
          viewport: { width, height: isMobile ? 844 : 900 },
          deviceScaleFactor: 1,
          isMobile,
          hasTouch: isMobile,
          reducedMotion: "reduce",
        });
        await context.addInitScript(
          ({ keys, t }) => {
            localStorage.setItem(keys.theme, t);
            localStorage.setItem(keys.introSeen, "1");
          },
          { keys: STORAGE_KEYS, t: theme },
        );
        const page = await context.newPage();
        await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        const slug = path === "/" ? "inicio" : path.replace(/^\/|\/$/g, "").replaceAll("/", "-");
        const file = `${slug}-${theme}-${width}.png`;
        await page.screenshot({ path: join(out, file), fullPage: true });
        shots.push({ file, path, theme, width });
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  server.kill();
}

const rows = paths
  .flatMap((path) =>
    themes.map((theme) => {
      const items = shots
        .filter((s) => s.path === path && s.theme === theme)
        .map(
          (s) =>
            `<figure><a href="${s.file}"><img src="${s.file}" loading="lazy" alt="${path} ${theme} ${s.width}px"></a><figcaption>${s.width}px</figcaption></figure>`,
        )
        .join("");
      return `<h2>${path} · ${theme === "dark" ? "escuro" : "claro"}</h2><div class="row">${items}</div>`;
    }),
  )
  .join("");

writeFileSync(
  join(out, "index.html"),
  `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>${values.title}</title>
<style>body{font:14px system-ui;background:#222;color:#eee;margin:16px}.row{display:flex;gap:16px;overflow-x:auto;align-items:flex-start;padding-bottom:16px}
figure{margin:0;flex:none}img{width:240px;height:auto;border:1px solid #444;background:#000}figcaption{text-align:center;margin-top:4px}a{color:#9cf}</style>
<h1>${values.title}</h1><p>Clique num print para ver no tamanho real.</p>${rows}</html>`,
);
console.log(`${shots.length} prints em ${out}`);
