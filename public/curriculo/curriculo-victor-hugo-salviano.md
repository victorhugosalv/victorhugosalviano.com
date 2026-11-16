# Victor Hugo Salviano Trajano da Silva

Estudante de Ciência da Computação · Engenharia de software e IA

Alagoinha – PB · [contato@victorhugosalviano.com](mailto:contato@victorhugosalviano.com) · [linkedin.com/in/victor-hugo-salviano](https://linkedin.com/in/victor-hugo-salviano) · [github.com/victorhugosalv](https://github.com/victorhugosalv)

## Resumo

Estudante de Ciência da Computação (UFPB) com experiência full stack em equipe (Java/Spring Boot e Next.js/TypeScript) e foco em arquitetura. Desenvolvo com IA (Claude Code) e construo a Docenda, plataforma com LLM para planos de aula.

## Formação

**Licenciatura em Ciência da Computação**, UFPB · jun/2023 – dez/2027 (previsão)

Disciplinas: Inteligência Artificial, Probabilidade e Estatística, Estruturas de Dados, Banco de Dados, Modelagem de Dados, Engenharia de Software, Análise e Projeto de Sistemas, Desenvolvimento de Sistemas Corporativos, Redes de Computadores.

## Projetos

### Docenda · nov/2026 – atual

Plataforma web para criar e avaliar planos de aula de Computação com IA. Em desenvolvimento. Stack planejada: TypeScript, Node.js, React, PostgreSQL, Docker, API da Anthropic.

- Levantei os requisitos com privacidade desde a concepção (LGPD; turma descrita sem identificar alunos) e registrei 6 decisões de arquitetura (ADRs): monólito modular com portas e adaptadores, sessão no servidor e checklist OWASP ASVS nível 1.
- Projetei a integração com LLM: resposta em JSON validado, proteções do OWASP Top 10 para LLM e teto de gasto por usuário.

### Rinha do Campus IV · abr/2026 – mai/2026

Sistema de torneios e inscrições do campus, em equipe. Java, Spring Boot, Spring Security/JWT, PostgreSQL, Flyway, JUnit, Mockito, Next.js, React, TypeScript, Cypress, Docker.

Repositórios: [github.com/gbrlmzl/api-rinha-v2](https://github.com/gbrlmzl/api-rinha-v2) e [github.com/gbrlmzl/site-rinha-v2](https://github.com/gbrlmzl/site-rinha-v2)

- Implementei na API REST o módulo de torneios (rotas públicas, de inscrição e de administração para criar, cancelar e gerenciar equipes), com validações, DTOs e consultas JPA.
- Refatorei os pagamentos para registrar os eventos do webhook do Mercado Pago e adicionei logs com identificador por requisição (MDC).
- Construí no front-end (Next.js) a listagem de torneios, a página do torneio e o painel de administração.
- Escrevi testes da administração de torneios: 17 testes de unidade e de controller com JUnit 5 e Mockito na API e testes E2E com Cypress no front-end (login do admin, criação e cancelamento de torneios, status de pagamento).
- Criei o Dockerfile da API e separei as configurações de dev e prod para o deploy.

## Experiência

### Estágio Supervisionado em Computação (licenciatura) · jun/2026 – atual

- Ministrei aulas no 1º ano do ensino médio, com planos e material próprios aprovados pela professora orientadora.
- Observei aulas em escola municipal (6º e 7º ano, jun/2026 – jul/2026) e escrevi os relatórios.
- Montei um fluxo com Claude Code para gerar planos alinhados à BNCC (instruções de projeto, skills e scripts de verificação gerados pela IA a partir da minha especificação).

### Monitor bolsista de Linguagem de Programação e POO (Java), UFPB · nov/2024 – dez/2025

- Ministrei workshop de Git/GitHub, HTML/CSS e Spring Boot para uma turma, em duas partes (presencial e online).
- Criei o site da monitoria no Google Sites.

## Habilidades

- **Linguagens:** Java, TypeScript, JavaScript, SQL, Python
- **Back-end:** Spring Boot, Spring Security, JPA, Flyway, APIs REST, JWT, Node.js
- **Front-end:** React, Next.js, Tailwind, CSS Modules
- **Dados e infraestrutura:** PostgreSQL, MySQL, Docker, Linux, Git/GitHub
- **Testes:** JUnit, Mockito, Cypress
- **IA no desenvolvimento:** Claude Code (CLAUDE.md, skills, contexto), Spec Kit, engenharia de prompt

## Idiomas

Português nativo; inglês B1.
