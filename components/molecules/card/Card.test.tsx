import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Container } from "../container";
import { Card } from "./Card";

afterEach(cleanup);

describe("Card", () => {
  it.each([
    ["s", ["12px", "8px"], ["24px", "4px"]],
    ["m", ["20px", "12px"], ["24px", "4px"]],
    ["l", ["24px", "12px"], ["32px", "4px"]],
  ] as const)("applies inherited %s size to Card and Card child", (size, paddings, radii) => {
    const { container } = render(
      <Container size={size}>
        <Card>
          <Card>Card child</Card>
        </Card>
      </Container>,
    );
    const cards = Array.from(container.querySelectorAll(".numa-card")) as HTMLDivElement[];

    expect(cards).toHaveLength(2);
    expect(cards.map((card) => card.style.padding)).toEqual([...paddings]);
    expect(cards.map((card) => card.style.borderRadius)).toEqual([...radii]);
    expect(cards[0].className).toContain("numa-card--middle");
    expect(cards[1].className).toContain("numa-card--inner");
    expect(cards.map((card) => card.style.getPropertyValue("--numa-tile-surface"))).toEqual([
      "#e2e8f0",
      "#f1f5f9",
    ]);
    expect(cards.map((card) => card.className.match(/numa-tile--surface-level-\d/)?.[0])).toEqual([
      "numa-tile--surface-level-2",
      "numa-tile--surface-level-1",
    ]);
  });

  it("requires a Container parent", () => {
    expect(() => render(<Card>Orphan card</Card>)).toThrow(
      "Card must be placed inside a Container or another Card.",
    );
  });

  it("allows native card links and buttons", () => {
    const onClick = vi.fn();
    const { getByRole, rerender } = render(
      <Container>
        <Card href="/profile">Profile link</Card>
      </Container>,
    );
    expect(getByRole("link", { name: "Profile link" }).getAttribute("href")).toBe("/profile");

    rerender(
      <Container>
        <Card onClick={onClick}>Open profile</Card>
      </Container>,
    );
    fireEvent.click(getByRole("button", { name: "Open profile" }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("allows one nested Card child only", () => {
    expect(() =>
      render(
        <Container>
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
