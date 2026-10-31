import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import "./ContentCompositor.css";

export type ContentCompositorGap =
  | "numa-spacing-pebbles-xs"
  | "numa-spacing-pebbles-s"
  | "numa-spacing-pebbles-m"
  | "numa-spacing-pebbles-l";

export type ContentCompositorProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "style"
> & {
  leading?: ReactNode;
  children?: ReactNode;
  trailing?: ReactNode;
  footer?: ReactNode;
  as?: "div" | "span";
  layout?: "horizontal" | "vertical";
  gap?: ContentCompositorGap;
  className?: string;
  style?: Omit<CSSProperties, "gap">;
};

function isPresent(value: ReactNode): boolean {
  return value !== undefined && value !== null && value !== false && value !== "";
}

export function ContentCompositor({
  leading,
  children,
  trailing,
  footer,
  as = "div",
  layout = "horizontal",
  gap = "numa-spacing-pebbles-m",
  className,
  style,
  ...elementProps
}: ContentCompositorProps) {
  const hasLeading = isPresent(leading);
  const hasChildren = isPresent(children);
  const hasTrailing = isPresent(trailing);
  const hasFooter = isPresent(footer);
  const gapPx = resolveSpacingPx(gap);
  const classes = ["numa-content-compositor", `numa-content-compositor--${layout}`, className]
    .filter(Boolean)
    .join(" ");
  const resolvedStyle: CSSProperties = {
    gap: `${gapPx}px`,
    ...style,
  };
  const Element = as;

  return (
    <Element {...elementProps} className={classes} style={resolvedStyle}>
      {hasLeading || hasChildren || hasTrailing ? (
        <Element
          className="numa-content-compositor__main"
          style={{ gap: `${gapPx}px` }}
        >
          {hasLeading && <Element className="numa-content-compositor__leading">{leading}</Element>}
          {hasChildren && <Element className="numa-content-compositor__content">{children}</Element>}
          {hasTrailing && <Element className="numa-content-compositor__trailing">{trailing}</Element>}
        </Element>
      ) : null}
      {hasFooter && <Element className="numa-content-compositor__footer">{footer}</Element>}
    </Element>
  );
}
