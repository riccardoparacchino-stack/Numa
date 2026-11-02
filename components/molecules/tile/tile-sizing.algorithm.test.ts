import { describe, expect, it } from "vitest";
import { HARMONIC_RATIOS, type ContainerMode } from "../../../foundation/parametric-sizing";
import { generateTileDimensions } from "./tile-sizing";

describe("Tile sizing", () => {
  const modes: ContainerMode[] = ["compact", "relaxed", "spacious"];

  it.each([
    ["compact", [16, 12, 8]],
    ["relaxed", [20, 12, 8]],
    ["spacious", [24, 16, 12]],
  ] as const)("maps %s mode steps to outer, middle, and inner roles", (mode, expected) => {
    const dimensions = generateTileDimensions({ mode });

    expect([
      dimensions.outer.padding,
      dimensions.middle.padding,
      dimensions.inner.padding,
    ]).toEqual(expected);
  });

  it("uses the same generated scale for configurable dimensions", () => {
    const dimensions = generateTileDimensions({
      mode: "relaxed",
      basePadding: 20,
      harmonicRatio: 1.25,
      radiusMultiplier: 1.5,
    });

    expect([
      dimensions.outer.padding,
      dimensions.middle.padding,
      dimensions.inner.padding,
    ]).toEqual([60, 40, 24]);
    expect([
      dimensions.outer.radius,
      dimensions.middle.radius,
      dimensions.inner.radius,
    ]).toEqual([136, 76, 36]);
  });

  it("preserves the nested contour guideline for each harmonic preset and mode", () => {
    for (const harmonicRatio of Object.values(HARMONIC_RATIOS)) {
      for (const mode of modes) {
        const dimensions = generateTileDimensions({ harmonicRatio, mode });

        expect(dimensions.outer.radius).toBeGreaterThanOrEqual(
          dimensions.outer.padding + dimensions.middle.radius,
        );
        expect(dimensions.middle.radius).toBeGreaterThanOrEqual(
          dimensions.middle.padding + dimensions.inner.radius,
        );
      }
    }
  });

  it("rejects insufficient steps for the selected mode and nesting roles", () => {
    expect(() => generateTileDimensions({ mode: "spacious", steps: 6 })).toThrow(RangeError);
  });
});
