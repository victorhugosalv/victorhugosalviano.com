"use client";

import { usePathname } from "next/navigation";

import { useActiveSection } from "@/hooks/useActiveSection";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { projectsSectionId, sectionIds } from "./navLinks";

/** Navegação flutuante v5: pílula no desktop, botões Início e Menu no celular. */
export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const visibleSection = useActiveSection(isHome ? sectionIds : []);
  const active = isHome ? visibleSection : projectsSectionId;
  return (
    <>
      <DesktopNav key={`d${pathname}`} active={active} />
      <MobileNav key={`m${pathname}`} active={active} />
    </>
  );
}
