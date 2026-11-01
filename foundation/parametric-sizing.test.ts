import { describe, expect, it } from "vitest";
import {
  DEFAULT_BASE_PADDING,
  DEFAULT_HARMONIC_RATIO,
  HARMONIC_RATIOS,
  CONTAINER_MODE_STEP_OFFSETS,
  generateDimensionScale,
  modeForContainerWidth,
  paddingToRadius,
  roundToMultipleOf4,
} from "./parametric-sizing";

describe("parametric sizing", () => {
  it("supports every harmonic interval and generates padding from scale steps", () => {
    for (const [name, ratio] of Object.entries(HARMONIC_RATIOS)) {
      const sizing = generateDimensionScale({
        basePadding: 8,
        harmonicRatio: ratio,
        steps: 5,
      });
      expect(sizing[0].padding).toBe(roundToMultipleOf4(8));
      expect(sizing[2].padding).toBe(roundToMultipleOf4(8 * ratio ** 2));
      expect(sizing[4].padding).toBe(roundToMultipleOf4(8 * ratio ** 4));
      expect(sizing[4].padding).toBeGreaterThanOrEqual(sizing[2].padding);
      expect(sizing[2].padding).toBeGreaterThanOrEqual(sizing[0].padding);
      for (let step = 2; step < sizing.length; step += 1) {
        expect(sizing[step].radius).toBeGreaterThanOrEqual(
          sizing[step].padding + sizing[step - 2].radius,
        );
      }
      expect(name).not.toBe("");
    }
  });

  it.each([
    ["compact", 0],
    ["relaxed", 1],
    ["spacious", 2],
  ] as const)("applies the %s mode scale-step offset", (mode, offset) => {
    const scale = generateDimensionScale({
      basePadding: 12,
      harmonicRatio: DEFAULT_HARMONIC_RATIO,
      steps: 3,
    });

    expect(scale[offset].padding).toBe(roundToMultipleOf4(12 * DEFAULT_HARMONIC_RATIO ** offset));
  });

  it("supports non-default base padding values", () => {
    const sizing = generateDimensionScale({ basePadding: 20, harmonicRatio: 1.25, steps: 5 });
    expect(sizing[0].padding).toBe(20);
    expect(sizing[2].padding).toBe(32);
    expect(sizing[4].padding).toBe(48);
  });

  it("rounds every generated padding and radius to a multiple of four", () => {
    const scale = generateDimensionScale({ basePadding: 11, harmonicRatio: 1.067 });
    for (const dimensions of scale) {
      expect(dimensions.padding % 4).toBe(0);
      expect(dimensions.radius % 4).toBe(0);
    }
  });

  it("derives radii deterministically from padding and keeps them monotonic", () => {
    const paddings = Array.from({ length: 129 }, (_, index) => index * 4);
    const radii = paddings.map((padding) => paddingToRadius(padding));

    expect(radii).toEqual(paddings.map((padding) => paddingToRadius(padding)));
    expect(radii.every((radius) => radius % 4 === 0)).toBe(true);
    expect(radii.every((radius, index) => index === 0 || radius >= radii[index - 1])).toBe(true);
    expect(paddingToRadius(0)).toBe(0);
  });

  it("rejects invalid or non-positive inputs", () => {
    expect(() => generateDimensionScale({ basePadding: 0 })).toThrow(RangeError);
    expect(() => generateDimensionScale({ harmonicRatio: -1 })).toThrow(RangeError);
    expect(() => generateDimensionScale({ radiusMultiplier: Number.NaN })).toThrow(RangeError);
    expect(() => paddingToRadius(-1)).toThrow(RangeError);
    expect(() => paddingToRadius(8, 0)).toThrow(RangeError);
    expect(() => roundToMultipleOf4(Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it("selects automatic modes by container width", () => {
    expect(modeForContainerWidth(479)).toBe("compact");
    expect(modeForContainerWidth(480)).toBe("relaxed");
    expect(modeForContainerWidth(799)).toBe("relaxed");
    expect(modeForContainerWidth(800)).toBe("spacious");
    expect(() => modeForContainerWidth(-1)).toThrow(RangeError);
  });

  it("uses the documented 8px base padding and minor-third ratio by default", () => {
    const sizing = generateDimensionScale();
    expect(sizing[0].padding).toBe(DEFAULT_BASE_PADDING);
    expect(sizing[4].padding).toBe(16);
    expect(DEFAULT_HARMONIC_RATIO).toBe(HARMONIC_RATIOS["Minor Third"]);
  });

  it("validates the generated scale step count", () => {
    expect(() => generateDimensionScale({ steps: 0 })).toThrow(RangeError);
    expect(() => generateDimensionScale({ steps: 1.5 })).toThrow(RangeError);
  });

  it("uses compact, relaxed, and spacious as initial steps 0, 1, and 2", () => {
    expect(CONTAINER_MODE_STEP_OFFSETS).toEqual({ compact: 0, relaxed: 1, spacious: 2 });
  });
});
