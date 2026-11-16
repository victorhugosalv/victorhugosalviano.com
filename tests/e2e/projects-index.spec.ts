import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";

test.describe("página /projetos/", () => {
  test("busca e filtra pelo teclado, anuncia a contagem e guarda o filtro no endereço", async ({
    page,
  }) => {
    await gotoWithTheme(page, "/projetos/", "dark");
    const count = page.getByRole("status").filter({ hasText: /projeto/ });
    await expect(count).toHaveText("3 projetos");
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(3);

    const search = page.getByRole("searchbox", { name: "Buscar projeto" });
    await search.focus();
    await page.keyboard.type("computacao");
    await expect(count).toHaveText("1 projeto");
    await expect(page.getByRole("heading", { level: 2, name: "Docenda" })).toBeVisible();
    await expect(page).toHaveURL(/\?q=computacao$/);
    await page.getByRole("button", { name: "Limpar filtros" }).first().click();
    await expect(count).toHaveText("3 projetos");
    await expect(search).toBeFocused();

    // Status pelo teclado (rádios: setas trocam a opção)
    await page.getByRole("radio", { name: "Todos" }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("radio", { name: "Em desenvolvimento" })).toBeChecked();
    await expect(count).toHaveText("2 projetos");
    await page.keyboard.press("ArrowRight");
    await expect(count).toHaveText("1 projeto");
    await page.keyboard.press("ArrowRight"); // do último volta ao primeiro
    await expect(page.getByRole("radio", { name: "Todos" })).toBeChecked();

    // Filtros: abre o painel e marca uma tecnologia
    const filters = page.getByRole("button", { name: "Filtros" });
    await expect(filters).toHaveAttribute("aria-expanded", "false");
    await filters.focus();
    await page.keyboard.press("Enter");
    await expect(filters).toHaveAttribute("aria-expanded", "true");
    const docker = page.getByRole("checkbox", { name: "Docker" });
    await docker.focus();
    await page.keyboard.press("Space");
    await expect(docker).toBeChecked();
    await expect(count).toHaveText("2 projetos");
    await expect(page.getByRole("button", { name: "Filtros, 1 ativo" })).toBeVisible();
    await expect(page).toHaveURL(/\?tec=Docker$/);

    // Remover pelo resumo dos filtros aplicados
    await page.getByRole("button", { name: "Remover filtro Docker" }).click();
    await expect(count).toHaveText("3 projetos");
  });

  test("abre já filtrado por um link compartilhado e mostra o estado vazio", async ({ page }) => {
    await gotoWithTheme(page, "/projetos/?status=concluido&tec=React", "dark");
    await expect(page.getByRole("radio", { name: "Concluído" })).toBeChecked();
    await expect(page.getByText("Nenhum projeto com esses filtros.")).toBeVisible();
    await page.getByRole("button", { name: "Limpar filtros" }).last().click();
    await expect(page.getByRole("status").filter({ hasText: /projeto/ })).toHaveText("3 projetos");
    await expect(page).toHaveURL(/\/projetos\/$/);
  });

  test("sem JavaScript, a lista aparece inteira e os controles não", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/projetos/");
    await expect(page.getByRole("main").getByRole("heading", { level: 2 })).toHaveCount(3);
    await expect(page.getByRole("searchbox")).toBeHidden();
    await expect(page.getByRole("button", { name: "Filtros" })).toBeHidden();
    await context.close();
  });

  test("o início leva a /projetos/ e mostra no máximo 3 projetos", async ({ page }) => {
    await gotoWithTheme(page, "/", "dark");
    await expect(page.locator("#projetos article")).toHaveCount(3);
    const link = page.locator("#projetos").getByRole("link", { name: "Ver todos os projetos" });
    await expect(link).toHaveAttribute("href", "/projetos/");
  });
});
