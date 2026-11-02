import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code, CodeBlock } from "./Code";

describe("Code", () => {
  it("renders inline code and preserves React children", () => {
    render(<p>Use <Code data-token="yes"><strong>aria-label</strong></Code></p>);
    expect(screen.getByText("aria-label").tagName).toBe("STRONG");
    expect(screen.getByText("aria-label").closest("code")?.getAttribute("data-token")).toBe("yes");
  });

  it("renders pre/code, preserves whitespace, and forwards pre attributes", () => {
    const { container } = render(<CodeBlock aria-label="Source" className="custom" style={{ width: "20rem" }}>{"one\n  two"}</CodeBlock>);
    const pre = screen.getByLabelText("Source");
    expect(pre.tagName).toBe("PRE");
    expect(pre.classList.contains("numa-code-block") && pre.classList.contains("custom")).toBe(true);
    expect(pre.style.width).toBe("20rem");
    expect(pre.querySelector("code")?.textContent).toBe("one\n  two");
    expect(container.querySelector("pre > code")?.hasAttribute("role")).toBe(false);
  });
});
