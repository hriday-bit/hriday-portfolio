import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Work } from "./Work";
import { projectStory } from "./Projects";
import { fallbackProjects } from "../data";

describe("recruiter and client conversion content", () => {
  afterEach(() => { document.body.innerHTML = ""; });

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
