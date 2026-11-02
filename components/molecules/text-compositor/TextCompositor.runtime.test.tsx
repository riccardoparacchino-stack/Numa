import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { TextCompositor } from "./TextCompositor";

afterEach(cleanup);

describe("TextCompositor", () => {
  it("renders title and optional description with the default typography", () => {
    const { getByText } = render(
      <TextCompositor title="A title" description="Supporting copy" />,
    );

    expect(getByText("A title").tagName).toBe("SPAN");
    expect(getByText("A title").style.fontSize).toBe("1rem");
    expect(getByText("Supporting copy").tagName).toBe("SPAN");
  });

  it("omits a missing description and its gap", () => {
    const { container } = render(<TextCompositor title="Only title" />);
    const compositor = container.firstElementChild as HTMLSpanElement;

    expect(compositor.children).toHaveLength(1);
    expect(compositor.style.rowGap).toBe("");
  });

  it.each([
    ["start", "start"],
    ["center", "center"],
    ["end", "end"],
  ] as const)("applies logical %s text alignment", (align, expected) => {
    const { container } = render(
      <TextCompositor title="Title" description="Description" align={align} />,
    );

    expect((container.firstElementChild as HTMLSpanElement).style.textAlign).toBe(expected);
  });

  it("resolves its semantic gap to CSS pixels and allows typography customization", () => {
    const { container, getByText } = render(
      <TextCompositor
        title="Title"
        description="Description"
        gap="numa-spacing-pebbles-m"
        titleTypography={{ variant: "headline", size: "s" }}
      />,
    );

    expect((container.firstElementChild as HTMLSpanElement).style.rowGap).toBe("12px");
    expect(getByText("Title").style.fontSize).toBe("1.5rem");
  });

  it("supports natural wrapping, forwards span attributes, and adds no focus stop", () => {
    const { container, getByText } = render(
      <TextCompositor title="A long title" description="A long description" data-testid="copy" />,
    );
    const compositor = container.firstElementChild as HTMLSpanElement;

    expect(compositor.dataset.testid).toBe("copy");
    expect(compositor.style.width).toBe("100%");
    expect(compositor.style.overflowWrap).toBe("anywhere");
    expect(compositor.tabIndex).toBe(-1);
    expect(getByText("A long title").getAttribute("role")).toBeNull();
  });
});
