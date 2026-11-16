// Servidor local da pasta out/, parecido com os arquivos estáticos da Cloudflare:
// aplica o public/_headers (copiado para out/_headers), redireciona /pasta para /pasta/,
// responde a página 404.html com status 404 e comprime texto com brotli ou gzip (como a
// Cloudflare faz), para o Lighthouse medir tamanhos reais.
// Uso: node scripts/serve.mjs [porta] [--lan]
// Com --lan, escuta em todas as interfaces (para abrir no celular, na mesma rede Wi-Fi) e
// tira o HSTS e o upgrade-insecure-requests, que exigiriam HTTPS.
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { extname, join, normalize, resolve, sep } from "node:path";
import { createBrotliCompress, createGzip } from "node:zlib";

import { forLan, parseHeaderRules } from "./headers.mjs";

const args = process.argv.slice(2);
const lan = args.includes("--lan");
const root = resolve("out");
const port = Number(args.find((a) => /^\d+$/.test(a)) ?? process.env.PORT ?? 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".pdf": "application/pdf",
};

const headersFile = join(root, "_headers");
const rules = existsSync(headersFile)
  ? parseHeaderRules(readFileSync(headersFile, "utf8")).map((rule) =>
      lan ? { ...rule, headers: forLan(rule.headers) } : rule,
    )
  : [];

const compressible = /^(text\/|application\/(json|xml)|image\/svg)/;

function send(req, res, status, file, pathname) {
  for (const rule of rules) {
    if (rule.re.test(pathname)) for (const [k, v] of rule.headers) res.setHeader(k, v);
  }
  if (!existsSync(file)) {
    res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" }).end("404");
    return;
  }
  const type = types[extname(file)] ?? "application/octet-stream";
  const accept = String(req.headers["accept-encoding"] ?? "");
  const encoding = !compressible.test(type)
    ? null
    : accept.includes("br")
      ? "br"
      : accept.includes("gzip")
        ? "gzip"
        : null;
  res.writeHead(status, {
    "Content-Type": type,
    Vary: "Accept-Encoding",
    ...(encoding ? { "Content-Encoding": encoding } : {}),
  });
  const stream = createReadStream(file).on("error", () => res.destroy());
  if (encoding === "br") stream.pipe(createBrotliCompress()).pipe(res);
  else if (encoding === "gzip") stream.pipe(createGzip()).pipe(res);
  else stream.pipe(res);
}

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    res.writeHead(400).end();
    return;
  }
  const target = normalize(join(root, pathname));
  if (target !== root && !target.startsWith(root + sep)) {
    res.writeHead(403).end();
    return;
  }
  const isDir = existsSync(target) && statSync(target).isDirectory();
  if (isDir && !pathname.endsWith("/")) {
    res.writeHead(307, { Location: `${pathname}/${url.search}` }).end();
    return;
  }
  const file = isDir ? join(target, "index.html") : target;
  if (existsSync(file) && statSync(file).isFile() && !file.endsWith("_headers")) {
    send(req, res, 200, file, pathname);
    return;
  }
  send(req, res, 404, join(root, "404.html"), pathname);
}).listen(port, lan ? "0.0.0.0" : "127.0.0.1", () => {
  console.log(`Servindo out/ em http://localhost:${port}`);
  if (!lan) return;
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === "IPv4" && !i.internal)
    .map((i) => `http://${i.address}:${port}`);
  console.log(`Na rede local (sem HTTPS, só para teste): ${ips.join(" · ") || "sem IP de rede"}`);
  console.log("Feche com Ctrl+C quando terminar.");
});
