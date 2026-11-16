// Servidor local da pasta out/, parecido com os arquivos estáticos da Cloudflare:
// aplica o public/_headers (copiado para out/_headers), redireciona /pasta para /pasta/,
// responde a página 404.html com status 404 e comprime texto com brotli ou gzip (como a
// Cloudflare faz), para o Lighthouse medir tamanhos reais. Uso: node scripts/serve.mjs [porta]
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { createBrotliCompress, createGzip } from "node:zlib";

const root = resolve("out");
const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);

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

/** Lê o _headers no formato da Cloudflare: linha sem recuo = caminho; com recuo = cabeçalho. */
function readHeaderRules() {
  const file = join(root, "_headers");
  if (!existsSync(file)) return [];
  const rules = [];
  let current = null;
  for (const raw of readFileSync(file, "utf8").split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (/^\s/.test(raw)) {
      const i = raw.indexOf(":");
      if (current && i > 0) current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    } else {
      const pattern = raw
        .trim()
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*");
      current = { re: new RegExp(`^${pattern}$`), headers: [] };
      rules.push(current);
    }
  }
  return rules;
}

const rules = readHeaderRules();

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
}).listen(port, "127.0.0.1", () => {
  console.log(`Servindo out/ em http://localhost:${port}`);
});
