"use client";

import { useCallback, useEffect, useState } from "react";

export type CopyStatus = "idle" | "copied" | "failed";

/** Quanto tempo o "copiado" fica na tela antes de voltar ao normal (ms). */
export const COPY_RESET_DELAY = 3000;

/**
 * Copia um texto para a área de transferência e guarda o resultado. Volta a "idle" depois
 * de alguns segundos, para a próxima cópia ser anunciada de novo.
 */
export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), COPY_RESET_DELAY);
    return () => clearTimeout(timer);
  }, [status]);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }, []);

  return { status, copy };
}
