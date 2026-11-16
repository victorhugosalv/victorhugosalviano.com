"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Evento próprio: o replaceState do navegador não avisa ninguém. */
const CHANGE = "locationsearchchange";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

const read = () => window.location.search;
// Na exportação estática o HTML é gerado sem endereço: começa sem filtros.
const readOnServer = () => "";

/**
 * O "?…" do endereço como estado: lê e troca sem recarregar (history.replaceState), para
 * que um link com filtros abra a página já filtrada e dê para compartilhar.
 */
export function useLocationSearch(): readonly [string, (next: string) => void] {
  const search = useSyncExternalStore(subscribe, read, readOnServer);
  const setSearch = useCallback((next: string) => {
    const { pathname, hash } = window.location;
    window.history.replaceState(window.history.state, "", `${pathname}${next}${hash}`);
    window.dispatchEvent(new Event(CHANGE));
  }, []);
  return [search, setSearch] as const;
}
