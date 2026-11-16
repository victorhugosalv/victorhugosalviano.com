export type Header = [name: string, value: string];
export interface HeaderRule {
  re: RegExp;
  headers: Header[];
}
export function parseHeaderRules(text: string): HeaderRule[];
export function forLan(headers: Header[]): Header[];
