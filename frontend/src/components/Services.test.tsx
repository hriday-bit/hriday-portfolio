import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Services } from "./Services";

describe("Services section", () => {
  afterEach(() => { document.body.innerHTML = ""; delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView; delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver; vi.restoreAllMocks(); });

  it("renders four service options and sends quote requests to Contact", () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(globalThis, "IntersectionObserver", { configurable: true, value: class { observe() {} disconnect() {} unobserve() {} } });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    document.body.innerHTML = '<section id="contact"></section>';
    render(<Services />);
    expect(screen.getAllByRole("button", { name: /get a quote/i })).toHaveLength(4);
    fireEvent.click(screen.getAllByRole("button", { name: /get a quote/i })[0]);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });
});
