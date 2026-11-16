import { IBM_Plex_Sans, Silkscreen, Tektur } from "next/font/google";

// O next/font baixa as fontes no build e serve do próprio site (sem Google no navegador).
export const tektur = Tektur({
  subsets: ["latin"],
  weight: "600",
  display: "swap",
  variable: "--font-tektur",
});

export const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-plex",
});

export const silkscreen = Silkscreen({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-silkscreen",
});
