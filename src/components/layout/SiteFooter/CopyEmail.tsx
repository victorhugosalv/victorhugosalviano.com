"use client";

import { useEffect, useState } from "react";

import { Chip } from "@/components/ui/Chip";
import { contactTexts } from "@/content/ui";

import styles from "./Contact.module.css";

type Status = "idle" | "copied" | "failed";

/** Chip que copia o e-mail. O resultado é anunciado numa região viva (aria-live). */
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");

  // Volta a "Copiar e-mail" depois de alguns segundos, para a próxima cópia ser anunciada.
  useEffect(() => {
    if (status === "idle") return;
    const timer = setTimeout(() => setStatus("idle"), 3000);
    return () => clearTimeout(timer);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <Chip
        {...(status === "copied" ? { icon: "check" as const } : {})}
        label={status === "copied" ? contactTexts.copied : contactTexts.copy}
        onClick={copy}
      />
      <span role="status" className={styles.srOnly}>
        {status === "copied" ? contactTexts.copied : null}
        {status === "failed" ? contactTexts.copyFailed : null}
      </span>
    </>
  );
}
