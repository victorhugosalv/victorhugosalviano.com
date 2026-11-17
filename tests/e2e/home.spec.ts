import { expect, test } from "@playwright/test";

import { sections } from "../../src/content/sections";

import { gotoWithTheme } from "./helpers";
import { THEMES } from "./pages";

test.describe("página inicial", () => {
  test("as seções seguem a ordem dos dados e nenhum título tem número", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    const ids = await page.locator("section[id]").evaluateAll((els) => els.map((e) => e.id));
    expect(ids).toEqual(sections.map((s) => s.id));
    const headings = await page.locator("h1, h2").allTextContents();
    for (const h of headings) expect(h).not.toMatch(/^\s*\d/);
    await expect(page.locator("h1")).toHaveCount(1);
  });

  test("uma imagem por projeto e foto com texto alternativo", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await expect(
      page.getByRole("img", { name: "Victor sorrindo, de blazer escuro" }),
    ).toBeVisible();
    await expect(page.locator("article")).toHaveCount(3);
    // Todo projeto tem página: um "Ver mais" por cartão.
    const more = page.getByRole("link", { name: /Ver mais/ });
    await expect(more).toHaveCount(3);
    await expect(more.first()).toHaveAttribute("href", "/projetos/rinha-do-campus-iv/");
  });

  for (const theme of THEMES) {
    test(`menu de download pelo teclado (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, "/", theme);
      const toggle = page.getByRole("button", { name: "Baixar o currículo" });
      await toggle.focus();
      await page.keyboard.press("ArrowDown");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      const pdf = page.getByRole("menuitem", { name: "PDF" });
      const md = page.getByRole("menuitem", { name: "Markdown (.md)" });
      await expect(pdf).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(md).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await expect(pdf).toBeFocused();
      await page.keyboard.press("End");
      await expect(md).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
      await expect(toggle).toBeFocused();
    });
  }

  test("o PDF e o .md baixam pelo menu", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    for (const [name, file] of [
      ["PDF", "curriculo-victor-hugo-salviano.pdf"],
      ["Markdown (.md)", "curriculo-victor-hugo-salviano.md"],
    ] as const) {
      await page.getByRole("button", { name: "Baixar o currículo" }).click();
      const download = page.waitForEvent("download");
      await page.getByRole("menuitem", { name }).click();
      expect((await download).suggestedFilename()).toBe(file);
    }
  });

  for (const [where, selector] of [
    ["no início, colado ao chip do e-mail", "#inicio"],
    ["nos contatos", "#contatos"],
  ] as const) {
    test(`copiar e-mail ${where} avisa o leitor de tela`, async ({
      page,
      context,
      browserName,
    }) => {
      test.skip(browserName !== "chromium");
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      await gotoWithTheme(page, "/", "dark");
      const area = page.locator(selector);
      await area.getByRole("button", { name: "Copiar e-mail" }).click();
      await expect(area.getByRole("status")).toHaveText("E-mail copiado");
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        "contato@victorhugosalviano.com",
      );
    });
  }

  test("o chip do e-mail no início continua abrindo o app de e-mail", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await expect(page.locator("#inicio").getByRole("link", { name: "E-mail" })).toHaveAttribute(
      "href",
      "mailto:contato@victorhugosalviano.com",
    );
  });

  test("logos das skills só no desktop", async ({ page, isMobile }) => {
    await gotoWithTheme(page, "/", "dark");
    const logos = page.locator("#skills svg");
    const visible = await logos.evaluateAll(
      (els) => els.filter((e) => e.getBoundingClientRect().width > 0).length,
    );
    expect(visible).toBe(isMobile ? 0 : 21);
  });
});
