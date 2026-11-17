"use client";

import { Chip } from "@/components/ui/Chip";
import { contactTexts } from "@/content/ui";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

import styles from "./Contact.module.css";

/** Chip que copia o e-mail. O resultado é anunciado numa região viva (aria-live). */
export function CopyEmail({ email }: { email: string }) {
  const { status, copy } = useCopyToClipboard();
  return (
    <>
      <Chip
        {...(status === "copied" ? { icon: "check" as const } : {})}
        label={status === "copied" ? contactTexts.copied : contactTexts.copy}
        onClick={() => void copy(email)}
      />
      <span role="status" className={styles.srOnly}>
        {status === "copied" ? contactTexts.copied : null}
        {status === "failed" ? contactTexts.copyFailed : null}
      </span>
    </>
  );
}
