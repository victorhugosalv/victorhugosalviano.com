"use client";

import { usePathname } from "next/navigation";

import { useActiveSection } from "@/hooks/useActiveSection";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { projectsSectionId, sectionIds } from "./navLinks";

/** Navegação flutuante: pílula no desktop; Menu em cima e Início embaixo no celular. */
export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const visibleSection = useActiveSection(isHome ? sectionIds : []);
  const active = isHome ? visibleSection : projectsSectionId;
  // Só o início tem hero; nas outras páginas os botões aparecem desde o começo.
  return (
    <>
      <DesktopNav key={`d${pathname}`} active={active} hasHero={isHome} />
      <MobileNav key={`m${pathname}`} active={active} hasHero={isHome} />
    </>
  );
}
