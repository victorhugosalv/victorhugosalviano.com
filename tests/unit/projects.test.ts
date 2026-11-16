import { describe, expect, it } from "vitest";

import {
  NO_FILTERS,
  filterProjects,
  isProjectsIndex,
  menuProjects,
  parseFilters,
  projectHref,
  projectSlugFromPath,
  selectHomeProjects,
  serializeFilters,
  techOptions,
  type ProjectFilters,
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

describe("busca e filtros de /projetos/", () => {
  const data = [
    {
      title: "Rinha",
      summary: "Torneios de e-sports",
      stack: ["Java", "Docker"],
      status: "concluido",
    },
    {
      title: "Docenda",
      summary: "Planos de aula de Computação",
      stack: ["React", "Docker"],
      status: "em-desenvolvimento",
    },
    {
      title: "BichedIn",
      summary: "Currículos de bichos",
      stack: ["HTML", "CSS"],
      status: "em-desenvolvimento",
    },
  ] as const;
  const titles = (f: Partial<ProjectFilters>) =>
    filterProjects(data, { ...NO_FILTERS, ...f }).map((p) => p.title);

  it("sem filtro, mostra todos", () => {
    expect(titles({})).toEqual(["Rinha", "Docenda", "BichedIn"]);
  });

  it("busca sem diferenciar maiúsculas nem acentos, no nome, na descrição e na stack", () => {
    expect(titles({ q: "COMPUTACAO" })).toEqual(["Docenda"]);
    expect(titles({ q: "curriculos" })).toEqual(["BichedIn"]);
    expect(titles({ q: "java" })).toEqual(["Rinha"]);
    expect(titles({ q: "  docker " })).toEqual(["Rinha", "Docenda"]);
  });

  it("status e tecnologia (qualquer uma das marcadas)", () => {
    expect(titles({ status: "concluido" })).toEqual(["Rinha"]);
    expect(titles({ tec: ["React", "HTML"] })).toEqual(["Docenda", "BichedIn"]);
  });

  it("os três juntos: o projeto precisa atender a todos", () => {
    expect(titles({ q: "planos", status: "em-desenvolvimento", tec: ["Docker"] })).toEqual([
      "Docenda",
    ]);
    expect(titles({ q: "planos", status: "concluido", tec: ["Docker"] })).toEqual([]);
  });

  it("tecnologias saem das stacks, sem repetir", () => {
    expect(techOptions(data)).toEqual(["Java", "Docker", "React", "HTML", "CSS"]);
  });

  it("o endereço guarda e devolve os filtros, ignorando valores inválidos", () => {
    const f = { q: "aula", status: "concluido", tec: ["Docker", "React"] };
    const url = serializeFilters(f);
    expect(url).toBe("?q=aula&status=concluido&tec=Docker&tec=React");
    const allowed = { statuses: ["todos", "concluido"], techs: ["Docker", "React"] };
    expect(parseFilters(url, allowed)).toEqual(f);
    expect(parseFilters("?status=x&tec=Kotlin", allowed)).toEqual(NO_FILTERS);
    expect(serializeFilters(NO_FILTERS)).toBe("");
  });
});
