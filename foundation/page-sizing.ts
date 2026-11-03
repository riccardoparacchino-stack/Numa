import type { ContainerMode } from "./parametric-sizing";
import { resolvePageWidthPx } from "./semantic-dimensions";

export const PAGE_MODE_BREAKPOINTS = {
  relaxed: resolvePageWidthPx("680"),
  spacious: resolvePageWidthPx("1440"),
} as const;

export function modeForPageWidth(width: number): ContainerMode {
  if (!Number.isFinite(width) || width < 0) {
    throw new RangeError("Page width must be a non-negative finite number.");
  }
  if (width >= PAGE_MODE_BREAKPOINTS.spacious) return "spacious";
  if (width >= PAGE_MODE_BREAKPOINTS.relaxed) return "relaxed";
  return "compact";
}
