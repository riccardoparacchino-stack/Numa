import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Card } from "../card";
import { Tile } from "../tile";
import { Container } from "./Container";

afterEach(cleanup);

describe("Container", () => {
  it.each([
    ["s", "24px", "48px"],
    ["m", "40px", "72px"],
    ["l", "64px", "96px"],
  ] as const)("applies page-surface dimensions for size %s", (size, padding, radius) => {
    const { getByText } = render(<Container size={size}>Page content</Container>);
    const container = getByText("Page content").closest(".numa-container") as HTMLDivElement;

    expect(container.tagName).toBe("DIV");
    expect(container.style.padding).toBe(padding);
    expect(container.style.borderRadius).toBe(radius);
    expect(container.className).toContain(`numa-tile--${size}`);
    expect(container.className).toContain("numa-tile--surface-level-1");
    expect(container.style.getPropertyValue("--numa-tile-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
    expect(container.style.getPropertyValue("--numa-color-context-surface-weak")).toBe("#f1f5f9");
  });

  it("supports page composition such as fieldsets and nested cards", () => {
    const { getByRole, getByText } = render(
      <Container>
        <fieldset>
          <legend>Profile</legend>
          <Card>Contact details</Card>
        </fieldset>
      </Container>,
    );

    expect(getByRole("group", { name: "Profile" })).toBeTruthy();
    expect(getByText("Contact details").closest(".numa-card")).toBeTruthy();
  });

  it("uses weak Container, strong Card, then weak Card-child surfaces", () => {
    const { container } = render(
      <Container>
        <Card>
          <Card>Child card</Card>
        </Card>
      </Container>,
    );
    const surfaces = Array.from(container.querySelectorAll(".numa-tile")) as HTMLDivElement[];

    expect(surfaces.map((surface) => surface.style.getPropertyValue("--numa-tile-surface"))).toEqual([
      "var(--numa-color-context-surface-weak)",
      "var(--numa-color-context-surface-strong)",
      "var(--numa-color-context-surface-weak)",
    ]);
  });

  it("forwards page container attributes and allows padding customization", () => {
    const { getByText } = render(
      <Container data-testid="page-container" style={{ padding: "32px" }}>
        Page
      </Container>,
    );
    const container = getByText("Page").closest(".numa-container") as HTMLDivElement;

    expect(container.dataset.testid).toBe("page-container");
    expect(container.style.padding).toBe("32px");
  });

  it("rejects nested Containers and Containers inside low-level Tiles", () => {
    expect(() => render(<Container><Container>Nested</Container></Container>)).toThrow(
      "Container must be a top-level page surface, not nested inside another surface.",
    );
    expect(() => render(<Tile><Container>Nested in Tile</Container></Tile>)).toThrow(
      "Container must be a top-level page surface, not nested inside another surface.",
    );
  });
});
