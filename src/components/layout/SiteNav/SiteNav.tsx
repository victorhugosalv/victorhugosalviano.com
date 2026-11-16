"use client";

import { usePathname } from "next/navigation";

import { useActiveSection } from "@/hooks/useActiveSection";
import { isProjectsIndex, projectSlugFromPath } from "@/lib/projects";

import { DesktopNav } from "./DesktopNav";
import { MobileNav } from "./MobileNav";
import { projectsSectionId, sectionIds } from "./navLinks";

/** Navegação flutuante: pílula no desktop; Menu em cima e Início embaixo no celular. */
export function SiteNav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const currentProject = projectSlugFromPath(pathname);
  const onProjectsIndex = isProjectsIndex(pathname);
  const visibleSection = useActiveSection(isHome ? sectionIds : []);
  // Projetos fica marcado em /projetos/ e nas páginas de projeto; na 404, nada.
  const active = isHome
    ? visibleSection
    : currentProject || onProjectsIndex
      ? projectsSectionId
      : null;
  // Só o início tem hero; nas outras páginas os botões aparecem desde o começo.
  return (
    <>
      <DesktopNav key={`d${pathname}`} active={active} hasHero={isHome} />
      <MobileNav
        key={`m${pathname}`}
        active={active}
        hasHero={isHome}
        currentProject={currentProject}
        onProjectsIndex={onProjectsIndex}
      />
    </>
  );
}
