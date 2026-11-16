import type { Metadata } from "next";
import type { ComponentType } from "react";

import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { PageSection } from "@/components/sections/PageSection";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { Container, Stack } from "@/components/ui/Layout";
import { anchors, sections, type SectionId } from "@/content/sections";

import styles from "./page.module.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Conteúdo de cada seção. A ordem e os títulos vêm de content/sections.ts. */
const bodies: Record<Exclude<SectionId, "contatos">, ComponentType> = {
  skills: Skills,
  projetos: Projects,
  sobre: About,
  trajetoria: Timeline,
};

export default function HomePage() {
  const contact = sections.find((s) => s.id === "contatos");
  return (
    <>
      <main id={anchors.content} className={styles.main}>
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
        {contact ? (
          <div className={styles.band}>
            <Container>
              <Contact section={contact} />
            </Container>
          </div>
        ) : null}
      </main>
      <div className={styles.footerBand}>
        <Container>
          <Footer />
        </Container>
      </div>
    </>
  );
}
