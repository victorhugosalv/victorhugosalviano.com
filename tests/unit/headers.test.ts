import { describe, expect, it } from "vitest";

import { forLan, parseHeaderRules } from "../../scripts/headers.mjs";

const SAMPLE = `/*
  Content-Security-Policy: default-src 'self'; upgrade-insecure-requests; object-src 'none'
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
/_next/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

describe("cabeçalhos do servidor local", () => {
  it("lê as regras do _headers no formato da Cloudflare", () => {
    const rules = parseHeaderRules(SAMPLE);
    expect(rules).toHaveLength(2);
    expect(rules[0]?.re.test("/projetos/x/")).toBe(true);
    expect(rules[1]?.re.test("/_next/static/a.js")).toBe(true);
    expect(rules[1]?.re.test("/images/a.png")).toBe(false);
  });

  it("no preview:lan, tira o HSTS e o upgrade-insecure-requests e mantém o resto", () => {
    const headers = parseHeaderRules(SAMPLE)[0]?.headers ?? [];
    const lan = Object.fromEntries(forLan(headers));
    expect(lan).not.toHaveProperty("Strict-Transport-Security");
    expect(lan["Content-Security-Policy"]).toBe("default-src 'self'; object-src 'none'");
    expect(lan["X-Content-Type-Options"]).toBe("nosniff");
  });
});
