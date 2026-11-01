import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Tile } from "../../molecules/tile";
import { Button } from "./Button";

afterEach(cleanup);

describe("Button", () => {
  it("renders a native button with semantic default behavior", () => {
    const onClick = vi.fn();
    const { getByRole } = render(<Button onClick={onClick}>Save</Button>);
    const button = getByRole("button", { name: "Save" }) as HTMLButtonElement;

    expect(button.tagName).toBe("BUTTON");
    expect(button.type).toBe("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports size and full width styling", () => {
    const { getByRole } = render(
      <Button size="xl" fullWidth variant="outlined">
        Continue
      </Button>,
    );
    const button = getByRole("button", { name: "Continue" }) as HTMLButtonElement;

    expect(button.style.height).toBe("56px");
    expect(button.style.width).toBe("100%");
    expect(button.style.borderWidth).toBe("1px");
    expect(button.style.getPropertyValue("--numa-button-background")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
  });

  it("maps outlined disabled colors through the shared scope tokens", () => {
    const { getByRole } = render(<Button variant="outlined" disabled>Disabled</Button>);
    const button = getByRole("button", { name: "Disabled" });

    expect(button.style.getPropertyValue("--numa-button-border")).toBe(
      "var(--numa-color-interactive-outline-action)",
    );
    expect(button.style.getPropertyValue("--numa-button-text")).toBe(
      "var(--numa-color-interactive-content-action)",
    );
    expect(button.style.getPropertyValue("--numa-button-background")).toBe(
      "var(--numa-color-interactive-surface-disabled)",
    );
    expect(button.style.getPropertyValue("--numa-color-interactive-outline-action")).toBe("#d1d5db");
    expect(button.style.getPropertyValue("--numa-color-interactive-content-action")).toBe("#6b7280");
    expect(button.style.getPropertyValue("--numa-color-context-surface-weak")).toBe("#e5e7eb");
  });

  it("uses Foundation interaction surfaces for hover and active feedback", () => {
    const { getByRole } = render(
      <>
        <Button>Action</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    );
    const action = getByRole("button", { name: "Action" });
    const subtle = getByRole("button", { name: "Subtle" });
    const ghost = getByRole("button", { name: "Ghost" });

    expect(action.style.getPropertyValue("--numa-button-hover-background")).not.toBe(
      action.style.getPropertyValue("--numa-button-background"),
    );
    expect(action.style.getPropertyValue("--numa-button-active-background")).not.toBe(
      action.style.getPropertyValue("--numa-button-hover-background"),
    );
    expect(action.className).toContain("numa-button--action");
    expect(action.style.getPropertyValue("--numa-button-focus-inner")).toBe(
      "var(--numa-color-interactive-outline-focus-on-action-inner)",
    );
    expect(action.style.getPropertyValue("--numa-button-focus-outer")).toBe(
      "var(--numa-color-interactive-outline-focus-on-action-outer)",
    );
    expect(subtle.style.getPropertyValue("--numa-button-hover-background")).not.toBe(
      subtle.style.getPropertyValue("--numa-button-background"),
    );
    expect(subtle.style.getPropertyValue("--numa-button-active-background")).not.toBe(
      subtle.style.getPropertyValue("--numa-button-hover-background"),
    );
    expect(subtle.style.getPropertyValue("--numa-button-background")).toBe(
      "var(--numa-color-interactive-surface-subtle-default)",
    );
    expect(subtle.style.getPropertyValue("--numa-button-hover-background")).toBe(
      "var(--numa-color-interactive-surface-subtle-hover)",
    );
    expect(subtle.style.getPropertyValue("--numa-button-active-background")).toBe(
      "var(--numa-color-interactive-surface-subtle-active)",
    );
    expect(ghost.style.getPropertyValue("--numa-button-hover-background")).toContain("5%");
    expect(ghost.style.getPropertyValue("--numa-button-active-background")).toContain("10%");
  });

  it("inherits disabled mode and uses the shared palette", () => {
    const onClick = vi.fn();
    const { getByRole, getByText } = render(
      <Tile disabled>
        <span style={{ color: "var(--numa-color-accent-content-default)" }}>Decorative label</span>
        <Button disabled={false} onClick={onClick}>Nested action</Button>
      </Tile>,
    );
    const tile = getByText("Decorative label").closest(".numa-tile") as HTMLDivElement;
    const button = getByRole("button", { name: "Nested action" }) as HTMLButtonElement;

    expect(tile.tagName).toBe("DIV");
    expect(tile.style.getPropertyValue("--numa-color-context-surface-weak")).toBe("#e5e7eb");
    expect(tile.style.getPropertyValue("--numa-color-accent-content-default")).toBe("#6b7280");
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.style.getPropertyValue("--numa-color-interactive-surface-action-default")).toBe("#e5e7eb");
    expect(button.style.getPropertyValue("--numa-color-interactive-outline-focus")).toBe("#4338ca");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables duplicate activation while loading and requires an accessible name for icon-only buttons", () => {
    const onClick = vi.fn();
    const { getByRole } = render(
      <Button iconOnly aria-label="Open menu" loading onClick={onClick}>
        ☰
      </Button>,
    );
    const button = getByRole("button", { name: "Open menu" }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });
});
