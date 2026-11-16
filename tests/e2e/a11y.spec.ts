import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { PAGES, THEMES } from "./pages";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"];

for (const path of PAGES) {
  for (const theme of THEMES) {
    test(`axe sem violações em ${path} (${theme})`, async ({ page }) => {
      await gotoWithTheme(page, path, theme);
      const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(result.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
    });
  }

  test(`axe sem violações em ${path} com movimento reduzido`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await gotoWithTheme(page, path, "dark");
    const result = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
  });
}
