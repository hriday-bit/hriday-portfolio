import { describe, expect, it } from "vitest";
import { fallbackProjects } from "./data";

describe("fallback portfolio projects", () => {
  it("contains the four curated projects and valid GitHub links", () => {
    expect(fallbackProjects).toHaveLength(4);
    expect(fallbackProjects.every((project) => project.githubUrl.startsWith("https://github.com/hriday-bit/"))).toBe(true);
  });

  it("does not expose demo links when no live URLs are configured", () => {
    expect(fallbackProjects.every((project) => project.liveUrl === "")).toBe(true);
  });
});
