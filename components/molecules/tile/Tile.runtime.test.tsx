import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Container } from "../container";
import { Tile } from "./Tile";

afterEach(cleanup);

describe("Tile", () => {
  it("uses generated outer dimensions by default and the middle role in a Container", () => {
    const { getByText, rerender } = render(<Tile>Default Tile</Tile>);
    const defaultTile = getByText("Default Tile").closest(".numa-tile") as HTMLDivElement;

    expect(defaultTile.style.padding).toBe(
      "var(--numa-sizing-selected-step-4-padding, var(--numa-sizing-auto-step-4-padding, 16px))",
    );
    expect(defaultTile.style.borderRadius).toBe(
      "var(--numa-sizing-selected-step-4-radius, var(--numa-sizing-auto-step-4-radius, 44px))",
    );

    rerender(
      <Container mode="spacious">
        <Tile>
          Spacious Tile
          <Tile>Inner Tile</Tile>
        </Tile>
      </Container>,
    );
    const container = getByText("Spacious Tile").closest(".numa-container") as HTMLDivElement;
    const spaciousTile = getByText("Spacious Tile").closest(".numa-tile") as HTMLDivElement;
    const innerTile = getByText("Inner Tile").closest(".numa-tile") as HTMLDivElement;

    expect(container.dataset.mode).toBe("spacious");
    expect(container.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("24px");
    expect(container.style.getPropertyValue("--numa-sizing-selected-step-4-radius")).toBe("68px");
    expect(spaciousTile.className).toContain("numa-tile--nesting-middle");
    expect(spaciousTile.style.padding).toContain("--numa-sizing-selected-step-2-padding");
    expect(innerTile.className).toContain("numa-tile--nesting-inner");
    expect(innerTile.style.padding).toContain("--numa-sizing-selected-step-0-padding");
  });

  it("allows explicit padding overrides without changing generated radius", () => {
    const { getByText } = render(<Tile style={{ padding: "24px" }}>Custom padding</Tile>);
    const tile = getByText("Custom padding").closest(".numa-tile") as HTMLDivElement;

    expect(tile.style.padding).toBe("24px");
    expect(tile.style.borderRadius).toContain("--numa-sizing-selected-step-4-radius");
  });

  it("accepts arbitrary content and nests through outer, middle, and inner roles", () => {
    const { container } = render(
      <Tile>
        <section>
          <p>Any HTML content</p>
          <Tile>
            <Tile>Inner content</Tile>
          </Tile>
        </section>
      </Tile>,
    );
    const tiles = Array.from(container.querySelectorAll(".numa-tile"));

    expect(container.querySelector("section p")?.textContent).toBe("Any HTML content");
    expect(tiles.map((tile) => tile.className.match(/numa-tile--nesting-\w+/)?.[0])).toEqual([
      "numa-tile--nesting-outer",
      "numa-tile--nesting-middle",
      "numa-tile--nesting-inner",
    ]);
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
      "var(--numa-color-context-surface-weak)",
      "var(--numa-color-context-surface-strong)",
      "var(--numa-color-context-surface-weak)",
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

  it("uses a native button for actions and prevents activation when disabled", () => {
    const onClick = vi.fn();
    const { getByRole, rerender } = render(<Tile onClick={onClick}>Save</Tile>);
    const button = getByRole("button", { name: "Save" }) as HTMLButtonElement;

    expect(button.type).toBe("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();

    rerender(
      <Tile onClick={onClick} disabled>
        Save
      </Tile>,
    );
    const disabledButton = getByRole("button", { name: "Save" }) as HTMLButtonElement;
    expect(disabledButton.disabled).toBe(true);
    fireEvent.click(disabledButton);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("inherits disabled colors through nested static Tiles", () => {
    const { container } = render(
      <Tile disabled>
        <Tile>Nested disabled surface</Tile>
      </Tile>,
    );
    const tiles = Array.from(container.querySelectorAll(".numa-tile")) as HTMLDivElement[];

    expect(tiles).toHaveLength(2);
    expect(tiles.map((tile) => tile.style.getPropertyValue("--numa-color-context-background-default"))).toEqual([
      "#f3f4f6",
      "#f3f4f6",
    ]);
    expect(tiles.map((tile) => tile.style.getPropertyValue("--numa-color-context-surface-strong"))).toEqual([
      "#e5e7eb",
      "#e5e7eb",
    ]);
  });

  it("uses a native link and forwards link attributes", () => {
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
    expect(link.style.getPropertyValue("--numa-tile-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
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
