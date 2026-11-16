import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";

const BICHEDIN = "/projetos/bichedin/";

test.describe("carrossel de telas", () => {
  test("região com nome, slides com rótulo e botões que trocam a tela", async ({ page }) => {
    await gotoWithTheme(page, BICHEDIN, "dark");
    const carousel = page.getByRole("region", { name: "Telas do BichedIn" });
    await expect(carousel).toHaveAttribute("aria-roledescription", "carrossel");
    const slides = carousel.getByRole("group");
    await expect(slides).toHaveCount(4);
    await expect(slides.nth(1)).toHaveAttribute("aria-label", "2 de 4");
    const counter = carousel.getByText(/^\d \/ 4$/);
    await expect(counter).toHaveText("1 / 4");

    const next = carousel.getByRole("button", { name: "Próxima tela" });
    const previous = carousel.getByRole("button", { name: "Tela anterior" });
    for (const b of [next, previous]) {
      const box = await b.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
    }
    const status = carousel.getByRole("status");
    await expect(status).toHaveText("");
    await next.click();
    await expect(counter).toHaveText("2 / 4");
    await expect(status).toHaveText("2 de 4");
    await expect(slides.nth(1)).toBeInViewport({ ratio: 0.6 });
    await previous.click();
    await expect(counter).toHaveText("1 / 4");
    // Do primeiro, "anterior" dá a volta para o último.
    await previous.click();
    await expect(counter).toHaveText("4 / 4");
    // Só a primeira imagem carrega de cara; as outras esperam (lazy).
    const imgs = carousel.locator("img");
    await expect(imgs.first()).toHaveAttribute("loading", "eager");
    await expect(imgs.nth(1)).toHaveAttribute("loading", "lazy");
    await expect(imgs.nth(2)).toHaveAttribute("alt", /Currículo de um bicho/);
  });

  test("no celular, a trilha não cria rolagem lateral na página", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 700 });
    await gotoWithTheme(page, BICHEDIN, "light");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
