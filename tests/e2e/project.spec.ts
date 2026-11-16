import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { THEMES } from "./pages";

const RINHA = "/projetos/rinha-do-campus-iv/";

test.describe("página da Rinha", () => {
  test("todo projeto tem página; outro slug dá 404", async ({ page }) => {
    for (const slug of ["rinha-do-campus-iv", "docenda", "bichedin"]) {
      const ok = await page.goto(`/projetos/${slug}/`);
      expect(ok?.status(), slug).toBe(200);
    }
    for (const slug of ["qualquer-coisa"]) {
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
    // Com 2 telas ou mais, o carrossel ocupa o lugar da capa.
    await expect(page.getByRole("region", { name: "Telas da Rinha do Campus IV" })).toBeVisible();
    await expect(page.getByRole("img", { name: /Explorar Torneios/ })).toBeVisible();
    for (const h of ["Stack", "Repositórios", "Como funciona", "Linha do tempo", "Minha parte"]) {
      await expect(page.getByRole("heading", { level: 2, name: h })).toBeVisible();
    }
    const repo = page.getByRole("link", { name: /gbrlmzl\/api-rinha-v2.*nova aba/ });
    await expect(repo).toHaveAttribute("target", "_blank");
    await expect(repo).toHaveAttribute("rel", /noopener/);
    const next = page.getByRole("link", { name: /Próximo projeto/ });
    await expect(next).toHaveAttribute("href", "/projetos/docenda/");
    await expect(page.locator("time[datetime='2026-04']").first()).toBeVisible();
  });

  test("voltar leva à página com todos os projetos", async ({ page }) => {
    await gotoWithTheme(page, RINHA, "dark");
    await page.getByRole("link", { name: "Todos os projetos" }).click();
    await expect(page).toHaveURL(/\/projetos\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Projetos" })).toBeVisible();
  });

  test("'Ver mais' no início abre a página", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await page
      .getByRole("link", { name: /Ver mais/ })
      .first()
      .click();
    await expect(page).toHaveURL(new RegExp(`${RINHA}$`));
  });

  test("sem link de repositório, a página diz que é privado; a Docenda aponta para o dela", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/projetos/bichedin/", "dark");
    const repos = page.getByRole("region", { name: "Repositórios" });
    await expect(repos).toContainText("Repositório privado");
    await expect(repos.getByRole("link")).toHaveCount(0);
    await gotoWithTheme(page, "/projetos/docenda/", "dark");
    await expect(page.getByRole("heading", { name: "Stack planejada" })).toBeVisible();
    await expect(
      page
        .getByRole("region", { name: "Repositórios" })
        .getByRole("link", { name: /victorhugosalv\/docenda/ }),
    ).toHaveAttribute("href", "https://github.com/victorhugosalv/docenda");
  });
});
