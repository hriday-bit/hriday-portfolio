import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";

describe("About animation fallback", () => {
  afterEach(() => { document.body.innerHTML = ""; });

  it("renders factual counter values when IntersectionObserver is unavailable", () => {
    render(<About />);
    expect(screen.getByText("Featured projects").previousElementSibling?.textContent).toBe("4");
    expect(screen.getByText("Service areas").previousElementSibling?.textContent).toBe("4");
    expect(screen.getByText("Part primary stack").previousElementSibling?.textContent).toBe("4");
  });
});
