import {
  IconArrowLeft,
  IconArrowUpRight,
  IconBrandGithub,
  IconBrandLinkedin,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCopy,
  IconDownload,
  IconFileText,
  IconFileTypePdf,
  IconHome,
  IconLock,
  IconMail,
  IconMarkdown,
  IconMenu2,
  IconMessage,
  IconMoon,
  IconSun,
  IconX,
} from "@tabler/icons-react";

import styles from "./Icon.module.css";

const icons = {
  "arrow-left": IconArrowLeft,
  "arrow-up-right": IconArrowUpRight,
  check: IconCheck,
  "chevron-down": IconChevronDown,
  "chevron-right": IconChevronRight,
  "chevron-up": IconChevronUp,
  copy: IconCopy,
  download: IconDownload,
  "file-text": IconFileText,
  "file-type-pdf": IconFileTypePdf,
  github: IconBrandGithub,
  home: IconHome,
  linkedin: IconBrandLinkedin,
  lock: IconLock,
  mail: IconMail,
  markdown: IconMarkdown,
  menu: IconMenu2,
  message: IconMessage,
  moon: IconMoon,
  sun: IconSun,
  x: IconX,
} as const;

export type IconName = keyof typeof icons;
export type IconTone = "inherit" | "sun" | "moon";

interface IconProps {
  name: IconName;
  size?: 16 | 18 | 20 | 24;
  tone?: IconTone;
}

/** Ícone do Tabler, sempre decorativo: o nome acessível fica no texto ou no botão. */
export function Icon({ name, size = 16, tone = "inherit" }: IconProps) {
  const Svg = icons[name];
  return (
    <Svg
      size={size}
      stroke={1.75}
      aria-hidden="true"
      focusable="false"
      className={`${styles.icon} ${styles[tone]}`}
    />
  );
}
