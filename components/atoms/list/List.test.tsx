import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { List, ListItem } from "./List";

describe("List", () => {
  afterEach(cleanup);
  it("renders an unordered list by default with native items and forwarded props", () => {
    render(<List aria-label="Principles" data-list="docs" className="custom" style={{ color: "red" }}><ListItem value={2} data-item="one">First</ListItem></List>);
    const list = screen.getByRole("list", { name: "Principles" });
    expect(list.tagName).toBe("UL");
    expect(list.getAttribute("data-list")).toBe("docs");
    expect(list.classList.contains("numa-list") && list.classList.contains("custom")).toBe(true);
    expect(list.style.color).toBe("red");
    expect(screen.getByRole("listitem").getAttribute("data-item")).toBe("one");
  });

  it("supports ordered semantics and React children", () => {
    render(<List listType="ordered" start={4} type="a"><ListItem><strong>Fourth</strong></ListItem></List>);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("start")).toBe("4");
    expect(list.getAttribute("type")).toBe("a");
    expect(screen.getByText("Fourth").tagName).toBe("STRONG");
  });
});
