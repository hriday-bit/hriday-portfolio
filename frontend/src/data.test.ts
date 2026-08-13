import { describe, expect, it } from "vitest";
import { fallbackProjects } from "./data";

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
});
