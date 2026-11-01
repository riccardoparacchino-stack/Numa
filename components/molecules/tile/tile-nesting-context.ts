import { createContext } from "react";

export type TileSurfaceLevel = "level-1" | "level-2";

export type TileNestingContextValue = {
  depth: number;
  surfaceLevel: TileSurfaceLevel;
};

export const TileNestingContext = createContext<TileNestingContextValue | null>(null);
