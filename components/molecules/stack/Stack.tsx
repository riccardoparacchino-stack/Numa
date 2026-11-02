import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useContext } from "react";
import type { ContainerMode } from "../../../foundation/parametric-sizing";
import { resolveStackSpacingPx } from "../../../foundation/stack-spacing";
import { ContainerModeContext } from "../container/container-mode-context";
import "./Stack.css";

export type StackDirection = "vertical" | "horizontal" | "wrap-column" | "wrap-row";

export type StackProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  direction?: StackDirection;
  mode?: ContainerMode;
  className?: string;
  style?: CSSProperties;
};

const flexDirections: Record<
  StackDirection,
  { flexDirection: "row" | "column"; flexWrap: "nowrap" | "wrap" }
> = {
  vertical: { flexDirection: "column", flexWrap: "nowrap" },
  horizontal: { flexDirection: "row", flexWrap: "nowrap" },
  "wrap-column": { flexDirection: "column", flexWrap: "wrap" },
  "wrap-row": { flexDirection: "row", flexWrap: "wrap" },
};

export function Stack({
  children,
  direction = "vertical",
  mode,
  className,
  style,
  ...elementProps
}: StackProps) {
  const inheritedMode = useContext(ContainerModeContext) ?? "compact";
  const effectiveMode = mode ?? inheritedMode;
  const layout = flexDirections[direction];
  if (!layout) {
    throw new RangeError(`Unsupported Stack direction: ${String(direction)}`);
  }
  const { flexDirection, flexWrap } = layout;
  const verticalGap = resolveStackSpacingPx(effectiveMode, "vertical");
  const horizontalGap = resolveStackSpacingPx(effectiveMode, "horizontal");

  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection,
    flexWrap,
    rowGap: direction === "horizontal" ? 0 : verticalGap,
    columnGap: direction === "vertical" ? 0 : horizontalGap,
    minWidth: 0,
    boxSizing: "border-box",
    ...style,
  };

  const classes = ["numa-stack", className].filter(Boolean).join(" ");

  return (
    <div
      {...elementProps}
      className={classes}
      style={containerStyle}
      data-direction={direction}
      data-effective-mode={effectiveMode}
    >
      {children}
    </div>
  );
}
