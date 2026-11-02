import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

describe("Link", () => {
  it("renders a native anchor, forwards attributes, and permits caller styling", () => {
    render(<Link href="/guide" target="_blank" rel="noreferrer" download data-kind="docs" aria-label="Read guide" className="custom" style={{ color: "rebeccapurple" }}>Guide</Link>);
    const link = screen.getByRole("link", { name: "Read guide" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/guide");
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(link.hasAttribute("download")).toBe(true);
    expect(link.getAttribute("data-kind")).toBe("docs");
    expect(link.classList.contains("numa-link") && link.classList.contains("custom")).toBe(true);
    expect(link.style.color).toBe("rebeccapurple");
  });

  it("does not add roles or require href", () => {
    const { container } = render(<Link>Placeholder</Link>);
    expect(container.querySelector("a")?.hasAttribute("role")).toBe(false);
  });
});
