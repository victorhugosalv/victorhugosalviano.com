import { expect, test } from "@playwright/test";

import { gotoWithTheme } from "./helpers";
import { PAGES } from "./pages";

/** Todas as rotas, mais um endereço que não existe (página 404). */
const ROUTES = [...PAGES, "/nao-existe/"] as const;

test.describe("contatos e rodapé em todas as páginas", () => {
  for (const path of ROUTES) {
    test(`${path} tem a seção Contatos e um só rodapé`, async ({ page }) => {
      await gotoWithTheme(page, path, "dark");
      const contact = page.locator("section#contatos");
      await expect(contact).toHaveCount(1);
      await expect(contact.getByRole("heading", { name: "Vamos conversar?" })).toBeAttached();
      await expect(page.getByRole("contentinfo")).toHaveCount(1);
    });
  }

  test("o botão de contato leva aos contatos da própria página", async ({ page, isMobile }) => {
    test.skip(isMobile, "o botão de contato é do desktop");
    await gotoWithTheme(page, "/projetos/rinha-do-campus-iv/", "dark");
    const button = page.getByRole("link", { name: "Ir para os contatos", includeHidden: true });
    await expect(button).toHaveAttribute("href", "#contatos");
  });
});
