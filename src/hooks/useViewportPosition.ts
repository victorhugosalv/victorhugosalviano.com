"use client";

import { useEffect, useState } from "react";

/** Onde um elemento está em relação à tela: acima (já passou), visível ou abaixo. */
export type ViewportPosition = "above" | "visible" | "below";

/**
 * Observa o elemento com o id dado por IntersectionObserver (sem escutar a rolagem).
 * Devolve null até a primeira medida ou se o elemento não existir na página.
 */
export function useViewportPosition(elementId: string): ViewportPosition | null {
  const [position, setPosition] = useState<ViewportPosition | null>(null);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) setPosition("visible");
      else setPosition(entry.boundingClientRect.top < 0 ? "above" : "below");
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId]);

  return position;
}

/** Faixa do topo ocupada pelos botões flutuantes (16 + 48 + 16 px, com folga). */
const FLOATING_BAND = 96;

/**
 * true depois que o elemento (ex.: o marcador do fim do hero) subiu além da faixa dos botões
 * flutuantes no topo. A área observada vai dessa faixa até muito abaixo da tela, então até
 * um salto direto (link do menu) troca o estado: "dentro" = ainda não passou.
 */
export function useScrolledPast(elementId: string) {
  const [past, setPast] = useState(false);

  useEffect(() => {
    const element = document.getElementById(elementId);
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setPast(!entry.isIntersecting && entry.boundingClientRect.top < FLOATING_BAND);
      },
      { rootMargin: `-${FLOATING_BAND}px 0px 100000px 0px` },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [elementId]);

  return past;
}
