import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TextCompositor } from "../text-compositor";
import { Tile } from "./Tile";

afterEach(cleanup);

describe("Tile", () => {
  it.each([
    ["s", "8px", "48px"],
    ["m", "16px", "72px"],
    ["l", "24px", "96px"],
  ] as const)("applies size padding and outer radius for variant %s", (variant, padding, radius) => {
    const { getByText } = render(
      <Tile variant={variant}>
        <TextCompositor title={`${variant} Tile`} />
      </Tile>,
    );
    const tile = getByText(`${variant} Tile`).closest(".numa-tile") as HTMLDivElement;

    expect(tile.tagName).toBe("DIV");
    expect(tile.style.padding).toBe(padding);
    expect(tile.style.borderRadius).toBe(radius);
    expect(tile.className).toContain(`numa-tile--${variant}`);
    expect(tile.className).toContain("numa-tile--surface-level-1");
    expect(tile.style.getPropertyValue("--numa-tile-surface")).toBe("#f1f5f9");
  });

  it("allows explicit padding overrides without changing the Tile size variant", () => {
    const { getByText } = render(
      <Tile variant="s" style={{ padding: "24px" }}>
        Custom padding
      </Tile>,
    );
    const tile = getByText("Custom padding").closest(".numa-tile") as HTMLDivElement;

    expect(tile.className).toContain("numa-tile--s");
    expect(tile.style.padding).toBe("24px");
  });

  it("uses a single generic children slot for nested or custom content", () => {
    const { getByText } = render(
      <Tile variant="s">
        <section>
          <TextCompositor title="Nested composition" />
          <Tile variant="s">A nested Tile</Tile>
        </section>
      </Tile>,
    );

    expect(getByText("Nested composition")).toBeTruthy();
    expect(getByText("A nested Tile").closest(".numa-tile--s")).toBeTruthy();
  });

  it("alternates weak and strong surface levels when Tiles are nested", () => {
    const { container } = render(
      <Tile>
        <Tile>
          <Tile>Nested surface</Tile>
        </Tile>
      </Tile>,
    );
    const tiles = Array.from(container.querySelectorAll(".numa-tile")) as HTMLDivElement[];

    expect(tiles.map((tile) => tile.className.match(/numa-tile--surface-level-\d/)?.[0])).toEqual([
      "numa-tile--surface-level-1",
      "numa-tile--surface-level-2",
      "numa-tile--surface-level-1",
    ]);
    expect(tiles.map((tile) => tile.style.getPropertyValue("--numa-tile-surface"))).toEqual([
      "#f1f5f9",
      "#e2e8f0",
      "#f1f5f9",
    ]);
  });

  it.each([
    ["s", ["24px", "12px", "8px"], ["48px", "24px", "4px"]],
    ["m", ["40px", "20px", "12px"], ["72px", "24px", "4px"]],
    ["l", ["64px", "24px", "12px"], ["96px", "32px", "4px"]],
  ] as const)("applies radius-calculated nested dimensions for %s", (variant, paddings, radii) => {
    const { container } = render(
      <Tile variant={variant} style={{ padding: paddings[0] }}>
        <Tile style={{ padding: paddings[1] }}>
          <Tile style={{ padding: paddings[2] }}>Inner content</Tile>
        </Tile>
      </Tile>,
    );
    const tiles = Array.from(container.querySelectorAll(".numa-tile")) as HTMLDivElement[];

    expect(tiles).toHaveLength(3);
    expect(tiles.map((tile) => tile.style.padding)).toEqual([...paddings]);
    expect(tiles.map((tile) => tile.style.borderRadius)).toEqual([...radii]);
    const [outerRadius, middleRadius, innerRadius] = radii.map((radius) => Number.parseInt(radius, 10));
    const [outerPadding, middlePadding] = paddings.map((padding) => Number.parseInt(padding, 10));
    expect(outerRadius).toBeGreaterThanOrEqual(outerPadding + middleRadius);
    expect(middleRadius).toBeGreaterThanOrEqual(middlePadding + innerRadius);
    expect(tiles.map((tile) => tile.className.match(/numa-tile--nesting-\w+/)?.[0])).toEqual([
      "numa-tile--nesting-outer",
      "numa-tile--nesting-middle",
      "numa-tile--nesting-inner",
    ]);
  });

  it("rejects a fourth nested Tile", () => {
    expect(() =>
      render(
        <Tile>
          <Tile>
            <Tile>
              <Tile>Too deep</Tile>
            </Tile>
          </Tile>
        </Tile>,
      ),
    ).toThrow("Tiles can be nested three levels maximum.");
  });

  it("rejects a nested Tile variant that conflicts with the outer size", () => {
    expect(() =>
      render(
        <Tile variant="m">
          <Tile variant="s">Conflicting size</Tile>
        </Tile>,
      ),
    ).toThrow("Nested Tiles inherit the outer Tile variant.");
  });

  it("uses a native button for actions and prevents activation when disabled", () => {
    const onClick = vi.fn();
    const { getByRole, rerender } = render(<Tile onClick={onClick}>Save</Tile>);
    const button = getByRole("button", { name: "Save" }) as HTMLButtonElement;

    expect(button.type).toBe("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(<Tile onClick={onClick} disabled>Save</Tile>);
    const disabledButton = getByRole("button", { name: "Save" }) as HTMLButtonElement;
    expect(disabledButton.disabled).toBe(true);
    fireEvent.click(disabledButton);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses a native link for navigation and preserves keyboard focusability", () => {
    const { getByRole } = render(
      <Tile href="/details" aria-label="View details" target="_blank" rel="noreferrer">
        Details
      </Tile>,
    );
    const link = getByRole("link", { name: "View details" }) as HTMLAnchorElement;

    expect(link.getAttribute("href")).toBe("/details");
    expect(link.target).toBe("_blank");
    expect(link.rel).toBe("noreferrer");
    expect(link.tabIndex).toBe(0);
    expect(link.className).toContain("numa-tile--interactive");
    expect(link.style.getPropertyValue("--numa-tile-surface")).toBe("#f1f5f9");
  });

  it("forwards content attributes and has no implicit interactive semantics when static", () => {
    const { getByText } = render(
      <Tile data-testid="static-tile" aria-label="Grouped information">
        Static content
      </Tile>,
    );
    const tile = getByText("Static content").closest(".numa-tile") as HTMLDivElement;

    expect(tile.dataset.testid).toBe("static-tile");
    expect(tile.getAttribute("aria-label")).toBe("Grouped information");
    expect(tile.getAttribute("role")).toBeNull();
    expect(tile.tabIndex).toBe(-1);
  });
});
