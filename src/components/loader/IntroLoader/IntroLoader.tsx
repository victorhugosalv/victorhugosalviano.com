"use client";

import { useRef } from "react";

import { useFirstVisit } from "@/hooks/useFirstVisit";

import styles from "./IntroLoader.module.css";

const frame = (name: string) => `/images/nsx-${name}.svg`;

/**
 * Abertura da 1ª visita (~2,7 s): o NSX faz borrachão, arranca até 80%, freia, vai a 100%
 * e abre os faróis. Decorativa: fica escondida do leitor de tela, não pega o foco e some
 * com qualquer tecla ou toque. Só aparece quando o <html> tem data-intro (script do <head>).
 */
export function IntroLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  useFirstVisit(overlayRef);
  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true" data-intro-overlay="">
      <div className={styles.track}>
        <div className={styles.car}>
          {/* As rodas giram trocando dois quadros; no fim, o quadro com os faróis abertos. */}
          <span className={styles.wheels}>
            <img src={frame("roda1")} alt="" className={styles.frame} />
            <img src={frame("roda2")} alt="" className={`${styles.frame} ${styles.spin}`} />
          </span>
          <img src={frame("aberto")} alt="" className={`${styles.frame} ${styles.lights}`} />
        </div>
        <span className={styles.road} />
      </div>
    </div>
  );
}
