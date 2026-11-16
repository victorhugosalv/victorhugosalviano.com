import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Layout";
import { Period } from "@/components/ui/Period";
import { anchors } from "@/content/sections";
import { notFoundTexts } from "@/content/ui";

import styles from "./not-found.module.css";

export const metadata: Metadata = { title: notFoundTexts.metaTitle };

export default function NotFound() {
  return (
    <>
      <main id={anchors.content} className={styles.main}>
        <Container>
          <div className={styles.box}>
            <Period before={[notFoundTexts.label]} />
            <h1 className={styles.title}>{notFoundTexts.title}</h1>
            <p className={styles.text}>{notFoundTexts.text}</p>
            <Button variant="primary" href="/" iconStart="arrow-left">
              {notFoundTexts.back}
            </Button>
          </div>
        </Container>
      </main>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
