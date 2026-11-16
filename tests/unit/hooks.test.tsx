import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { useDisclosure } from "@/hooks/useDisclosure";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import {
  HOVER_CLOSE_DELAY,
  HOVER_OPEN_DELAY,
  useHoverDisclosure,
} from "@/hooks/useHoverDisclosure";
import { useMenuButton } from "@/hooks/useMenuButton";
import { useTheme } from "@/hooks/useTheme";
import { THEME_STORAGE_KEY } from "@/lib/theme";

describe("useTheme", () => {
  it("lê o tema do <html> e troca entre escuro e claro, guardando a escolha", async () => {
    document.documentElement.setAttribute("data-theme", "dark");
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    await act(async () => result.current.toggleTheme());
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(result.current.theme).toBe("light");
    await act(async () => result.current.toggleTheme());
    expect(result.current.theme).toBe("dark");
  });
});

describe("useDisclosure", () => {
  it("abre, fecha e alterna, com um id para o aria-controls", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.panelId).toBeTruthy();
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(false);
    act(() => result.current.toggle());
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });
});

function Trap({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, active);
  return (
    <>
      <button type="button">fora</button>
      <div ref={ref}>
        <button type="button">um</button>
        <button type="button">dois</button>
        <button type="button">três</button>
      </div>
    </>
  );
}

describe("useFocusTrap", () => {
  it("foca o primeiro item e o Tab circula só dentro", () => {
    render(<Trap active />);
    const [um, , tres] = ["um", "dois", "três"].map((n) => screen.getByRole("button", { name: n }));
    expect(document.activeElement).toBe(um);
    tres?.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(document.activeElement).toBe(um);
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(tres);
  });

  it("não faz nada enquanto inativo", () => {
    render(<Trap active={false} />);
    expect(document.activeElement).toBe(document.body);
  });
});

function Menu() {
  const { isOpen, buttonProps, menuProps, getItemProps } = useMenuButton(3);
  return (
    <>
      <button {...buttonProps}>baixar</button>
      <div {...menuProps}>
        {["PDF", "MD", "TXT"].map((label, i) => (
          <a key={label} href={`#${label}`} {...getItemProps(i)}>
            {label}
          </a>
        ))}
      </div>
      <span data-testid="estado">{isOpen ? "aberto" : "fechado"}</span>
    </>
  );
}

describe("useMenuButton", () => {
  const item = (name: string) => screen.getByRole("menuitem", { name, hidden: true });

  it("↓ abre no primeiro item; setas, Home e End navegam; Esc fecha e devolve o foco", () => {
    render(<Menu />);
    const button = screen.getByRole("button", { name: "baixar" });
    expect(button.getAttribute("aria-haspopup")).toBe("menu");
    expect(button.getAttribute("aria-expanded")).toBe("false");

    fireEvent.keyDown(button, { key: "ArrowDown" });
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(document.activeElement).toBe(item("PDF"));

    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item("MD"));
    fireEvent.keyDown(menu, { key: "End" });
    expect(document.activeElement).toBe(item("TXT"));
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(item("PDF"));
    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(document.activeElement).toBe(item("TXT"));
    fireEvent.keyDown(menu, { key: "Home" });
    expect(document.activeElement).toBe(item("PDF"));

    fireEvent.keyDown(menu, { key: "Escape" });
    expect(screen.getByTestId("estado").textContent).toBe("fechado");
    expect(document.activeElement).toBe(button);
  });

  it("↑ abre no último item e o clique fora fecha", () => {
    render(<Menu />);
    const button = screen.getByRole("button", { name: "baixar" });
    fireEvent.keyDown(button, { key: "ArrowUp" });
    expect(document.activeElement).toBe(item("TXT"));
    fireEvent.pointerDown(document.body);
    expect(screen.getByTestId("estado").textContent).toBe("fechado");
  });

  it("o clique no botão alterna o menu", () => {
    render(<Menu />);
    const button = screen.getByRole("button", { name: "baixar" });
    fireEvent.click(button);
    expect(screen.getByTestId("estado").textContent).toBe("aberto");
    fireEvent.click(button);
    expect(screen.getByTestId("estado").textContent).toBe("fechado");
  });
});

function HoverMenu() {
  const { isOpen, panelId, rootRef, buttonRef, toggle, rootProps } =
    useHoverDisclosure<HTMLDivElement>();
  return (
    <>
      <div ref={rootRef} data-testid="raiz" {...rootProps}>
        <button ref={buttonRef} type="button" aria-expanded={isOpen} onClick={toggle}>
          seta
        </button>
        <ul id={panelId} hidden={!isOpen}>
          <li>
            <a href="#um">um</a>
          </li>
        </ul>
      </div>
      <button type="button">fora</button>
    </>
  );
}

describe("useHoverDisclosure", () => {
  const seta = () => screen.getByRole("button", { name: "seta" });

  it("abre e fecha com o mouse depois de um atraso; o toque não abre", () => {
    vi.useFakeTimers();
    try {
      render(<HoverMenu />);
      const raiz = screen.getByTestId("raiz");
      fireEvent.pointerEnter(raiz, { pointerType: "touch" });
      act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY));
      expect(seta().getAttribute("aria-expanded")).toBe("false");

      fireEvent.pointerEnter(raiz, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(HOVER_OPEN_DELAY - 1));
      expect(seta().getAttribute("aria-expanded")).toBe("false");
      act(() => vi.advanceTimersByTime(1));
      expect(seta().getAttribute("aria-expanded")).toBe("true");

      // sair e voltar antes do atraso não fecha
      fireEvent.pointerLeave(raiz, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY - 1));
      fireEvent.pointerEnter(raiz, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY));
      expect(seta().getAttribute("aria-expanded")).toBe("true");

      fireEvent.pointerLeave(raiz, { pointerType: "mouse" });
      act(() => vi.advanceTimersByTime(HOVER_CLOSE_DELAY));
      expect(seta().getAttribute("aria-expanded")).toBe("false");
    } finally {
      vi.useRealTimers();
    }
  });

  it("a seta alterna; Esc fecha e devolve o foco; o foco saindo fecha", () => {
    render(<HoverMenu />);
    fireEvent.click(seta());
    expect(seta().getAttribute("aria-expanded")).toBe("true");
    const link = screen.getByRole("link", { name: "um" });
    link.focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(seta().getAttribute("aria-expanded")).toBe("false");
    expect(document.activeElement).toBe(seta());

    fireEvent.click(seta());
    const fora = screen.getByRole("button", { name: "fora" });
    fireEvent.blur(seta(), { relatedTarget: fora });
    expect(seta().getAttribute("aria-expanded")).toBe("false");
  });
});
