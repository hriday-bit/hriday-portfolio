import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";
import { Work } from "./Work";

describe("premium motion content remains static-first and accessible", () => {
  beforeEach(() => { vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} }); });
  afterEach(() => { document.body.innerHTML = ""; vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it("renders the factual Solar architecture map before any interaction", () => {
    render(<Work />);
    expect(screen.getByRole("heading", { name: "A production inquiry flow." })).toBeTruthy();
    expect(screen.getByText("React interface")).toBeTruthy();
    expect(screen.getAllByText("FastAPI").length).toBeGreaterThan(0);
    expect(screen.getAllByText("PostgreSQL").length).toBeGreaterThan(0);
    expect(screen.getByText("WhatsApp")).toBeTruthy();
    expect(screen.getByText("Production delivery")).toBeTruthy();

    fireEvent.focus(screen.getByRole("button", { name: /backend service/i }));
    expect(document.querySelector(".node-api")?.classList.contains("is-active")).toBe(true);
  });

  it("marks Home as the initial active navigation destination", () => {
    render(<Navbar theme="dark" setTheme={vi.fn()} />);
    expect(screen.getByRole("button", { name: "home" }).getAttribute("aria-current")).toBe("page");
  });
});
