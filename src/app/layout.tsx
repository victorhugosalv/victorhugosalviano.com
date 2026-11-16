import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { SkipLink } from "@/components/layout/SkipLink";
import { IntroLoader } from "@/components/loader/IntroLoader";
import { site } from "@/content/site";
import { THEME_COLORS, themeInitScript } from "@/lib/theme";

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
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
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
        <IntroLoader />
        <SkipLink />
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
