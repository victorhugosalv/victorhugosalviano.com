import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const overlay = "[data-intro-overlay]";

test.describe("abertura do NSX (1ª visita)", () => {
  test("aparece só na primeira visita e some sozinha em ~2,7 s", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-intro", "");
    await expect(page.locator(overlay)).toBeVisible();
    await expect(page.locator(overlay)).toBeHidden({ timeout: 4000 });
    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await page.reload();
    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await expect(page.locator(overlay)).toBeHidden();
  });

  test("qualquer tecla pula", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(overlay)).toBeVisible();
    await page.keyboard.press("Shift");
    await expect(page.locator(overlay)).toBeHidden({ timeout: 500 });
  });

  test("toque ou clique pula", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(overlay)).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.locator(overlay)).toBeHidden({ timeout: 500 });
  });

  test("não prende o foco nem aparece para o leitor de tela", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(overlay)).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator(`${overlay} :is(a, button, [tabindex])`)).toHaveCount(0);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
    // O primeiro Tab pula a abertura e já cai no link de pular.
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Pular para o conteúdo" })).toBeFocused();
  });

  test("com movimento reduzido, não aparece", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).not.toHaveAttribute("data-intro");
    await expect(page.locator(overlay)).toBeHidden();
    await context.close();
  });

  test("sem o JavaScript do Next, ainda termina sozinha", async ({ page }) => {
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto("/");
    await expect(page.locator(overlay)).toBeVisible();
    await expect(page.locator(overlay)).toBeHidden({ timeout: 4000 });
  });
});

test.describe("NSX no Sobre", () => {
  test("só no desktop, decorativo, e parado com movimento reduzido", async ({ page, isMobile }) => {
    await page.addInitScript(() => localStorage.setItem("intro-seen", "1"));
    await page.goto("/");
    const car = page.locator("#sobre img[src*='nsx']");
    if (isMobile) {
      await expect(car).toBeHidden();
      return;
    }
    await expect(car).toBeVisible();
    await expect(car).toHaveAttribute("alt", "");
    const moving = await car.evaluate((el) => el.getAnimations().length);
    expect(moving).toBeGreaterThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => car.evaluate((el) => el.getAnimations().length)).toBe(0);
  });
});
