import { type ContainerMode } from "./parametric-sizing";
import { resolveSpacingPx } from "./semantic-dimensions";

export const STACK_SPACING_TOKENS = {
  vertical: {
    compact: "numa-spacing-stack-compact-vertical",
    relaxed: "numa-spacing-stack-relaxed-vertical",
    spacious: "numa-spacing-stack-spacious-vertical",
  },
  horizontal: {
    compact: "numa-spacing-stack-compact-horizontal",
    relaxed: "numa-spacing-stack-relaxed-horizontal",
    spacious: "numa-spacing-stack-spacious-horizontal",
  },
} as const;

export type StackGapAxis = keyof typeof STACK_SPACING_TOKENS;

export function resolveStackSpacingPx(mode: ContainerMode, axis: StackGapAxis): number {
  return resolveSpacingPx(STACK_SPACING_TOKENS[axis][mode]);
}
