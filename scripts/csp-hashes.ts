// Depois do `next build`: calcula o SHA-256 de cada <script> inline das páginas em out/
// e escreve os hashes na CSP de out/_headers (no lugar de __CSP_SCRIPT_HASHES__).
// Falha se o marcador não existir, para nunca publicar uma CSP sem os hashes.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const HEADERS = join(OUT, "_headers");
const MARKER = "__CSP_SCRIPT_HASHES__";

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return htmlFiles(path);
    return name.endsWith(".html") ? [path] : [];
  });
}

const hashes = new Set<string>();
for (const file of htmlFiles(OUT)) {
  const html = readFileSync(file, "utf8");
  // <script> sem src: o conteúdo exato entre as tags é o que o navegador confere.
  for (const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    const body = match[1] ?? "";
    if (!body) continue;
    hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
}

const headers = readFileSync(HEADERS, "utf8");
if (headers.split(MARKER).length !== 2) {
  console.error(
    `${HEADERS} precisa ter ${MARKER} uma vez: rode o build de novo (o modelo é public/_headers).`,
  );
  process.exit(1);
}
writeFileSync(HEADERS, headers.replace(MARKER, [...hashes].sort().join(" ")));
console.log(`CSP: ${hashes.size} hashes de scripts inline em ${HEADERS}`);
