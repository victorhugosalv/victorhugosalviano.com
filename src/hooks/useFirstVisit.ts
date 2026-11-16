"use client";

import { useEffect, type RefObject } from "react";

import { INTRO_ATTRIBUTE } from "@/lib/theme";

/**
 * Abertura da 1ª visita. Quem decide se ela aparece é o script do <head> (marca o <html>);
 * o CSS a esconde sozinho no fim. Aqui só tratamos o "pular": qualquer tecla, toque ou clique,
 * ou o fim da animação, tiram a marca do <html>.
 */
export function useFirstVisit(onEndRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.hasAttribute(INTRO_ATTRIBUTE)) return;
    const end = () => root.removeAttribute(INTRO_ATTRIBUTE);
    const overlay = onEndRef.current;
    // Só o fim da animação da própria tela conta (as dos quadros também disparam o evento).
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === overlay) end();
    };
    document.addEventListener("keydown", end, { once: true });
    document.addEventListener("pointerdown", end, { once: true });
    overlay?.addEventListener("animationend", onAnimationEnd);
    return () => {
      document.removeEventListener("keydown", end);
      document.removeEventListener("pointerdown", end);
      overlay?.removeEventListener("animationend", onAnimationEnd);
    };
  }, [onEndRef]);
}
