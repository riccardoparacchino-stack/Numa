import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import "./Callout.css";

type CalloutStyle = CSSProperties & { [key: `--${string}`]: string | number | undefined };
export type CalloutProps = Omit<HTMLAttributes<HTMLDivElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Callout({ children, className, style, ...elementProps }: CalloutProps) {
  const classes = ["numa-callout", className].filter(Boolean).join(" ");
  const calloutStyle: CalloutStyle = {
    ...getSemanticColorStyle(),
    "--numa-callout-surface": semanticColorVariable("numa-color-context-surface-weak"),
    "--numa-callout-content": semanticColorVariable("numa-color-context-content-strong"),
    "--numa-callout-outline": semanticColorVariable("numa-color-context-outline-default"),
    "--numa-callout-radius": `${resolveRadiusPx("numa-radius-pebbles-s")}px`,
    "--numa-callout-padding": `${resolveSpacingPx("numa-spacing-pebbles-l")}px`,
    color: "var(--numa-callout-content)",
    ...style,
  };
  return <div {...elementProps} className={classes} style={calloutStyle}>{children}</div>;
}
