import { expect, test, type Page } from "@playwright/test";

import { gotoWithTheme } from "./helpers";

/** De 640 px para cima, com a página no topo, a navegação não cobre o primeiro conteúdo. */
const WIDTHS = [640, 768, 1024, 1280, 1440] as const;
const MIN_GAP = 32;

/** Fundo dos elementos fixos e visíveis da navegação que ficam na metade de cima da tela. */
async function navBottom(page: Page) {
  return page.evaluate(() => {
    const nav = [...document.querySelectorAll('nav[aria-label="Navegação principal"] *')];
    const bottoms = nav
      .filter((el) => {
        const style = getComputedStyle(el);
        if (style.position !== "fixed" || style.visibility === "hidden") return false;
        if (Number(style.opacity) === 0) return false;
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && r.top < window.innerHeight / 2;
      })
      .map((el) => el.getBoundingClientRect().bottom);
    return bottoms.length ? Math.max(...bottoms) : 0;
  });
}

/** Topo do primeiro conteúdo: o menor topo entre os filhos visíveis do seletor. */
async function contentTop(page: Page, selector: string) {
  return page.evaluate((sel) => {
    const tops = [...document.querySelectorAll(sel)]
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 && r.height > 0)
      .map((r) => r.top);
    return Math.min(...tops);
  }, selector);
}

const CASES = [
  { path: "/", content: "#inicio > *" },
  { path: "/projetos/rinha-do-campus-iv/", content: "#conteudo > * > * > *" },
] as const;

test.describe("respiro entre a navegação e o primeiro conteúdo", () => {
  test.skip(({ isMobile }) => isMobile, "as larguras são definidas no teste");

  for (const { path, content } of CASES) {
    for (const width of WIDTHS) {
      test(`${path} em ${width} px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await gotoWithTheme(page, path, "dark");
        const bottom = await navBottom(page);
        expect(bottom).toBeGreaterThan(0);
        const top = await contentTop(page, content);
        expect(top - bottom).toBeGreaterThanOrEqual(MIN_GAP);
      });
    }
  }
});
