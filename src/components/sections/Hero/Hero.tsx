import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Cluster } from "@/components/ui/Layout";
import { Picture } from "@/components/ui/Picture";
import { SplitButton } from "@/components/ui/SplitButton";
import { heroActions, profile } from "@/content/profile";
import { anchors } from "@/content/sections";

import styles from "./Hero.module.css";
import { HeroEmail } from "./HeroEmail";

/**
 * Início. Celular: nome sobre a foto, com degradê para o fundo.
 * Desktop: duas colunas (texto à esquerda, foto à direita, sem degradê).
 */
export function Hero() {
  const { links } = profile;
  return (
    <header id={anchors.top} className={styles.hero}>
      <div className={styles.media}>
        <Picture
          {...profile.photo}
          sizes="(min-width: 1024px) 500px, (min-width: 768px) 640px, calc(100vw - 48px)"
          priority
        />
        <span className={styles.fade} aria-hidden="true" />
      </div>
      <h1 className={styles.name}>
        <span>{profile.nameLines[0]}</span> <span>{profile.nameLines[1]}</span>
      </h1>
      <p className={styles.lead}>{profile.headline}</p>
      <div className={styles.chips}>
        <Cluster gap={8}>
          <Chip icon="github" label={links.github.label} href={links.github.href} brand="github" />
          <Chip
            icon="linkedin"
            label={links.linkedin.label}
            href={links.linkedin.href}
            brand="linkedin"
          />
          <HeroEmail />
        </Cluster>
      </div>
      <div className={styles.actions}>
        <Cluster gap={{ base: 8, desktop: 12 }}>
          <Button variant="primary" href={`#${anchors.projects}`} iconEnd="chevron-right">
            {heroActions.projects}
          </Button>
          <SplitButton
            label={heroActions.cv.label}
            href={heroActions.cv.href}
            icon="file-text"
            menuLabel={heroActions.cv.menuLabel}
            items={heroActions.cv.downloads}
          />
        </Cluster>
      </div>
    </header>
  );
}
