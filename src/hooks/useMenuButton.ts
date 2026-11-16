"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

/**
 * Botão de menu acessível (padrão "menu button" do WAI-ARIA APG):
 * Enter, Espaço ou ↓ abrem no primeiro item; ↑ abre no último; no menu, setas, Home e End
 * navegam; Esc fecha e devolve o foco ao botão; Tab ou clique fora fecham.
 */
export function useMenuButton(itemCount: number) {
  const [isOpen, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const buttonId = useId();
  const menuId = useId();

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setOpen(true);
  }, []);

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Foca o item ativo sempre que o menu abre ou o item muda.
  useEffect(() => {
    if (isOpen) itemRefs.current[activeIndex]?.focus();
  }, [isOpen, activeIndex]);

  // Clique fora fecha sem roubar o foco de onde o visitante clicou.
  useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  const last = itemCount - 1;

  const buttonProps = {
    ref: buttonRef,
    id: buttonId,
    type: "button" as const,
    "aria-haspopup": "menu" as const,
    "aria-expanded": isOpen,
    "aria-controls": menuId,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      if (isOpen) close(false);
      else openAt(0);
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        openAt(0);
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        openAt(last);
      }
    },
  };

  const menuProps = {
    ref: menuRef,
    id: menuId,
    role: "menu" as const,
    "aria-labelledby": buttonId,
    hidden: !isOpen,
    onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
      const keys: Record<string, () => void> = {
        ArrowDown: () => setActiveIndex((i) => (i >= last ? 0 : i + 1)),
        ArrowUp: () => setActiveIndex((i) => (i <= 0 ? last : i - 1)),
        Home: () => setActiveIndex(0),
        End: () => setActiveIndex(last),
        Escape: () => close(true),
      };
      const action = keys[event.key];
      if (action) {
        event.preventDefault();
        action();
      } else if (event.key === "Tab") {
        setOpen(false);
      } else if (event.key === " ") {
        event.preventDefault();
        itemRefs.current[activeIndex]?.click();
      }
    },
  };

  const getItemProps = (index: number) => ({
    ref: (el: HTMLElement | null) => {
      itemRefs.current[index] = el;
    },
    role: "menuitem" as const,
    tabIndex: index === activeIndex ? 0 : -1,
    // Depois de escolher, o foco volta ao botão (o item some com o menu).
    onClick: () => close(true),
  });

  return { isOpen, buttonProps, menuProps, getItemProps };
}
