export const HARMONIC_RATIOS = {
  "Minor Second": 1.067,
  "Major Second": 1.125,
  "Minor Third": 1.2,
  "Major Third": 1.25,
  "Perfect Fourth": 1.333,
  "Perfect Fifth": 1.5,
} as const;

export type HarmonicRatioName = keyof typeof HARMONIC_RATIOS;
export type ContainerMode = "compact" | "relaxed" | "spacious";
export type GeneratedDimension = { padding: number; radius: number };

export const CONTAINER_MODE_BREAKPOINTS = {
  relaxed: 480,
  spacious: 800,
} as const;

export const DEFAULT_BASE_PADDING = 8;
export const DEFAULT_HARMONIC_RATIO = HARMONIC_RATIOS["Minor Third"];
export const DEFAULT_RADIUS_MULTIPLIER = 2;
export const DEFAULT_SCALE_STEPS = 7;
export const CONTAINER_SIZING_STEP_OFFSET = 4;
export const CONTAINER_SCALE_STEPS = CONTAINER_SIZING_STEP_OFFSET + 3;

export const CONTAINER_MODE_STEP_OFFSETS: Record<ContainerMode, number> = {
  compact: 0,
  relaxed: 1,
  spacious: 2,
};

function assertPositiveFinite(value: number, label: string): void {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number.`);
  }
}

function validateSizingInputs({
  basePadding,
  harmonicRatio,
  steps,
  radiusMultiplier,
}: {
  basePadding: number;
  harmonicRatio: number;
  steps: number;
  radiusMultiplier: number;
}): void {
  assertPositiveFinite(basePadding, "Base padding");
  assertPositiveFinite(harmonicRatio, "Harmonic ratio");
  assertPositiveFinite(radiusMultiplier, "Radius multiplier");
  if (!Number.isInteger(steps) || steps <= 0) {
    throw new RangeError("Scale steps must be a positive integer.");
  }
}

export function roundToMultipleOf4(value: number): number {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError("The value must be a non-negative finite number.");
  }
  return Math.round(value / 4) * 4;
}

export function paddingToRadius(
  padding: number,
  radiusMultiplier = DEFAULT_RADIUS_MULTIPLIER,
): number {
  if (!Number.isFinite(padding) || padding < 0) {
    throw new RangeError("Padding must be a non-negative finite number.");
  }
  assertPositiveFinite(radiusMultiplier, "Radius multiplier");
  return roundToMultipleOf4(padding * radiusMultiplier);
}

export function generateDimensionScale({
  basePadding = DEFAULT_BASE_PADDING,
  harmonicRatio = DEFAULT_HARMONIC_RATIO,
  steps = DEFAULT_SCALE_STEPS,
  radiusMultiplier = DEFAULT_RADIUS_MULTIPLIER,
}: {
  basePadding?: number;
  harmonicRatio?: number;
  steps?: number;
  radiusMultiplier?: number;
} = {}): GeneratedDimension[] {
  validateSizingInputs({ basePadding, harmonicRatio, steps, radiusMultiplier });
  const dimensions: GeneratedDimension[] = [];
  for (let step = 0; step < steps; step += 1) {
    const padding = roundToMultipleOf4(basePadding * harmonicRatio ** step);
    const scaledRadius = paddingToRadius(padding, radiusMultiplier);
    const nestedRadius =
      step < 2
        ? 0
        : roundToMultipleOf4(padding + dimensions[step - 2].radius);
    dimensions.push({ padding, radius: Math.max(scaledRadius, nestedRadius) });
  }
  return dimensions;
}

export function modeForContainerWidth(width: number): ContainerMode {
  if (!Number.isFinite(width) || width < 0) {
    throw new RangeError("Container width must be a non-negative finite number.");
  }
  if (width >= CONTAINER_MODE_BREAKPOINTS.spacious) return "spacious";
  if (width >= CONTAINER_MODE_BREAKPOINTS.relaxed) return "relaxed";
  return "compact";
}
