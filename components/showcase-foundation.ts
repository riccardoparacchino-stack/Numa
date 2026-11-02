import type { CSSProperties } from "react";
import { resolveRadiusPx, resolveSpacingPx } from "../foundation/semantic-dimensions";
import { getDefaultFontFamily } from "./atoms/text/text.variants";

type ShowcaseFoundationStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

/** Shared CSS dimension aliases for showcase-only layout, resolved from Foundation. */
export const showcaseFoundationStyle: ShowcaseFoundationStyle = {
  fontFamily: getDefaultFontFamily(),
  "--showcase-space-pebbles-xs": `${resolveSpacingPx("numa-spacing-pebbles-xs")}px`,
  "--showcase-space-pebbles-s": `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
  "--showcase-space-pebbles-m": `${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
  "--showcase-space-pebbles-l": `${resolveSpacingPx("numa-spacing-pebbles-l")}px`,
  "--showcase-space-pebbles-xl": `${resolveSpacingPx("numa-spacing-pebbles-xl")}px`,
  "--showcase-space-bricks-s": `${resolveSpacingPx("numa-spacing-bricks-s")}px`,
  "--showcase-space-bricks-m": `${resolveSpacingPx("numa-spacing-bricks-m")}px`,
  "--showcase-space-bricks-l": `${resolveSpacingPx("numa-spacing-bricks-l")}px`,
  "--showcase-space-bricks-xl": `${resolveSpacingPx("numa-spacing-bricks-xl")}px`,
  "--showcase-space-walls-s": `${resolveSpacingPx("numa-spacing-walls-s")}px`,
  "--showcase-space-walls-m": `${resolveSpacingPx("numa-spacing-walls-m")}px`,
  "--showcase-space-walls-l": `${resolveSpacingPx("numa-spacing-walls-l")}px`,
  "--showcase-space-walls-xl": `${resolveSpacingPx("numa-spacing-walls-xl")}px`,
  "--showcase-radius-pebbles-xs": `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
  "--showcase-radius-pebbles-s": `${resolveRadiusPx("numa-radius-pebbles-s")}px`,
  "--showcase-radius-pebbles-m": `${resolveRadiusPx("numa-radius-pebbles-m")}px`,
  "--showcase-radius-bricks-s": `${resolveRadiusPx("numa-radius-bricks-s")}px`,
};
