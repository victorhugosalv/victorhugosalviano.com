import type { TimelineItem } from "./types";

/** Trajetória (curriculo.md: experiência, formação e idiomas). */
export const timeline = [
  {
    period: { start: { label: "jun/2026", iso: "2026-06" }, end: { label: "atual" } },
    title: "Estágio Supervisionado em Computação",
    detail: "Licenciatura · aulas no ensino médio e observação no fundamental",
  },
  {
    period: {
      start: { label: "nov/2024", iso: "2024-11" },
      end: { label: "dez/2025", iso: "2025-12" },
    },
    title: "Monitor bolsista de LP e POO (Java)",
    detail: "UFPB · workshop de Git/GitHub, HTML/CSS e Spring Boot",
  },
  {
    period: {
      start: { label: "jun/2023", iso: "2023-06" },
      end: { label: "dez/2027", iso: "2027-12" },
    },
    title: "Licenciatura em Ciência da Computação",
    detail: "UFPB · conclusão prevista para dez/2027",
  },
  { label: "Idiomas", title: "Português nativo · inglês B1" },
] as const satisfies readonly TimelineItem[];
