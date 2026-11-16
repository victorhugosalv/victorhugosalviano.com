import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { THEMES } from "./pages";

const RINHA = "/projetos/rinha-do-campus-iv/";

test.describe("página da Rinha", () => {
  test("só a Rinha tem página; outro slug dá 404", async ({ page }) => {
    const ok = await page.goto(RINHA);
    expect(ok?.status()).toBe(200);
    for (const slug of ["docenda", "bichedin", "qualquer-coisa"]) {
      const res = await page.goto(`/projetos/${slug}/`);
      expect(res?.status(), slug).toBe(404);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText("Página não encontrada");
      await expect(page.getByRole("link", { name: "Voltar ao início" }).first()).toBeVisible();
    }
  });

  for (const theme of THEMES) {
    test(`"Projetos" marcado na navegação (${theme})`, async ({ page, isMobile }) => {
      await gotoWithTheme(page, RINHA, theme);
      if (isMobile) {
        await page.getByRole("button", { name: "Abrir menu" }).click();
        const nav = page.getByRole("navigation", { name: "Navegação principal" }).last();
        await expect(nav.getByRole("link", { name: "Projetos", exact: true })).toHaveAttribute(
          "aria-current",
          "true",
        );
      } else {
        const nav = page.getByRole("navigation", { name: "Navegação principal" }).first();
        await expect(nav.getByRole("link", { name: "Projetos", exact: true })).toHaveAttribute(
          "aria-current",
          "true",
        );
      }
    });
  }

  test("cabeçalho, stack, repositórios e próximo projeto", async ({ page }) => {
    await gotoWithTheme(page, RINHA, "dark");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rinha do Campus IV");
    await expect(page.getByRole("img", { name: /League of Legends/ })).toBeVisible();
    for (const h of ["Stack", "Repositórios", "Como funciona", "Linha do tempo", "Minha parte"]) {
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
    const repo = page.getByRole("link", { name: /gbrlmzl\/api-rinha-v2.*nova aba/ });
    await expect(repo).toHaveAttribute("target", "_blank");
    await expect(repo).toHaveAttribute("rel", /noopener/);
    const next = page.getByRole("link", { name: /Próximo projeto/ });
    await expect(next).toHaveAttribute("href", "/#docenda");
    await expect(page.locator("time[datetime='2026-04']").first()).toBeVisible();
  });

  test("voltar leva aos projetos no início", async ({ page }) => {
    await gotoWithTheme(page, RINHA, "dark");
    await page.getByRole("link", { name: "Todos os projetos" }).click();
    await expect(page).toHaveURL(/\/#projetos$/);
    await expect(page.locator("#projetos")).toBeInViewport();
  });

  test("'Ver mais' no início abre a página", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await page.getByRole("link", { name: /Ver mais/ }).click();
    await expect(page).toHaveURL(new RegExp(`${RINHA}$`));
  });
});
