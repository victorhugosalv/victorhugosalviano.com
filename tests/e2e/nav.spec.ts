import { expect, test, type Page } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { THEMES } from "./pages";

const html = (page: Page) => page.locator("html");

async function scrollToId(page: Page, id: string) {
  await page.evaluate((target) => {
    document.getElementById(target)?.scrollIntoView({ block: "start", behavior: "instant" });
  }, id);
}

test.describe("navegação no desktop", () => {
  test.skip(({ isMobile }) => isMobile, "só desktop");

  for (const theme of THEMES) {
    test(`Tab percorre o link de pular, a pílula e o tema (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, "/", theme);
      const expected = [
        "Pular para o conteúdo",
        "Skills",
        "Projetos",
        "VHS, Victor Hugo Salviano: início",
        "Sobre",
        "Trajetória",
        theme === "dark" ? "Mudar para o modo claro" : "Mudar para o modo escuro",
      ];
      for (const name of expected) {
        await page.keyboard.press("Tab");
        const focused = page.locator(":focus");
        await expect(focused).toHaveAccessibleName(name);
        await expect(focused).toBeVisible();
      }
    });
  }

  test("o tema troca pelo teclado e continua depois de recarregar", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Mudar para o modo claro" });
    await toggle.focus();
    await page.keyboard.press("Enter");
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await expect(page.getByRole("button", { name: "Mudar para o modo escuro" })).toBeFocused();
    await page.reload();
    await expect(html(page)).toHaveAttribute("data-theme", "light");
  });

  test("Contato aparece depois do hero e some na seção Contatos", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    const contact = page.getByRole("link", { name: "Ir para os contatos" });
    await expect(contact).toBeHidden();
    await scrollToId(page, "skills");
    await expect(contact).toBeVisible();
    await scrollToId(page, "contatos");
    await expect(contact).toBeHidden();
  });

  test("o link ativo acompanha a rolagem", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    const nav = page.getByRole("navigation", { name: "Navegação principal" }).first();
    for (const [id, name] of [
      ["skills", "Skills"],
      ["sobre", "Sobre"],
      ["projetos", "Projetos"],
    ] as const) {
      await scrollToId(page, id);
      await expect(nav.getByRole("link", { name, exact: true })).toHaveAttribute(
        "aria-current",
        "true",
      );
    }
  });
});

test.describe("navegação no celular", () => {
  test.skip(({ isMobile }) => !isMobile, "só celular");

  const menuButton = (page: Page) => page.getByRole("button", { name: /menu/i });

  test("Início e Menu ficam em cima no topo e descem para baixo depois do hero", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/", "dark");
    const home = page.getByRole("link", { name: "Voltar ao início" });
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("sem viewport");
    let box = await menuButton(page).boundingBox();
    expect(box?.y).toBeLessThan(40);
    await scrollToId(page, "skills");
    await expect
      .poll(async () => (await menuButton(page).boundingBox())?.y ?? 0)
      .toBeGreaterThan(viewport.height - 100);
    box = await menuButton(page).boundingBox();
    const homeBox = await home.boundingBox();
    for (const b of [box, homeBox]) {
      expect(b).not.toBeNull();
      if (!b) continue;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(viewport.width);
      expect(b.y + b.height).toBeLessThanOrEqual(viewport.height);
    }
  });

  for (const theme of THEMES) {
    test(`☰ abre pelo teclado, prende o foco, Esc fecha e devolve o foco (${theme})`, async ({
      page,
    }) => {
      await gotoWithTheme(page, "/", theme);
      const toggle = menuButton(page);
      await toggle.focus();
      await page.keyboard.press("Enter");
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
      await expect(toggle).toHaveAccessibleName("Fechar menu");
      const panelId = await toggle.getAttribute("aria-controls");
      const nav = page.locator(`[id="${panelId}"]`);
      await expect(nav).toBeVisible();
      await expect(nav.getByRole("link", { name: "Início" })).toBeFocused();
      // 6 links + tema + botão de fechar: o Tab dá a volta e não sai do menu.
      for (let i = 0; i < 9; i++) {
        await page.keyboard.press("Tab");
        const inside = await page.evaluate((id) => {
          const el = document.activeElement;
          return (
            !!el &&
            (!!document.getElementById(id ?? "")?.contains(el) ||
              el.getAttribute("aria-controls") === id)
          );
        }, panelId);
        expect(inside).toBe(true);
      }
      await page.keyboard.press("Escape");
      await expect(nav).toBeHidden();
      await expect(toggle).toBeFocused();
      await expect(toggle).toHaveAttribute("aria-expanded", "false");
    });
  }

  test("o menu desce do topo, troca o tema e fecha ao escolher um link", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await scrollToId(page, "skills");
    await menuButton(page).click();
    const nav = page.locator(`[id="${await menuButton(page).getAttribute("aria-controls")}"]`);
    await expect(nav).toBeVisible();
    expect((await nav.boundingBox())?.y).toBeLessThan(40);
    await nav.getByRole("button", { name: "Modo claro" }).click();
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await nav.getByRole("link", { name: "Sobre" }).click();
    await expect(nav).toBeHidden();
    await expect(page).toHaveURL(/#sobre$/);
  });

  test("toque fora fecha o menu", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await menuButton(page).click();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
    await page.mouse.click(200, 800);
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });
});
