import type { Metadata } from "next";
import type { ComponentType } from "react";

import { About } from "@/components/sections/About";
import { Hero } from "@/components/sections/Hero";
import { PageSection } from "@/components/sections/PageSection";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { Container, Stack } from "@/components/ui/Layout";
import { anchors, sections, type SectionId } from "@/content/sections";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Conteúdo de cada seção. A ordem e os títulos vêm de content/sections.ts; Contatos fica no SiteFooter. */
const bodies: Record<Exclude<SectionId, "contatos">, ComponentType> = {
  skills: Skills,
  projetos: Projects,
  sobre: About,
  trajetoria: Timeline,
};

export default function HomePage() {
  return (
    <main id={anchors.content}>
      <Container>
        <Stack gap={{ base: 64, desktop: 120 }}>
          <div>
            <Hero />
            <div id={anchors.heroEnd} aria-hidden="true" />
          </div>
          {sections.map((section) => {
            if (section.id === "contatos") return null;
            const Body = bodies[section.id];
            return (
              <PageSection key={section.id} id={section.id} title={section.title}>
                <Body />
              </PageSection>
            );
          })}
        </Stack>
      </Container>
    </main>
  );
}
