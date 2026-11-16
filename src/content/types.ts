/** Tipos dos dados do site. Os componentes recebem estes tipos; nunca dados soltos. */

export interface Section {
  /** id do elemento na página (âncora #id) */
  readonly id: string;
  /** nome na página, na navegação e nos menus */
  readonly title: string;
  /** aparece na pílula do desktop (Contatos vira o botão flutuante) */
  readonly inDesktopNav: boolean;
}
