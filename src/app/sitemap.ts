import type { MetadataRoute } from "next";

import { projectsWithPage } from "@/content/projectPages";
import { site } from "@/content/site";
import { PROJECTS_INDEX_PATH } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${site.url}/` },
    { url: `${site.url}${PROJECTS_INDEX_PATH}` },
    ...projectsWithPage.map((p) => ({ url: `${site.url}/projetos/${p.slug}/` })),
  ];
}
