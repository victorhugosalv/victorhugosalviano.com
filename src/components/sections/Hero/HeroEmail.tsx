"use client";

import { SplitChip } from "@/components/ui/SplitChip";
import { profile } from "@/content/profile";
import { contactTexts } from "@/content/ui";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

/** Chip do e-mail no início: o link abre o app de e-mail e o botão ao lado copia o endereço. */
export function HeroEmail() {
  const { status, copy } = useCopyToClipboard();
  const { email, links } = profile;
  return (
    <SplitChip
      icon="mail"
      label={links.email.label}
      href={links.email.href}
      actionIcon={status === "copied" ? "check" : "copy"}
      actionLabel={status === "copied" ? contactTexts.copied : contactTexts.copy}
      onAction={() => void copy(email)}
      announcement={
        status === "copied"
          ? contactTexts.copied
          : status === "failed"
            ? contactTexts.copyFailed
            : null
      }
    />
  );
}
