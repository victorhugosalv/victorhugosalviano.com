import { expect, test, type Page } from "@playwright/test";

import { PAGES } from "./pages";

/** Junta erros do console e violações de CSP enquanto a página é usada. */
async function watch(page: Page) {
  const problems: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") problems.push(`console: ${msg.text()}`);
  });
  page.on("pageerror", (err) => problems.push(`erro: ${err.message}`));
  await page.addInitScript(() => {
    document.addEventListener("securitypolicyviolation", (e) => {
      console.error(`CSP bloqueou ${e.blockedURI || "inline"} (${e.violatedDirective})`);
    });
  });
  return problems;
}

test.describe("segurança servida com o _headers", () => {
  for (const path of PAGES) {
    test(`cabeçalhos de segurança em ${path}`, async ({ page }) => {
      const res = await page.goto(path);
      const h = res?.headers() ?? {};
      expect(h["content-security-policy"]).toMatch(/script-src 'self' 'sha256-/);
      expect(h["content-security-policy"]).not.toContain("unsafe-inline");
      expect(h["content-security-policy"]).not.toContain("__CSP");
      expect(h["strict-transport-security"]).toContain("max-age=");
      expect(h["x-content-type-options"]).toBe("nosniff");
      expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
      expect(h["permissions-policy"]).toContain("camera=()");
      expect(h["x-frame-options"]).toBe("DENY");
    });

    test(`nenhum erro de CSP ou de console em ${path} (1ª visita, tema e menus)`, async ({
      page,
      isMobile,
    }) => {
      const problems = await watch(page);
      await page.goto(path);
      await page.keyboard.press("Escape"); // pula a abertura
      await page.waitForLoadState("networkidle");
      if (isMobile) {
        await page.getByRole("button", { name: "Abrir menu" }).click();
        await page.getByRole("button", { name: /Modo (claro|escuro)/ }).click();
        await page.keyboard.press("Escape");
      } else {
        await page.getByRole("button", { name: /Mudar para o modo/ }).click();
      }
      if (path === "/") {
        await page.getByRole("button", { name: "Baixar o currículo" }).click();
        await page.keyboard.press("Escape");
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      }
      await page.waitForTimeout(300);
      expect(problems).toEqual([]);
    });
  }

  test("sem cookies nem pedidos para outros domínios", async ({ page, context }) => {
    const external: string[] = [];
    page.on("request", (req) => {
      const url = new URL(req.url());
      if (url.hostname !== "localhost") external.push(req.url());
    });
    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(external).toEqual([]);
    expect(await context.cookies()).toEqual([]);
  });

  test("o PDF e o .md são servidos", async ({ request }) => {
    const pdf = await request.get("/curriculo/curriculo-victor-hugo-salviano.pdf");
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-type"]).toContain("application/pdf");
    expect((await pdf.body()).subarray(0, 4).toString()).toBe("%PDF");
    const md = await request.get("/curriculo/curriculo-victor-hugo-salviano.md");
    expect(md.status()).toBe(200);
    expect(await md.text()).toContain("# Victor Hugo Salviano Trajano da Silva");
  });

  test("robots.txt e sitemap.xml existem", async ({ request }) => {
    expect((await request.get("/robots.txt")).status()).toBe(200);
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/projetos/rinha-do-campus-iv/");
  });
});
