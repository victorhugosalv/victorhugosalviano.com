import { Chip } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import { Cluster } from "@/components/ui/Layout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { profile } from "@/content/profile";
import type { Section } from "@/content/types";

import styles from "./Contact.module.css";
import { CopyEmail } from "./CopyEmail";

/** Contatos, centralizado: "Vamos conversar?", o e-mail e os links. */
export function Contact({ section }: { section: Section }) {
  const headingId = `${section.id}-titulo`;
  const { links } = profile;
  return (
    <section id={section.id} aria-labelledby={headingId} className={styles.contact}>
      <SectionHeading id={headingId} title={section.heading ?? section.title} align="center" />
      <a href={links.email.href} className={styles.email}>
        <span className={styles.mailIcon}>
          <Icon name="mail" size={20} />
        </span>
        {profile.email}
      </a>
      <Cluster as="ul" gap={8} justify="center">
        <li>
          <CopyEmail email={profile.email} />
        </li>
        <li>
          <Chip icon="github" label={links.github.label} href={links.github.href} brand="github" />
        </li>
        <li>
          <Chip
            icon="linkedin"
            label={links.linkedin.label}
            href={links.linkedin.href}
            brand="linkedin"
          />
        </li>
      </Cluster>
    </section>
  );
}
