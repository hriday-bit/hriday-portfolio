import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { ScrollProgress } from "./ScrollProgress";

describe("ScrollProgress", () => {
  afterEach(() => { document.body.innerHTML = ""; vi.restoreAllMocks(); });

  it("renders an accessible decorative progress indicator", () => {
    render(<ScrollProgress />);
    const progress = document.querySelector(".scroll-progress");
    expect(progress?.getAttribute("aria-hidden")).toBe("true");
    expect(progress?.querySelector("span")?.getAttribute("style")).toContain("scaleX");
  });
});
