/** Textos da interface (rótulos, nomes acessíveis). Todo texto visível mora em content/. */
export const ui = {
  skipLink: "Pular para o conteúdo",
  nav: {
    label: "Navegação principal",
    menuTitle: "Navegação",
    home: "Início",
    homeButton: "Voltar ao início",
    logo: "VHS",
    logoLabel: "VHS, Victor Hugo Salviano: início",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    contactButton: "Ir para os contatos",
  },
  theme: {
    toLight: "Modo claro",
    toDark: "Modo escuro",
    toLightLabel: "Mudar para o modo claro",
    toDarkLabel: "Mudar para o modo escuro",
  },
  footer: {
    privacy: "Sem cookies e sem rastreamento",
    copyright: "© 2026 Victor Hugo Salviano",
  },
} as const;

export const contactTexts = {
  copy: "Copiar e-mail",
  copied: "E-mail copiado",
  copyFailed: "Não deu para copiar; o endereço está acima",
} as const;
