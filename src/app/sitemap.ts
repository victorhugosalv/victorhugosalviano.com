import type { MetadataRoute } from "next";

import { projectsWithPage } from "@/content/projectPages";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    ...projectsWithPage.map((p) => ({ url: `${site.url}/projetos/${p.slug}/` })),
  ];
}
