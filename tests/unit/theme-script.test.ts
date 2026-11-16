import { describe, expect, it, vi } from "vitest";

import { THEME_STORAGE_KEY, isTheme, themeInitScript } from "@/lib/theme";

function runScript(prefersLight: boolean) {
  vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: prefersLight }));
  new Function(themeInitScript)();
  vi.unstubAllGlobals();
  return document.documentElement.getAttribute("data-theme");
}

describe("script do tema no <head>", () => {
  it("usa a escolha salva", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    expect(runScript(false)).toBe("light");
  });

  it("sem escolha salva, segue o sistema", () => {
    expect(runScript(true)).toBe("light");
    expect(runScript(false)).toBe("dark");
  });

  it("ignora valores inválidos no armazenamento", () => {
    localStorage.setItem(THEME_STORAGE_KEY, "roxo");
    expect(runScript(false)).toBe("dark");
  });

  it("isTheme aceita só dark e light", () => {
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("light")).toBe(true);
    expect(isTheme("auto")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });
});

describe("abertura do NSX no script do <head>", () => {
  function run(reduced: boolean) {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((q: string) => ({ matches: q.includes("reduced-motion") ? reduced : false })),
    );
    new Function(themeInitScript)();
    vi.unstubAllGlobals();
    return document.documentElement.hasAttribute("data-intro");
  }

  it("marca a 1ª visita e não marca de novo", () => {
    expect(run(false)).toBe(true);
    document.documentElement.removeAttribute("data-intro");
    expect(run(false)).toBe(false);
  });

  it("nunca aparece com movimento reduzido", () => {
    expect(run(true)).toBe(false);
  });
});
