"use client";

import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useDisclosure } from "./useDisclosure";

/** Atrasos (ms): curto para abrir e um pouco maior para fechar, dando tempo ao mouse. */
export const HOVER_OPEN_DELAY = 120;
export const HOVER_CLOSE_DELAY = 300;

/**
 * Painel que abre com o mouse em cima (com atraso) ou pelo botão (APG: disclosure).
 * Esc fecha mesmo quando foi aberto pelo mouse (WCAG 1.4.13) e, se o foco estava
 * dentro, devolve o foco ao botão. O foco saindo do conjunto também fecha.
 */
export function useHoverDisclosure<Root extends HTMLElement>(
  openDelay = HOVER_OPEN_DELAY,
  closeDelay = HOVER_CLOSE_DELAY,
) {
  const { isOpen, open, close, toggle, panelId } = useDisclosure();
  const rootRef = useRef<Root>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = undefined;
  }, []);
  const schedule = useCallback(
    (action: () => void, delay: number) => {
      cancel();
      timer.current = setTimeout(action, delay);
    },
    [cancel],
  );
  useEffect(() => cancel, [cancel]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      cancel();
      close();
      if (rootRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, cancel, close]);

  // Só o mouse: no toque, o primeiro toque em "Projetos" já navega.
  const onPointerEnter = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") schedule(open, openDelay);
    },
    [schedule, open, openDelay],
  );
  const onPointerLeave = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "mouse") schedule(close, closeDelay);
    },
    [schedule, close, closeDelay],
  );
  const onBlur = useCallback(
    (event: FocusEvent) => {
      if (rootRef.current?.contains(event.relatedTarget as Node | null)) return;
      cancel();
      close();
    },
    [cancel, close],
  );
  const onToggle = useCallback(() => {
    cancel();
    toggle();
  }, [cancel, toggle]);

  return {
    isOpen,
    panelId,
    rootRef,
    buttonRef,
    toggle: onToggle,
    rootProps: { onPointerEnter, onPointerLeave, onBlur },
  };
}
