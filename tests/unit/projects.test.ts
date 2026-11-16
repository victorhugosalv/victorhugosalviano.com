import { describe, expect, it } from "vitest";

import {
  isProjectsIndex,
  menuProjects,
  projectHref,
  projectSlugFromPath,
  selectHomeProjects,
} from "@/lib/projects";

const list = [
  { slug: "a" },
  { slug: "b", featured: true },
  { slug: "c", page: {} },
  { slug: "d" },
] as const;

describe("lista de projetos", () => {
  it("o início mostra o destaque primeiro e depois os outros, na ordem, até o máximo", () => {
    expect(selectHomeProjects(list, 3).map((p) => p.slug)).toEqual(["b", "a", "c"]);
    expect(selectHomeProjects(list, 10)).toHaveLength(4);
  });

  it("o menu acrescenta o projeto atual quando ele ficou de fora", () => {
    expect(menuProjects(list, 3, "d").map((p) => p.slug)).toEqual(["b", "a", "c", "d"]);
    expect(menuProjects(list, 3, "a").map((p) => p.slug)).toEqual(["b", "a", "c"]);
    expect(menuProjects(list, 3).map((p) => p.slug)).toEqual(["b", "a", "c"]);
  });

  it("o link vai à página do projeto, ou ao cartão no início quando não há página", () => {
    expect(projectHref(list[2])).toBe("/projetos/c/");
    expect(projectHref(list[0])).toBe("/#projetos");
  });

  it("lê o projeto e a lista a partir do endereço", () => {
    expect(projectSlugFromPath("/projetos/rinha/")).toBe("rinha");
    expect(projectSlugFromPath("/projetos/rinha")).toBe("rinha");
    expect(projectSlugFromPath("/projetos/")).toBeUndefined();
    expect(isProjectsIndex("/projetos/")).toBe(true);
    expect(isProjectsIndex("/projetos")).toBe(true);
    expect(isProjectsIndex("/projetos/rinha/")).toBe(false);
  });
});
