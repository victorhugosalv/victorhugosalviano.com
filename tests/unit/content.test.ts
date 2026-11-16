import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

import sharp from "sharp";
import { describe, expect, it } from "vitest";

import { about } from "@/content/about";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { sections } from "@/content/sections";
import { skillGroups } from "@/content/skills";
import { timeline } from "@/content/timeline";
import type { SkillGroup } from "@/content/types";
import { brandIcon } from "@/lib/brands";

const groups: readonly SkillGroup[] = skillGroups;

/** O currículo em Markdown publicado no site é a fonte dos fatos. */
const cv = readFileSync(resolve("public/curriculo/curriculo-victor-hugo-salviano.md"), "utf8");
const cvLower = cv.toLowerCase();

describe("conteúdo bate com o curriculo.md", () => {
  it("nome, e-mail e links", () => {
    expect(cv).toContain(profile.fullName);
    expect(cv).toContain(profile.email);
    expect(cv).toContain("github.com/victorhugosalv");
    expect(cv).toContain("linkedin.com/in/victor-hugo-salviano");
    expect(cv).toContain("Estudante de Ciência da Computação · Engenharia de software e IA");
  });

  it("todas as skills do PDF estão no site (o site tem também HTML, CSS e Tailwind CSS)", () => {
    const habilidades = cv.slice(cv.indexOf("## Habilidades"), cv.indexOf("## Idiomas"));
    const site = groups.flatMap((g) => g.skills.map((s) => s.name.toLowerCase()));
    const pdf = [...habilidades.matchAll(/:\*\* (.+)$/gm)]
      .flatMap((m) => (m[1] ?? "").replace(/\s*\([^)]*\)/g, "").split(", "))
      .map((s) => s.trim().toLowerCase());
    const aliases: Record<string, string> = { tailwind: "tailwind css" };
    for (const skill of pdf) expect(site, skill).toContain(aliases[skill] ?? skill);
  });

  it("datas da trajetória e dos projetos aparecem no currículo", () => {
    const dates = [
      ...timeline.flatMap((t) => ("period" in t ? [t.period.start.label, t.period.end.label] : [])),
      ...projects.flatMap((p) => [p.period.start.label, p.period.end.label]),
    ].filter((d) => d !== "atual" && !d.startsWith("set/"));
    for (const d of dates) expect(cvLower, d).toContain(d);
  });

  it("'Minha parte' da Rinha repete os itens do currículo", () => {
    const rinha = projects.find((p) => p.slug === "rinha-do-campus-iv");
    const items =
      rinha && "page" in rinha
        ? rinha.page.sections.flatMap((s) => ("items" in s ? s.items : []))
        : [];
    expect(items).toHaveLength(5);
    for (const item of items) expect(cv, item).toContain(item.replace(/\.$/, ""));
  });

  it("repositórios da Rinha são os do currículo", () => {
    for (const repo of projects[0].repos) expect(cv).toContain(repo.href.replace("https://", ""));
  });

  it("o Sobre cita só fatos do currículo (full stack, linguagens, monitoria de Java, aulas no estágio)", () => {
    const text = about.paragraphs.join(" ");
    expect(text).toContain("full stack");
    expect(cv).toContain("experiência full stack");
    for (const lang of ["Python", "Java", "TypeScript"]) {
      expect(text).toContain(lang);
      expect(cv).toMatch(new RegExp(`Linguagens:\\*\\*.*\\b${lang}\\b`));
    }
    expect(text).toContain("monitor de Java");
    expect(cv).toContain("Monitor bolsista de Linguagem de Programação e POO (Java)");
    expect(text).toContain("dei aulas no estágio");
    expect(cv).toContain("Ministrei aulas no 1º ano do ensino médio");
  });

  it('o Sobre fica sem detalhe técnico, sem cidade e sem "IA no dia a dia"', () => {
    const text = about.paragraphs.join(" ");
    expect(text).not.toMatch(/dockerfile|\bADRs?\b|\btestes\b|dia a dia|alagoinha/i);
  });
});

describe("fatos que saíram do currículo", () => {
  // 16/11: as horas de aula do estágio saíram do PDF; o site não pode citar o número.
  it("nenhum arquivo de content/ cita as horas de aula do estágio", () => {
    const dir = resolve("src/content");
    for (const file of readdirSync(dir)) {
      const text = readFileSync(resolve(dir, file), "utf8");
      expect(text, file).not.toMatch(/\b14\s*(h|horas)\b/i);
    }
    expect(cv).not.toMatch(/\b14\s*h\b/);
  });
});

describe("regras do design", () => {
  it("nenhuma seção tem número", () => {
    for (const s of sections) expect(s.title).not.toMatch(/\d/);
  });

  it("logos só nas skills previstas (sem logo: SQL, JPA, APIs REST, CSS Modules, Linux, Mockito, Spec Kit, Engenharia de prompt)", () => {
    const semLogo = groups
      .flatMap((g) => g.skills)
      .filter((s) => !s.brand || !brandIcon(s.brand))
      .map((s) => s.name);
    expect(semLogo.sort()).toEqual(
      [
        "SQL",
        "JPA",
        "APIs REST",
        "CSS Modules",
        "Linux",
        "Mockito",
        "Spec Kit",
        "Engenharia de prompt",
      ].sort(),
    );
  });

  it("todo projeto tem página (16/11/2026), então todos têm 'Ver mais'", () => {
    expect(projects.filter((p) => "page" in p).map((p) => p.slug)).toEqual(
      projects.map((p) => p.slug),
    );
  });
});

describe("imagens publicadas", () => {
  const dir = resolve("public/images");
  for (const file of readdirSync(dir)) {
    it(`${file} não tem metadados (EXIF, GPS, XMP)`, async () => {
      const meta = await sharp(resolve(dir, file)).metadata();
      expect(meta.exif).toBeUndefined();
      expect(meta.xmp).toBeUndefined();
    });
  }
});
