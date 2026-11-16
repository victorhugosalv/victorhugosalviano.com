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

  test("Contato fica no canto da janela, com 56 px, e aparece desde o começo sem hero", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/projetos/rinha-do-campus-iv/", "dark");
    const contact = page.getByRole("link", { name: "Ir para os contatos" });
    await expect(contact).toBeVisible();
    const viewport = page.viewportSize();
    const b = await contact.boundingBox();
    if (!viewport || !b) throw new Error("sem medidas");
    expect(Math.round(b.width)).toBe(56);
    expect(Math.round(viewport.width - (b.x + b.width))).toBe(32);
    expect(Math.round(viewport.height - (b.y + b.height))).toBe(32);
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

  test("Menu fica sempre em cima à direita; Início aparece embaixo à direita depois do hero", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/", "dark");
    const home = page.getByRole("link", { name: "Voltar ao início", includeHidden: true });
    const viewport = page.viewportSize();
    if (!viewport) throw new Error("sem viewport");
    const atTopRight = async () => {
      const b = await menuButton(page).boundingBox();
      expect(b).not.toBeNull();
      if (!b) return;
      expect(b.y).toBeLessThan(40);
      expect(viewport.width - (b.x + b.width)).toBeLessThanOrEqual(24);
    };
    await atTopRight();
    await expect(home).toBeHidden();
    // Escondido, Início não recebe foco: do link de pular o Tab vai direto ao Menu.
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await expect(page.locator(":focus")).toHaveAccessibleName("Abrir menu");
    await scrollToId(page, "skills");
    await expect(home).toBeVisible();
    await atTopRight();
    const b = await home.boundingBox();
    expect(b).not.toBeNull();
    if (!b) return;
    expect(b.x).toBeGreaterThan(viewport.width / 2);
    expect(viewport.width - (b.x + b.width)).toBeLessThanOrEqual(24);
    expect(b.y).toBeGreaterThan(viewport.height - 100);
    expect(b.y + b.height).toBeLessThanOrEqual(viewport.height);
    await scrollToId(page, "inicio");
    await expect(home).toBeHidden();
  });

  test("nas páginas sem hero, Início aparece desde o começo", async ({ page }) => {
    await gotoWithTheme(page, "/projetos/rinha-do-campus-iv/", "dark");
    await expect(page.getByRole("link", { name: "Voltar ao início" })).toBeVisible();
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
    // O menu abre logo abaixo do botão, que continua em cima.
    const toggleBox = await menuButton(page).boundingBox();
    const navBox = await nav.boundingBox();
    expect(navBox?.y).toBeGreaterThanOrEqual((toggleBox?.y ?? 0) + (toggleBox?.height ?? 0));
    expect(navBox?.y).toBeLessThan(100);
    await nav.getByRole("button", { name: "Modo claro" }).click();
    await expect(html(page)).toHaveAttribute("data-theme", "light");
    await nav.getByRole("link", { name: "Sobre" }).click();
    await expect(nav).toBeHidden();
    await expect(page).toHaveURL(/#sobre$/);
  });

  test("Projetos: a seta abre a lista pelo teclado e o foco continua preso no menu", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/", "dark");
    const toggle = menuButton(page);
    await toggle.focus();
    await page.keyboard.press("Enter");
    const panel = page.locator(`[id="${await toggle.getAttribute("aria-controls")}"]`);
    const arrow = panel.getByRole("button", { name: "Mostrar projetos" });
    // Início → Skills → Projetos → seta
    for (let i = 0; i < 3; i++) await page.keyboard.press("Tab");
    await expect(arrow).toBeFocused();
    await expect(arrow).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    const hide = panel.getByRole("button", { name: "Esconder projetos" });
    await expect(hide).toHaveAttribute("aria-expanded", "true");
    const sublist = page.locator(`[id="${await hide.getAttribute("aria-controls")}"]`);
    await expect(sublist.getByRole("link")).toHaveCount(4);
    await expect(sublist.getByRole("link").last()).toHaveAccessibleName(/Ver todos os projetos/);
    await page.keyboard.press("Tab");
    await expect(sublist.getByRole("link").first()).toBeFocused();
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press("Tab");
      const inside = await page.evaluate(
        (id) =>
          !!document.getElementById(id ?? "")?.contains(document.activeElement) ||
          document.activeElement?.getAttribute("aria-controls") === id,
        await toggle.getAttribute("aria-controls"),
      );
      expect(inside).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(panel).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test("na página de um projeto, a lista já abre com o projeto atual marcado", async ({ page }) => {
    await gotoWithTheme(page, "/projetos/rinha-do-campus-iv/", "dark");
    await menuButton(page).click();
    const hide = page.getByRole("button", { name: "Esconder projetos" });
    await expect(hide).toHaveAttribute("aria-expanded", "true");
    const sublist = page.locator(`[id="${await hide.getAttribute("aria-controls")}"]`);
    await expect(sublist.getByRole("link", { name: "Rinha do Campus IV" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(page.getByRole("link", { name: "Projetos", exact: true })).toHaveAttribute(
      "aria-current",
      "true",
    );
  });

  test("toque fora fecha o menu", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await menuButton(page).click();
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "true");
    await page.mouse.click(200, 800);
    await expect(menuButton(page)).toHaveAttribute("aria-expanded", "false");
  });
});
