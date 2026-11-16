# victorhugosalviano.com

Site pessoal e currículo de Victor Hugo Salviano: estudante de Ciência da Computação (UFPB), engenharia de software e IA.

Site estático feito com **Next.js 16** (App Router com `output: 'export'`), **React 19** e **TypeScript 6** estrito. Não há servidor: o `next build` gera HTML, CSS e JS na pasta `out/`, servida como arquivos estáticos pela Cloudflare.

## Rodar

```bash
npm ci
npm run dev        # desenvolvimento em http://localhost:3000
npm run build      # gera out/
npm run preview    # serve out/ com os cabeçalhos de public/_headers
```

## Verificações

| Script                 | O que faz                                                                     |
| ---------------------- | ----------------------------------------------------------------------------- |
| `npm run typecheck`    | TypeScript estrito (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`) |
| `npm run lint`         | ESLint (Next, TypeScript e jsx-a11y no modo _strict_), sem avisos             |
| `npm run format:check` | Prettier                                                                      |
| `npm test`             | Vitest: hooks e tokens                                                        |
| `npm run test:e2e`     | Playwright: teclado, menus, tema, responsividade e axe nos dois temas         |
| `npm run check:rules`  | Regras de arquitetura (abaixo)                                                |
| `npm run check`        | Tudo acima, mais o build                                                      |

## Arquitetura

```
src/
├── app/          rotas (só composição)
├── content/      dados tipados do site (textos, skills, projetos); nada de JSX
├── hooks/        lógica (tema, menus, foco, seção ativa); nada de estilo
├── lib/          utilidades sem React
├── styles/       tokens.css (os dois temas), reset e cores das marcas
└── components/
    ├── ui/        peças genéricas (Button, Chip, SkillTag…), não conhecem o currículo
    ├── layout/    navegação, rodapé, link de pular
    ├── sections/  seções da página inicial
    └── project/   página de projeto
```

Regras (conferidas por `npm run check:rules`):

1. Camadas com uma direção só: `app` → `sections`/`project`/`layout` → `ui`. `content` e `hooks` não importam componentes; `ui` não importa `content`.
2. Variação por props, nunca por CSS de fora: componentes de `ui` não aceitam `className`; quem posiciona é o pai, com `Stack`, `Cluster` e `Grid`. Sem `!important` e sem `style=` inline.
3. Todo texto visível mora em `content/`. Adicionar um projeto ou skill é editar dados, sem tocar em componente.
4. CSS Modules + variáveis CSS. Trocar o tema é trocar o valor das variáveis (`data-theme` no `<html>`), definido antes da página aparecer para não piscar.

## Acessibilidade

Meta: WCAG 2.2 AA. HTML semântico, link "Pular para o conteúdo", foco visível, menus pelo teclado (setas, Esc, foco preso), contraste AA nos dois temas, área de toque de 44 px e respeito a `prefers-reduced-motion` e `prefers-reduced-transparency`. O axe roda em todas as páginas, nos dois temas, a cada teste.

## Privacidade

Sem cookies, sem analytics e sem nada de terceiros: fontes, imagens e logos são servidos pelo próprio site. A preferência de tema fica no `localStorage` do navegador. As imagens passam por um script que remove os metadados (EXIF/GPS).

## Licença

O código está sob a licença MIT (veja `LICENSE`). Textos, foto, currículo e imagens dos projetos não fazem parte da licença.
