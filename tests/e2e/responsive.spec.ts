import { expect, test, type Page } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { PAGES, THEMES, WIDTHS } from "./pages";

const horizontalOverflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);

/** Textos (e links) cuja borda passa da tela ou que estão cortados por overflow. */
const clippedText = (page: Page) =>
  page.evaluate(() => {
    const out: string[] = [];
    const width = document.documentElement.clientWidth;
    for (const el of document.querySelectorAll<HTMLElement>("h1, h2, h3, p, li, a, button, time")) {
      const box = el.getBoundingClientRect();
      if (box.width === 0 || getComputedStyle(el).visibility === "hidden") continue;
      if (box.right > width + 1 || box.left < -1)
        out.push(`fora da tela: ${el.textContent?.trim().slice(0, 30)}`);
      const style = getComputedStyle(el);
      const clips =
        ["hidden", "clip"].includes(style.overflowX) ||
        ["hidden", "clip"].includes(style.overflowY);
      if (clips && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1)) {
        if (!el.matches("[class*=srOnly]"))
          out.push(`cortado: ${el.textContent?.trim().slice(0, 30)}`);
      }
    }
    return out;
  });

// Estes testes trocam a largura por conta própria; rodam só no projeto "desktop".
test.describe("responsividade", () => {
  test.skip(({ isMobile }) => isMobile, "as larguras são definidas no próprio teste");

  for (const path of PAGES) {
    for (const theme of THEMES) {
      test(`sem rolagem horizontal nem texto cortado em ${path} (${theme})`, async ({ page }) => {
        for (const width of WIDTHS) {
          await page.setViewportSize({ width, height: 900 });
          await gotoWithTheme(page, path, theme);
          expect(await horizontalOverflow(page), `${width}px`).toBeLessThanOrEqual(0);
          expect(await clippedText(page), `${width}px`).toEqual([]);
        }
      });
    }

    test(`navegação certa em cada largura em ${path}`, async ({ page }) => {
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithTheme(page, path, "dark");
        const isDesktop = width >= 1024;
        const menu = page.getByRole("button", { name: "Abrir menu" });
        const home = page.getByRole("link", { name: "Voltar ao início" });
        const pillLogo = page.getByRole("link", { name: "VHS, Victor Hugo Salviano: início" });
        const theme = page.getByRole("button", { name: "Mudar para o modo claro" });
        await expect(menu, `${width}px`).toBeVisible({ visible: !isDesktop });
        await expect(home, `${width}px`).toBeVisible({ visible: !isDesktop });
        await expect(pillLogo, `${width}px`).toBeVisible({ visible: isDesktop });
        await expect(theme, `${width}px`).toBeVisible({ visible: isDesktop });
        // Botões flutuantes dentro da tela.
        for (const el of isDesktop ? [theme] : [menu, home]) {
          const box = await el.boundingBox();
          expect(box && box.x >= 0 && box.x + box.width <= width, `${width}px`).toBe(true);
        }
      }
    });

    test(`zoom de 200% (1280 px → 640 px) sem corte em ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 450 });
      await gotoWithTheme(page, path, "dark");
      expect(await horizontalOverflow(page)).toBeLessThanOrEqual(0);
      expect(await clippedText(page)).toEqual([]);
    });

    test(`espaçamento de texto do WCAG 1.4.12 em ${path}`, async ({ page }) => {
      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithTheme(page, path, "light");
        await page.addStyleTag({
          content: `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
                    p { margin-bottom: 2em !important; }`,
        });
        expect(await horizontalOverflow(page), `${width}px`).toBeLessThanOrEqual(0);
        expect(await clippedText(page), `${width}px`).toEqual([]);
      }
    });
  }
});

test.describe("área de toque no celular", () => {
  test.skip(({ isMobile }) => !isMobile, "só celular");

  for (const path of PAGES) {
    test(`botões e chips com pelo menos 44 px em ${path}`, async ({ page }) => {
      await gotoWithTheme(page, path, "dark");
      const small = await page.evaluate(() => {
        const out: string[] = [];
        const controls = document.querySelectorAll<HTMLElement>("button, a[class]");
        for (const el of controls) {
          const box = el.getBoundingClientRect();
          if (box.width === 0) continue;
          if (el.closest("p")) continue; // link dentro de texto: exceção do WCAG 2.5.8
          // Pseudo-elemento ::after que aumenta a área de toque (chips de 36 px).
          const after = getComputedStyle(el, "::after");
          const extra =
            after.position === "absolute" ? -2 * Math.min(0, parseFloat(after.top) || 0) : 0;
          if (box.height + extra < 44 || box.width < 24) {
            out.push(`${el.textContent?.trim() || el.getAttribute("aria-label")}: ${box.height}`);
          }
        }
        return out;
      });
      expect(small).toEqual([]);
    });
  }
});

test.describe("movimento reduzido", () => {
  for (const path of PAGES) {
    test(`nada se mexe em ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await gotoWithTheme(page, path, "dark");
      await page.waitForTimeout(300);
      const running = await page.evaluate(
        () =>
          document
            .getAnimations()
            .filter(
              (a) => a.playState === "running" && Number(a.effect?.getTiming().duration ?? 0) > 1,
            ).length,
      );
      expect(running).toBe(0);
    });
  }
});
