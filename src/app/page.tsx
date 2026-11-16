import { Container, Stack } from "@/components/ui/Layout";
import { PageSection } from "@/components/sections/PageSection";
import { profile } from "@/content/profile";
import { anchors, sections } from "@/content/sections";

import styles from "./page.module.css";

export default function HomePage() {
  return (
    <main id={anchors.content} className={styles.main}>
      <Container>
        <Stack gap={{ base: 64, desktop: 120 }}>
          <header id={anchors.top} className={styles.hero}>
            <h1>{profile.name}</h1>
          </header>
          <div id={anchors.heroEnd} aria-hidden="true" />
          {sections.map((section) => (
            <PageSection key={section.id} id={section.id} title={section.title} />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
