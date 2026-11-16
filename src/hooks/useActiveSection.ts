"use client";

import { useEffect, useState } from "react";

/**
 * Seção ativa para a navegação: a que cruza a faixa entre 35% e 45% da altura da tela.
 * Entre duas seções (no espaço entre elas) continua a anterior, para o sublinhado não piscar.
 * Acima da primeira seção (no hero), devolve null.
 */
export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = sectionIds.join("|");

  useEffect(() => {
    const ids = key.split("|");
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const current = ids.find((id) => visible.has(id));
        if (current) {
          setActive(current);
          return;
        }
        const first = ids[0] ? document.getElementById(ids[0]) : null;
        if (first && first.getBoundingClientRect().top > window.innerHeight * 0.35) setActive(null);
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [key]);

  return active;
}
