// Confere as regras do ESTRUTURA.md §3 que o lint não cobre.
// Sai com código 1 e lista as violações, se houver.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = "src";

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const files = walk(SRC).map((p) => ({ path: relative(".", p), text: readFileSync(p, "utf8") }));
const problems = [];
const report = (file, msg) => problems.push(`${file}: ${msg}`);

const layerOf = (p) => {
  const m = p.match(
    /^src\/(?:components\/)?(app|content|hooks|lib|styles|ui|layout|sections|project|loader)\//,
  );
  return m ? m[1] : "outro";
};

// Quem pode importar quem (camadas com uma direção só).
const forbidden = {
  content: ["components", "hooks", "app"],
  hooks: ["components", "content", "app"],
  lib: ["components", "app", "hooks"],
  ui: [
    "content",
    "app",
    "components/layout",
    "components/sections",
    "components/project",
    "components/loader",
  ],
  layout: ["app", "components/sections", "components/project"],
  sections: ["app", "components/project", "components/layout"],
  project: ["app", "components/sections", "components/layout"],
  loader: ["app", "components/sections", "components/project", "components/layout"],
};

for (const { path, text } of files) {
  const layer = layerOf(path);
  const isCode = /\.(tsx?|mjs)$/.test(path);
  const isCss = path.endsWith(".css");

  if ((isCss || isCode) && /!important/.test(text)) report(path, "usa !important");

  if (isCode) {
    if (/\sstyle=\{/.test(text)) report(path, "usa style= inline");

    for (const m of text.matchAll(/from\s+["']@\/([^"']+)["']/g)) {
      const target = m[1];
      for (const bad of forbidden[layer] ?? []) {
        if (target === bad || target.startsWith(`${bad}/`)) {
          report(path, `camada "${layer}" não pode importar "@/${target}"`);
        }
      }
    }
  }

  if (layer === "ui" && path.endsWith(".tsx")) {
    if (/\bclassName\??\s*:/.test(text)) report(path, "componente de ui aceita className");
  }

  // Texto fixo: só em content/. Em componentes e rotas, nada de texto entre tags
  // nem atributos de texto com valor literal.
  if (path.endsWith(".tsx") && layer !== "content") {
    const noComments = text.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\/.*$/gm, "");
    // Texto entre uma tag JSX e a próxima (<p>Olá</p>), sem pegar "a > b && c < d".
    for (const m of noComments.matchAll(
      /<\/?[A-Za-z][\w.]*(?:\s[^<>]*)?>([^<>{}]+)(?=<\/?[A-Za-z])/g,
    )) {
      const t = (m[1] ?? "").trim();
      if (/\p{L}{2,}/u.test(t)) report(path, `texto fixo "${t.slice(0, 40)}"`);
    }
    // Texto literal como filho: <p>{"Olá"}</p>
    for (const m of noComments.matchAll(/>\s*\{\s*(["'`])([^"'`]*\p{L}{2,}[^"'`]*)\1\s*\}/gu)) {
      report(path, `texto fixo "${(m[2] ?? "").slice(0, 40)}"`);
    }
    for (const m of noComments.matchAll(/\b(aria-label|alt|title|placeholder)="([^"]+)"/g)) {
      report(path, `${m[1]} com texto fixo "${m[2]}"`);
    }
  }
}

if (problems.length) {
  console.error(
    `Regras do ESTRUTURA.md §3: ${problems.length} problema(s)\n- ${problems.join("\n- ")}`,
  );
  process.exit(1);
}
console.log(`Regras do ESTRUTURA.md §3: ok (${files.length} arquivos)`);
