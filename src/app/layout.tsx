import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { Footer } from "@/components/layout/Footer";
import { SiteNav } from "@/components/layout/SiteNav";
import { SkipLink } from "@/components/layout/SkipLink";
import { site } from "@/content/site";
import { themeInitScript } from "@/lib/theme";

import { plex, silkscreen, tektur } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
    { media: "(prefers-color-scheme: light)", color: "#f3efe6" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html
      lang={site.lang}
      className={`${tektur.variable} ${plex.variable} ${silkscreen.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* eslint-disable-next-line react/no-danger -- script fixo do tema; hash liberado na CSP */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SkipLink />
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
