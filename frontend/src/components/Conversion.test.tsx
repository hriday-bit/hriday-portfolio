import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { Work } from "./Work";
import { projectStory } from "./Projects";
import { fallbackProjects } from "../data";

describe("recruiter and client conversion content", () => {
  afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

  it("provides clear hero actions and factual primary stack wording", () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    document.body.innerHTML = '<section id="projects"></section><section id="contact"></section>';
    render(<Hero />);
    expect(screen.getByRole("heading", { name: /react, fastapi/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /download résumé/i }).getAttribute("href")).toBe("/Hriday-Saluja-Resume.pdf");
    fireEvent.click(screen.getByRole("button", { name: /view projects/i }));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  it("shows the verified Solar client work with valid proof links", () => {
    render(<Work />);
    expect(screen.getByText("Client Work")).toBeTruthy();
    expect(screen.getByText("Production")).toBeTruthy();
    expect(screen.getByRole("link", { name: /live website/i }).getAttribute("href")).toBe("https://solar-website-api-server.vercel.app/");
    expect(screen.getByRole("link", { name: "GitHub" }).getAttribute("href")).toBe("https://github.com/hriday-bit/solar-website");
  });

  it("keeps factual project case-study fields available", () => {
    const solar = fallbackProjects.find((project) => project.id === "solar-website");
    const caseStudy = projectStory(solar?.description ?? "");
    expect(caseStudy.problem).toBeTruthy();
    expect(caseStudy.solution).toBeTruthy();
    expect(caseStudy.outcome).toBeTruthy();
  });
});
