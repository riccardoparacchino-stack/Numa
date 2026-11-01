import {
  CONTAINER_MODE_STEP_OFFSETS,
  DEFAULT_BASE_PADDING,
  DEFAULT_HARMONIC_RATIO,
  DEFAULT_RADIUS_MULTIPLIER,
  DEFAULT_SCALE_STEPS,
  generateDimensionScale,
  type ContainerMode,
  type GeneratedDimension,
} from "../../../foundation/parametric-sizing";

export type TileNestingRole = "outer" | "middle" | "inner";

export const TILE_NESTING_STEP_OFFSETS: Record<TileNestingRole, number> = {
  outer: 4,
  middle: 2,
  inner: 0,
};

export type TileDimensions = Record<TileNestingRole, GeneratedDimension>;

export function generateTileDimensions({
  basePadding = DEFAULT_BASE_PADDING,
  harmonicRatio = DEFAULT_HARMONIC_RATIO,
  mode = "compact",
  steps = DEFAULT_SCALE_STEPS,
  radiusMultiplier = DEFAULT_RADIUS_MULTIPLIER,
}: {
  basePadding?: number;
  harmonicRatio?: number;
  mode?: ContainerMode;
  steps?: number;
  radiusMultiplier?: number;
} = {}): TileDimensions {
  const scale = generateDimensionScale({ basePadding, harmonicRatio, steps, radiusMultiplier });
  const dimensions = Object.fromEntries(
    (Object.keys(TILE_NESTING_STEP_OFFSETS) as TileNestingRole[]).map((role) => {
      const step = CONTAINER_MODE_STEP_OFFSETS[mode] + TILE_NESTING_STEP_OFFSETS[role];
      const dimensions = scale[step];
      if (!dimensions) {
        throw new RangeError(
          `Scale steps must include step ${step} required by the ${mode} ${role} Tile.`,
        );
      }
      return [role, dimensions];
    }),
  ) as TileDimensions;
  return dimensions;
}
