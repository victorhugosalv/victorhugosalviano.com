import type { Page } from "@playwright/test";

import { STORAGE_KEYS } from "../../src/lib/storage";

import type { ThemeName } from "./pages";

/** Abre a página já no tema pedido (como se o visitante tivesse escolhido antes). */
export async function gotoWithTheme(page: Page, path: string, theme: ThemeName) {
  await page.addInitScript(
    ({ keys, t }) => {
      try {
        localStorage.setItem(keys.theme, t);
        // A abertura do NSX só aparece na 1ª visita; nos testes ela já foi vista.
        localStorage.setItem(keys.introSeen, "1");
      } catch {
        /* armazenamento bloqueado */
      }
    },
    { keys: STORAGE_KEYS, t: theme },
  );
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}
