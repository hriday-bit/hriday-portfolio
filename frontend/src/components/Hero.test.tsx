import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Hero, shouldEnhanceHeroScene } from "./Hero";
import { EMAIL, GITHUB_URL, LINKEDIN_URL } from "../content";

describe("Hero", () => {
  afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

  it("keeps the expressive headline, technical positioning, actions, and social controls", () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
    document.body.innerHTML = '<section id="projects"></section><section id="contact"></section>';
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("I build products that earn their place in people’s lives.");
    expect(screen.getByText("Full-Stack Developer · React.js · FastAPI · Spring Boot")).toBeTruthy();
    expect(screen.getByRole("button", { name: "View Projects" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Download Résumé" }).getAttribute("href")).toBe("/Hriday-Saluja-Resume.pdf");
    expect(screen.getByRole("button", { name: "Contact Me" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "View Projects" }));
    fireEvent.click(screen.getByRole("button", { name: "Contact Me" }));
    expect(scrollIntoView).toHaveBeenCalledTimes(2);
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });

    const github = screen.getByRole("link", { name: "Hriday on GitHub" });
    const linkedin = screen.getByRole("link", { name: "Hriday on LinkedIn" });
    expect(github.getAttribute("href")).toBe(GITHUB_URL);
    expect(github.getAttribute("rel")).toBe("noopener noreferrer");
    expect(linkedin.getAttribute("href")).toBe(LINKEDIN_URL);
    expect(linkedin.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.getByRole("link", { name: "Email Hriday" }).getAttribute("href")).toBe(`mailto:${EMAIL}`);
  });

  it("keeps the optional WebGL scene out of reduced-motion, mobile, and unsupported-browser fallbacks", () => {
    expect(shouldEnhanceHeroScene(true, true, true)).toBe(false);
    expect(shouldEnhanceHeroScene(false, false, true)).toBe(false);
    expect(shouldEnhanceHeroScene(false, true, false)).toBe(false);
    expect(shouldEnhanceHeroScene(false, true, true)).toBe(true);
  });
});
