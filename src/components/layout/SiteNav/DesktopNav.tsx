"use client";

import { FloatingButton } from "@/components/ui/FloatingButton";
import { Icon } from "@/components/ui/Icon";
import { anchors } from "@/content/sections";
import { ui } from "@/content/ui";
import { useScrolledPast, useViewportPosition } from "@/hooks/useViewportPosition";

import { ThemeToggleFloating } from "../ThemeToggle";

import styles from "./DesktopNav.module.css";
import { desktopLinks, type NavLink } from "./navLinks";

function PillLink({ link, active }: { link: NavLink; active: boolean }) {
  return (
    <li>
      <a
        href={link.href}
        aria-current={active ? "true" : undefined}
        className={`${styles.link} ${active ? styles.active : ""}`}
      >
        {link.title}
      </a>
    </li>
  );
}

/**
 * Desktop (≥ 1024 px): pílula centralizada e tema no canto de cima, alinhados ao conteúdo.
 * O contato é um atalho de ação: fica preso ao canto da janela, maior e em vermelho.
 */
export function DesktopNav({ active, hasHero }: { active: string | null; hasHero: boolean }) {
  const pastHero = useScrolledPast(anchors.heroEnd);
  const contactPosition = useViewportPosition(anchors.contact);
  const showContact = (!hasHero || pastHero) && contactPosition !== "visible";
  return (
    <nav aria-label={ui.nav.label} className={styles.desktop}>
      <div className={styles.pill}>
        <ul className={styles.list}>
          {desktopLinks.left.map((link) => (
            <PillLink key={link.id} link={link} active={active === link.id} />
          ))}
          <li>
            <a href={`/#${anchors.top}`} aria-label={ui.nav.logoLabel} className={styles.logo}>
              <span className={styles.logoBar} aria-hidden="true" />
              {ui.nav.logo}
            </a>
          </li>
          {desktopLinks.right.map((link) => (
            <PillLink key={link.id} link={link} active={active === link.id} />
          ))}
        </ul>
      </div>
      <div className={styles.theme}>
        <ThemeToggleFloating />
      </div>
      <div className={styles.contact} data-visible={showContact}>
        <FloatingButton href={`#${anchors.contact}`} label={ui.nav.contactButton} variant="accent">
          <Icon name="message" size={24} />
        </FloatingButton>
      </div>
    </nav>
  );
}
