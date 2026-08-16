import { describe, expect, it } from "vitest";
import { fallbackProjects } from "./data";
import { availability, LINKEDIN_URL, services } from "./content";

describe("fallback portfolio projects", () => {
  it("contains the four curated projects and valid GitHub links", () => {
    expect(fallbackProjects).toHaveLength(4);
    expect(fallbackProjects.every((project) => project.githubUrl.startsWith("https://github.com/hriday-bit/"))).toBe(true);
  });

  it("exposes the deployed Solar Website demo and hides unspecified demos", () => {
    const solarWebsite = fallbackProjects.find((project) => project.id === "solar-website");
    expect(solarWebsite?.liveUrl).toBe("https://solar-website-api-server.vercel.app/");
    expect(fallbackProjects.filter((project) => project.id !== "solar-website").every((project) => project.liveUrl === "")).toBe(true);
  });

  it("uses Problem, Solution, and Result stories for every project", () => {
    expect(fallbackProjects.every((project) => /Problem:.*Solution:.*Result:/.test(project.description))).toBe(true);
  });

  it("defines the recruiter and client conversion content in one editable location", () => {
    expect(services).toHaveLength(4);
    expect(services.map((service) => service.title)).toContain("Business Websites");
    expect(LINKEDIN_URL).toBe("https://linkedin.com/in/hriday-saluja-1a2562384");
    expect(availability).toContain("full-time");
    expect(availability).toContain("full-time");
  });
});
