import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Projects } from "./Projects";

describe("Projects filmstrip fallback", () => {
  afterEach(() => { document.body.innerHTML = ""; vi.unstubAllGlobals(); vi.restoreAllMocks(); });

  it("keeps every project and proof action in the static document order without desktop animation eligibility", () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
    vi.stubGlobal("IntersectionObserver", class { observe() {} unobserve() {} disconnect() {} });
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => undefined)));
    render(<Projects />);
    expect(document.querySelector(".projects-filmstrip-enabled")).toBeNull();
    expect(screen.getAllByRole("article")).toHaveLength(4);
    expect(screen.getAllByRole("link", { name: "GitHub" })).toHaveLength(4);
    expect(screen.getByRole("link", { name: "Live demo" }).getAttribute("href")).toBe("https://solar-website-api-server.vercel.app/");
  });
});
