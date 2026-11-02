import type { AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveRadiusPx } from "../../../foundation/semantic-dimensions";
import "./Link.css";

export type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};
type LinkStyle = CSSProperties & { [key: `--${string}`]: string | number | undefined };

export function Link({ children, className, style, ...anchorProps }: LinkProps) {
  const classes = ["numa-link", className].filter(Boolean).join(" ");
  return (
    <a
      {...anchorProps}
      className={classes}
      style={{
        ...getSemanticColorStyle(),
        "--numa-link-color": semanticColorVariable("numa-color-interactive-content-action"),
        "--numa-link-focus": semanticColorVariable("numa-color-interactive-outline-focus"),
        "--numa-link-radius": `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
        color: "var(--numa-link-color)",
        ...style,
      } as LinkStyle}
    >
      {children}
    </a>
  );
}
