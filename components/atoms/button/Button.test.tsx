import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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
      <Button size="xl" fullWidth variant="secondary">
        Continue
      </Button>,
    );
    const button = getByRole("button", { name: "Continue" }) as HTMLButtonElement;

    expect(button.style.height).toBe("56px");
    expect(button.style.width).toBe("100%");
    expect(button.style.borderWidth).toBe("1px");
    expect(button.style.getPropertyValue("--numa-button-background")).toBe("#f1f5f9");
  });

  it("uses the disabled outline token for outlined disabled buttons", () => {
    const { getByRole } = render(<Button variant="secondary" disabled>Disabled</Button>);
    const button = getByRole("button", { name: "Disabled" });

    expect(button.style.getPropertyValue("--numa-button-border")).toBe("#d1d5db");
    expect(button.style.getPropertyValue("--numa-button-text")).toBe("#6b7280");
    expect(button.style.getPropertyValue("--numa-button-background")).toBe("#e5e7eb");
  });

  it("uses Foundation interaction surfaces for hover and active feedback", () => {
    const { getByRole } = render(
      <>
        <Button>Primary</Button>
        <Button variant="subtle">Subtle</Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    );
    const primary = getByRole("button", { name: "Primary" });
    const subtle = getByRole("button", { name: "Subtle" });
    const ghost = getByRole("button", { name: "Ghost" });

    expect(primary.style.getPropertyValue("--numa-button-hover-background")).not.toBe(
      primary.style.getPropertyValue("--numa-button-background"),
    );
    expect(primary.style.getPropertyValue("--numa-button-active-background")).not.toBe(
      primary.style.getPropertyValue("--numa-button-hover-background"),
    );
    expect(subtle.style.getPropertyValue("--numa-button-hover-background")).not.toBe(
      subtle.style.getPropertyValue("--numa-button-background"),
    );
    expect(subtle.style.getPropertyValue("--numa-button-active-background")).not.toBe(
      subtle.style.getPropertyValue("--numa-button-hover-background"),
    );
    expect(subtle.style.getPropertyValue("--numa-button-background")).toBe("#e2e8f0");
    expect(subtle.style.getPropertyValue("--numa-button-hover-background")).toBe("#cbd5e1");
    expect(subtle.style.getPropertyValue("--numa-button-active-background")).toBe("#94a3b8");
    expect(ghost.style.getPropertyValue("--numa-button-hover-background")).toContain("5%");
    expect(ghost.style.getPropertyValue("--numa-button-active-background")).toContain("10%");
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
