import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  CONTAINER_MODE_STEP_OFFSETS,
  CONTAINER_SCALE_STEPS,
  CONTAINER_SIZING_STEP_OFFSET,
  generateDimensionScale,
} from "../../../foundation/parametric-sizing";
import { getSemanticColorStyle } from "../../../foundation/colors/semantic-color-style";
import { Tile } from "../tile";
import { Container } from "./Container";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Container", () => {
  it.each(["compact", "relaxed", "spacious"] as const)(
    "exposes an explicit %s sizing environment",
    (mode) => {
      const { getByText } = render(<Container mode={mode}>Page content</Container>);
      const container = getByText("Page content").closest(".numa-container") as HTMLDivElement;

      expect(container.tagName).toBe("DIV");
      expect(container.dataset.mode).toBe(mode);
      expect(container.style.getPropertyValue("--numa-sizing-scale-step-0-padding")).toBe("8px");
      expect(container.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).not.toBe("");
      expect(container.className).toBe("numa-container");
      expect(container.getAttribute("role")).toBeNull();
      expect(container.dataset.effectiveMode).toBe(mode);
    },
  );

  it("uses the former outer Tile dimensions and semantic surface", () => {
    const basePadding = 12;
    const harmonicRatio = 1.5;
    const radiusMultiplier = 3;
    const mode = "relaxed";
    const scale = generateDimensionScale({
      basePadding,
      harmonicRatio,
      radiusMultiplier,
      steps: CONTAINER_SCALE_STEPS,
    });
    const expected =
      scale[CONTAINER_MODE_STEP_OFFSETS[mode] + CONTAINER_SIZING_STEP_OFFSET];
    const { getByText } = render(
      <Container
        mode={mode}
        basePadding={basePadding}
        harmonicRatio={harmonicRatio}
        radiusMultiplier={radiusMultiplier}
      >
        Container sizing
      </Container>,
    );
    const container = getByText("Container sizing").closest(".numa-container") as HTMLDivElement;

    expect(container.style.padding).toBe(`${expected?.padding}px`);
    expect(container.style.borderRadius).toBe(`${expected?.radius}px`);
    expect(container.style.boxSizing).toBe("border-box");
    expect(container.style.getPropertyValue("--numa-container-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
    expect(container.style.getPropertyValue("--numa-container-border")).toBe(
      "var(--numa-color-context-outline-subtle)",
    );
    expect(container.style.getPropertyValue("--numa-container-shadow")).toBe(
      "0px 8px 32px -12px color-mix(in srgb, var(--numa-color-context-shadow-subtle) 20%, transparent)",
    );
    expect(container.style.getPropertyValue("--numa-color-context-shadow-subtle")).toBe(
      getSemanticColorStyle()["--numa-color-context-shadow-subtle"],
    );
    expect(container.style.getPropertyValue("--numa-color-context-surface-weak")).toBe(
      getSemanticColorStyle()["--numa-color-context-surface-weak"],
    );
  });

  it.each(["compact", "relaxed", "spacious"] as const)(
    "changes its own dimensions for the explicit %s mode",
    (mode) => {
      const { getByText } = render(<Container mode={mode}>{mode} container</Container>);
      const container = getByText(`${mode} container`).closest(".numa-container") as HTMLDivElement;
      const expected = generateDimensionScale({ steps: CONTAINER_SCALE_STEPS })[
        CONTAINER_MODE_STEP_OFFSETS[mode] + CONTAINER_SIZING_STEP_OFFSET
      ];

      expect(container.style.padding).toBe(`${expected?.padding}px`);
      expect(container.style.borderRadius).toBe(`${expected?.radius}px`);
    },
  );

  it("updates its own auto sizing mode from its observed inline width", () => {
    let activeObserver: MockResizeObserver | undefined;
    class MockResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {
        activeObserver = this;
      }

      observe() {}
      disconnect() {}

      trigger() {
        const observer: ResizeObserver = {
          observe() {},
          unobserve() {},
          disconnect() {},
        };
        this.callback([], observer);
      }
    }
    vi.stubGlobal("ResizeObserver", MockResizeObserver);

    const { getByText } = render(<Container>Observed sizing</Container>);
    const container = getByText("Observed sizing").closest(".numa-container") as HTMLDivElement;
    Object.defineProperty(container, "clientWidth", { configurable: true, value: 520 });
    act(() => activeObserver?.trigger());

    expect(container.dataset.mode).toBe("auto");
    expect(container.dataset.effectiveMode).toBe("relaxed");
    const expected = generateDimensionScale({ steps: CONTAINER_SCALE_STEPS })[
      CONTAINER_MODE_STEP_OFFSETS.relaxed + CONTAINER_SIZING_STEP_OFFSET
    ];
    expect(container.style.padding).toBe(`${expected?.padding}px`);
  });

  it("uses automatic mode when omitted and permits nested generic containers", () => {
    const { getByText } = render(
      <Container>
        <section>
          <Container mode="relaxed">Nested content</Container>
        </section>
      </Container>,
    );
    const nested = getByText("Nested content").closest(".numa-container") as HTMLDivElement;

    expect(document.querySelectorAll(".numa-container")).toHaveLength(2);
    expect(nested.dataset.mode).toBe("relaxed");
    expect(nested.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("20px");
  });

  it("keeps nested Containers independent as sizing boundaries", () => {
    const { getByText } = render(
      <Container>
        <Container mode="spacious">Nested container</Container>
      </Container>,
    );
    const outer = document.querySelector(".numa-container") as HTMLDivElement;
    const nested = getByText("Nested container").closest(".numa-container") as HTMLDivElement;

    expect(outer.dataset.mode).toBe("auto");
    expect(nested.dataset.mode).toBe("spacious");
    expect(outer.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("initial");
    expect(nested.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("24px");
    expect(outer.dataset.variant).toBeUndefined();
    expect(outer.style.getPropertyValue("--numa-container-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
    expect(outer.style.borderRadius).not.toBe("");
  });

  it("forwards HTML attributes and preserves user layout styles", () => {
    const { getByText } = render(
      <Container data-testid="page-container" style={{ maxWidth: "640px" }}>
        Page
      </Container>,
    );
    const container = getByText("Page").closest(".numa-container") as HTMLDivElement;

    expect(container.dataset.testid).toBe("page-container");
    expect(container.style.maxWidth).toBe("640px");
    expect(container.style.width).toBe("100%");
  });

  it("keeps explicit modes independent of width and applies custom scale settings", () => {
    const { getByText } = render(
      <>
        <Container mode="compact" basePadding={12} harmonicRatio={1.5} style={{ maxWidth: "320px" }}>
          Narrow
        </Container>
        <Container mode="compact" basePadding={12} harmonicRatio={1.5} style={{ maxWidth: "960px" }}>
          Wide
        </Container>
      </>,
    );
    const narrow = getByText("Narrow").closest(".numa-container") as HTMLDivElement;
    const wide = getByText("Wide").closest(".numa-container") as HTMLDivElement;

    expect(narrow.dataset.mode).toBe("compact");
    expect(wide.dataset.mode).toBe("compact");
    expect(narrow.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("60px");
    expect(wide.style.getPropertyValue("--numa-sizing-selected-step-4-padding")).toBe("60px");
  });

  it("uses the weak, strong, weak surface progression across Container and nested Tiles", () => {
    const { getByText } = render(
      <Container mode="relaxed">
        <Tile>
          Middle tile
          <Tile>Final inner tile</Tile>
        </Tile>
      </Container>,
    );
    const container = getByText("Final inner tile").closest(".numa-container") as HTMLDivElement;
    const middle = getByText("Middle tile").closest(".numa-tile") as HTMLDivElement;
    const inner = getByText("Final inner tile").closest(".numa-tile") as HTMLDivElement;

    expect(container.className).toBe("numa-container");
    expect(container.style.getPropertyValue("--numa-container-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
    expect(middle.className).toContain("numa-tile--nesting-middle");
    expect(middle.className).toContain("numa-tile--surface-level-2");
    expect(middle.style.padding).toContain("--numa-sizing-selected-step-2-padding");
    expect(middle.style.getPropertyValue("--numa-tile-surface")).toBe(
      "var(--numa-color-context-surface-strong)",
    );
    expect(inner.className).toContain("numa-tile--nesting-inner");
    expect(inner.className).toContain("numa-tile--surface-level-1");
    expect(inner.style.padding).toContain("--numa-sizing-selected-step-0-padding");
    expect(inner.style.getPropertyValue("--numa-tile-surface")).toBe(
      "var(--numa-color-context-surface-weak)",
    );
  });

  it("keeps the inner Tile as the final level inside a Container", () => {
    expect(() =>
      render(
        <Container>
          <Tile>
            <Tile>
              <Tile>Beyond inner</Tile>
            </Tile>
          </Tile>
        </Container>,
      ),
    ).toThrow("Tiles can be nested three levels maximum.");
  });
});
