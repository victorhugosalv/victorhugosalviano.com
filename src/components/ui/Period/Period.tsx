import type { ReactNode } from "react";

import styles from "./Period.module.css";

interface DateLabel {
  label: string;
  iso?: string;
}

interface PeriodProps {
  start?: DateLabel;
  end?: DateLabel;
  /** rótulos antes (ex.: "Projeto") e depois (ex.: "em equipe") */
  before?: readonly string[];
  after?: readonly string[];
}

function DateText({ date }: { date: DateLabel }) {
  return date.iso ? <time dateTime={date.iso}>{date.label}</time> : date.label;
}

/** Rótulo em pixel (Silkscreen, dourado): período com datas em <time> e rótulos. */
export function Period({ start, end, before = [], after = [] }: PeriodProps) {
  const parts: ReactNode[] = [...before];
  if (start || end) {
    parts.push(
      <span key="periodo">
        {start ? <DateText date={start} /> : null}
        {start && end ? " – " : null}
        {end ? <DateText date={end} /> : null}
      </span>,
    );
  }
  parts.push(...after);
  return (
    <p className={styles.period}>
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 ? " · " : null}
          {part}
        </span>
      ))}
    </p>
  );
}
