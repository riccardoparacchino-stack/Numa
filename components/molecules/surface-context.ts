import { createContext } from "react";
import { resolveSpacingPx } from "../../foundation/semantic-dimensions";
import type { TileVariant } from "./tile/Tile";

export type SurfaceComposition = {
  size: TileVariant;
  cardDepth: number;
  surfaceLevel: "level-1" | "level-2";
};

export const SurfaceCompositionContext = createContext<SurfaceComposition | null>(null);

export const containerPadding: Record<TileVariant, string> = {
  s: `${resolveSpacingPx("numa-spacing-bricks-s")}px`,
  m: `${resolveSpacingPx("numa-spacing-bricks-l")}px`,
  l: `${resolveSpacingPx("numa-spacing-walls-m")}px`,
};

export const cardPadding: Record<TileVariant, { middle: string; inner: string }> = {
  s: {
    middle: `${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
    inner: `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
  },
  m: {
    middle: `${resolveSpacingPx("numa-spacing-pebbles-xl")}px`,
    inner: `${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
  },
  l: {
    middle: `${resolveSpacingPx("numa-spacing-bricks-s")}px`,
    inner: `${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
  },
};
