"use client";

import { useCallback, useId, useState } from "react";

/** Aberto/fechado de um painel, com o id para o aria-controls. */
export function useDisclosure(initiallyOpen = false) {
  const [isOpen, setOpen] = useState(initiallyOpen);
  const panelId = useId();
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { isOpen, open, close, toggle, panelId };
}
