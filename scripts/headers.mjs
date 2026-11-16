// Lê o _headers no formato da Cloudflare e adapta os cabeçalhos para o teste na rede local.

/** Linha sem recuo = caminho (com * como curinga); linha com recuo = "Nome: valor". */
export function parseHeaderRules(text) {
  const rules = [];
  let current = null;
  for (const raw of text.split("\n")) {
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

/**
 * No celular, o site é aberto por http://IP:porta. Sem HTTPS, o HSTS e o
 * upgrade-insecure-requests da CSP fariam o navegador pedir https:// e nada carregaria.
 * Só para o preview:lan; o _headers publicado não muda.
 */
export function forLan(headers) {
  return headers
    .filter(([name]) => name.toLowerCase() !== "strict-transport-security")
    .map(([name, value]) =>
      name.toLowerCase() === "content-security-policy"
        ? [
            name,
            value
              .split(";")
              .map((d) => d.trim())
              .filter((d) => d && d !== "upgrade-insecure-requests")
              .join("; "),
          ]
        : [name, value],
    );
}
