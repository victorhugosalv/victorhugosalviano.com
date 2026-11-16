"use client";

import { useCallback, useSyncExternalStore } from "react";

import { applyTheme, readTheme, type Theme } from "@/lib/theme";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const serverTheme = (): Theme => "dark";

/** Tema atual (lido do <html>) e a troca entre claro e escuro. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, serverTheme);
  const toggleTheme = useCallback(() => {
    applyTheme(readTheme() === "dark" ? "light" : "dark");
  }, []);
  return { theme, toggleTheme };
}
