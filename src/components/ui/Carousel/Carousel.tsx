"use client";

import { Children, useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Icon } from "../Icon";

import styles from "./Carousel.module.css";

interface CarouselProps {
  /** Nome da região (ex.: "Telas do BichedIn"). */
  label: string;
  /** Rótulo de cada slide para o leitor de tela, com {position} e {total} ("{position} de {total}"). */
  slideLabel: string;
  previousLabel: string;
  nextLabel: string;
  /** Um filho por slide. */
  children: ReactNode;
}

/**
 * Carrossel da WAI-ARIA (APG), sem troca automática. A trilha usa CSS scroll-snap: arrastar
 * com o dedo funciona até sem JavaScript; os botões só passam de um slide para o outro.
 * Com movimento reduzido, a rolagem não é animada (CSS).
 */
export function Carousel({ label, slideLabel, previousLabel, nextLabel, children }: CarouselProps) {
  const slides = Children.toArray(children);
  const total = slides.length;
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  // Só anuncia depois de uma troca pelos botões (não ao abrir a página).
  const [announce, setAnnounce] = useState(false);
  const labelOf = (index: number) =>
    slideLabel.replace("{position}", String(index + 1)).replace("{total}", String(total));

  // O slide atual é o que está mais à vista na trilha (rolagem pelo dedo ou pelos botões).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setCurrent(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { root: track, threshold: 0.5 },
    );
    for (const slide of track.children) observer.observe(slide);
    return () => observer.disconnect();
  }, [total]);

  function goTo(index: number) {
    const next = (index + total) % total;
    const track = trackRef.current;
    const target = track?.children[next] as HTMLElement | undefined;
    if (!track || !target) return;
    // Atualiza já: cliques seguidos durante a rolagem suave partem do slide certo.
    setCurrent(next);
    setAnnounce(true);
    track.scrollTo({ left: target.offsetLeft - track.offsetLeft });
  }

  return (
    <section aria-roledescription="carrossel" aria-label={label} className={styles.carousel}>
      {/* Rolável, então focável: com o foco nela, as setas do teclado rolam as telas
          (axe scrollable-region-focusable, WCAG 2.1.1). */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- área rolável precisa de foco */}
      <div id={trackId} ref={trackRef} tabIndex={0} className={styles.track}>
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={labelOf(index)}
            data-index={index}
            className={styles.slide}
          >
            {slide}
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        <button
          type="button"
          aria-controls={trackId}
          aria-label={previousLabel}
          onClick={() => goTo(current - 1)}
          className={styles.button}
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <p className={styles.counter} aria-hidden="true">
          {current + 1} / {total}
        </p>
        {/* A rolagem não muda texto nenhum: esta região diz ao leitor de tela qual tela está à vista. */}
        <p role="status" className={styles.srOnly}>
          {announce ? labelOf(current) : ""}
        </p>
        <button
          type="button"
          aria-controls={trackId}
          aria-label={nextLabel}
          onClick={() => goTo(current + 1)}
          className={styles.button}
        >
          <Icon name="chevron-right" size={20} />
        </button>
      </div>
    </section>
  );
}
