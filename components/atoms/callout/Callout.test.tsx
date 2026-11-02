import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Callout } from "./Callout";

describe("Callout", () => {
  it("renders neutral content without adding status semantics", () => {
    render(<Callout aria-describedby="note" data-note="true" className="custom" style={{ padding: 24 }}><strong id="note">Remember</strong></Callout>);
    const callout = screen.getByText("Remember").parentElement;
    expect(callout?.tagName).toBe("DIV");
    expect(callout?.getAttribute("aria-describedby")).toBe("note");
    expect(callout?.getAttribute("data-note")).toBe("true");
    expect(callout?.classList.contains("numa-callout") && callout.classList.contains("custom")).toBe(true);
    expect(callout?.style.padding).toBe("24px");
    expect(callout?.hasAttribute("role")).toBe(false);
    expect(callout?.hasAttribute("aria-live")).toBe(false);
  });
});
