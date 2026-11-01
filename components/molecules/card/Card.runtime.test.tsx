import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Container } from "../container";
import { Card } from "./Card";

afterEach(cleanup);

describe("Card", () => {
  it("uses generated middle and inner Tile dimensions and alternates surfaces", () => {
    const { container } = render(
      <Container mode="relaxed">
        <Card>
          <Card>Card child</Card>
        </Card>
      </Container>,
    );
    const cards = Array.from(container.querySelectorAll(".numa-card")) as HTMLDivElement[];

    expect(cards).toHaveLength(2);
    expect(cards.map((card) => card.className.match(/numa-card--\w+/)?.[0])).toEqual([
      "numa-card--middle",
      "numa-card--inner",
    ]);
    expect(cards.map((card) => card.style.padding)).toEqual([
      expect.stringContaining("--numa-sizing-selected-step-2-padding"),
      expect.stringContaining("--numa-sizing-selected-step-0-padding"),
    ]);
    expect(cards.map((card) => card.style.borderRadius)).toEqual([
      expect.stringContaining("--numa-sizing-selected-step-2-radius"),
      expect.stringContaining("--numa-sizing-selected-step-0-radius"),
    ]);
    expect(cards.map((card) => card.style.getPropertyValue("--numa-tile-surface"))).toEqual([
      "var(--numa-color-context-surface-strong)",
      "var(--numa-color-context-surface-weak)",
    ]);
    expect(cards.map((card) => card.className.match(/numa-tile--surface-level-\d/)?.[0])).toEqual([
      "numa-tile--surface-level-2",
      "numa-tile--surface-level-1",
    ]);
  });

  it("works inside an arbitrary wrapper without requiring a Container", () => {
    const { getByText } = render(
      <section>
        <Card>Independent card</Card>
      </section>,
    );

    expect(getByText("Independent card").closest(".numa-card")).toBeTruthy();
  });

  it("allows native card links and buttons", () => {
    const onClick = vi.fn();
    const { getByRole, rerender } = render(
      <Container mode="compact">
        <Card href="/profile">Profile link</Card>
      </Container>,
    );
    expect(getByRole("link", { name: "Profile link" }).getAttribute("href")).toBe("/profile");

    rerender(
      <Container mode="compact">
        <Card onClick={onClick}>Open profile</Card>
      </Container>,
    );
    fireEvent.click(getByRole("button", { name: "Open profile" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("allows one nested Card child only", () => {
    expect(() =>
      render(
        <Container mode="compact">
          <Card>
            <Card>
              <Card>Too deep</Card>
            </Card>
          </Card>
        </Container>,
      ),
    ).toThrow("Cards can have one nested card-child level maximum.");
  });
});
