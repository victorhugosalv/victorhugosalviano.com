/**
 * Variáveis da coleção "Cor" do Figma (arquivo asAtp13sr2bKULK5Wr71fk), lidas pelo MCP do Figma
 * em 15/11/2026 nos nós 25:763 (escuro) e 26:987 (claro). Atualize junto com o Figma.
 * Os ícones (sol, lua, conversa) e o degradê da foto são as variáveis novas da navegação v5.
 */
export const figmaColors = {
  dark: {
    "--color-bg": "#0e0e10",
    "--color-bg-glass": "rgb(14 14 16 / 0.72)",
    "--color-surface": "#17171a",
    "--color-surface-2": "#202024",
    "--color-line": "#2e2e33",
    "--color-text": "#ededed",
    "--color-text-muted": "#a0a0a6",
    "--color-red": "#e0243a",
    "--color-red-text": "#f5475b",
    "--color-gold": "#c9a44c",
    "--color-on-red": "#ffffff",
    "--color-icon-sun": "#fbbf24",
    "--color-icon-moon": "#22d3ee",
    "--color-chat": "#25d366",
    "--photo-fade": "1",
  },
  light: {
    "--color-bg": "#f3efe6",
    "--color-bg-glass": "rgb(243 239 230 / 0.78)",
    "--color-surface": "#fbf9f4",
    "--color-surface-2": "#e9e2d4",
    "--color-line": "#d8cfbf",
    "--color-text": "#161514",
    "--color-text-muted": "#5f5a52",
    "--color-red": "#c8102e",
    "--color-red-text": "#c8102e",
    "--color-gold": "#7d6019",
    "--color-on-red": "#ffffff",
    "--color-icon-sun": "#b45309",
    "--color-icon-moon": "#0e7490",
    "--color-chat": "#128c7e",
    "--photo-fade": "0.8",
  },
  space: [2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 120],
  radius: { sm: 4, md: 6, lg: 10 },
} as const;
