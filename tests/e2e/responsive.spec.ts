import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { PAGES, THEMES, WIDTHS } from "./pages";

// Roda uma vez só (no projeto "desktop"); a largura é trocada aqui dentro.
test.describe("responsividade", () => {
  test.skip(({ isMobile }) => isMobile, "as larguras são definidas no próprio teste");

  for (const path of PAGES) {
    for (const theme of THEMES) {
      test(`sem rolagem horizontal em ${path} (${theme})`, async ({ page }) => {
        for (const width of WIDTHS) {
          await page.setViewportSize({ width, height: 900 });
          await gotoWithTheme(page, path, theme);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          expect(overflow, `${width}px`).toBeLessThanOrEqual(0);
        }
      });
    }
  }
});
