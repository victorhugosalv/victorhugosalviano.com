import { expect, test, type Page } from "@playwright/test";

const BG = { dark: "rgb(14, 14, 16)", light: "rgb(243, 239, 230)" } as const;

async function bodyBackground(page: Page) {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test.describe("tema na página", () => {
  for (const scheme of ["dark", "light"] as const) {
    test(`segue o sistema (${scheme}) quando não há escolha salva`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto("/");
      await expect(page.locator("html")).toHaveAttribute("data-theme", scheme);
      expect(await bodyBackground(page)).toBe(BG[scheme]);
    });
  }

  test("não pisca: o tema salvo vale antes de qualquer JavaScript do Next", async ({ page }) => {
    // Bloqueia os bundles do Next: só o script inline do <head> roda.
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto("/");
    expect(await bodyBackground(page)).toBe(BG.light);
    await page.reload();
    expect(await bodyBackground(page)).toBe(BG.light);
  });

  test("sem JavaScript, o CSS segue o sistema", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: "light" });
    const page = await context.newPage();
    await page.goto("/");
    expect(await bodyBackground(page)).toBe(BG.light);
    await context.close();
  });
});
