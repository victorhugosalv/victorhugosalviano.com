"use client";

import { useEffect, useRef } from "react";

import { FloatingButton } from "@/components/ui/FloatingButton";
import { Icon } from "@/components/ui/Icon";
import { anchors } from "@/content/sections";
import { ui } from "@/content/ui";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrolledPast } from "@/hooks/useViewportPosition";

import { ThemeToggleRow } from "../ThemeToggle";

import styles from "./MobileNav.module.css";
import { mobileLinks } from "./navLinks";

/**
 * Celular e tablet (< 1024 px): botões Início e Menu nos cantos de cima; depois do hero,
 * descem para os cantos de baixo. O menu desce do topo, prende o foco e fecha com Esc.
 */
export function MobileNav({ active }: { active: string | null }) {
  const scrolled = useScrolledPast(anchors.heroEnd);
  const { isOpen, close, toggle, panelId } = useDisclosure();
  const trapRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useFocusTrap(trapRef, isOpen, firstLinkRef);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.setAttribute("data-menu-open", "");
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
    }
    // Toque fora do menu (no fundo escurecido) fecha.
    function onPointerDown(event: PointerEvent) {
      if (!trapRef.current?.contains(event.target as Node)) close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      root.removeAttribute("data-menu-open");
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen, close]);

  // A página atual (Início) conta como ativa quando nenhuma seção está na faixa.
  const current = active ?? anchors.top;

  return (
    <nav
      aria-label={ui.nav.label}
      className={styles.mobile}
      data-scrolled={scrolled}
      data-open={isOpen}
    >
      <div className={`${styles.slot} ${styles.left}`}>
        <FloatingButton href={`/#${anchors.top}`} label={ui.nav.homeButton}>
          <Icon name="home" size={20} />
        </FloatingButton>
      </div>
      {isOpen ? <div className={styles.scrim} aria-hidden="true" /> : null}
      <div ref={trapRef}>
        <div className={`${styles.slot} ${styles.right} ${styles.toggle}`}>
          <FloatingButton
            ref={toggleRef}
            label={isOpen ? ui.nav.closeMenu : ui.nav.openMenu}
            expanded={isOpen}
            controls={panelId}
            onClick={toggle}
          >
            <Icon name={isOpen ? "x" : "menu"} size={20} />
          </FloatingButton>
        </div>
        <div id={panelId} hidden={!isOpen} className={styles.panel}>
          <p className={styles.title}>{ui.nav.menuTitle}</p>
          <ul className={styles.list}>
            {mobileLinks.map((link, index) => (
              <li key={link.id}>
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  href={link.href}
                  onClick={close}
                  aria-current={current === link.id ? "true" : undefined}
                  className={styles.link}
                >
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.theme}>
            <ThemeToggleRow />
          </div>
        </div>
      </div>
    </nav>
  );
}
