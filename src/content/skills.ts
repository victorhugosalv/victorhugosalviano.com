import type { SkillGroup } from "./types";

/** Skills do site (DESIGN.md; mesmas do PDF, mais HTML, CSS e Tailwind CSS). */
export const skillGroups = [
  {
    title: "Linguagens",
    skills: [
      { name: "Java", brand: "java" },
      { name: "TypeScript", brand: "typescript" },
      { name: "JavaScript", brand: "javascript" },
      { name: "SQL" },
      { name: "Python", brand: "python" },
    ],
  },
  {
    title: "Back-end",
    skills: [
      { name: "Spring Boot", brand: "springboot" },
      { name: "Spring Security", brand: "springsecurity" },
      { name: "JPA" },
      { name: "Flyway", brand: "flyway" },
      { name: "APIs REST" },
      { name: "JWT", brand: "jwt" },
      { name: "Node.js", brand: "nodejs" },
    ],
  },
  {
    title: "Front-end",
    skills: [
      { name: "HTML", brand: "html" },
      { name: "CSS", brand: "css" },
      { name: "React", brand: "react" },
      { name: "Next.js", brand: "nextjs" },
      { name: "Tailwind CSS", brand: "tailwind" },
      { name: "CSS Modules" },
    ],
  },
  {
    title: "Dados e infraestrutura",
    skills: [
      { name: "PostgreSQL", brand: "postgresql" },
      { name: "MySQL", brand: "mysql" },
      { name: "Docker", brand: "docker" },
      { name: "Linux" },
      { name: "Git/GitHub", brand: "git" },
    ],
  },
  {
    title: "Testes",
    skills: [
      { name: "JUnit", brand: "junit" },
      { name: "Mockito" },
      { name: "Cypress", brand: "cypress" },
    ],
  },
  {
    title: "IA no desenvolvimento",
    skills: [
      { name: "Claude Code", brand: "claude" },
      { name: "Spec Kit" },
      { name: "Engenharia de prompt" },
    ],
  },
] as const satisfies readonly SkillGroup[];
