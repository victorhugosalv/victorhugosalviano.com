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
 * Celular e tablet (< 1024 px): Menu fixo no canto de cima à direita; Início no canto de
 * baixo à direita, escondido enquanto o hero está na tela (nas páginas sem hero, sempre à
 * vista). O menu desce do topo, prende o foco e fecha com Esc ou com um toque fora.
 */
export function MobileNav({ active, hasHero }: { active: string | null; hasHero: boolean }) {
  const pastHero = useScrolledPast(anchors.heroEnd);
  const showHome = !hasHero || pastHero;
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
    <nav aria-label={ui.nav.label} className={styles.mobile} data-open={isOpen}>
      <div className={`${styles.slot} ${styles.bottom}`} data-visible={showHome}>
        <FloatingButton href={`/#${anchors.top}`} label={ui.nav.homeButton}>
          <Icon name="home" size={20} />
        </FloatingButton>
      </div>
      {isOpen ? <div className={styles.scrim} aria-hidden="true" /> : null}
      <div ref={trapRef}>
        <div className={`${styles.slot} ${styles.top} ${styles.toggle}`}>
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
