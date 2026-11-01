import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getSemanticColorStyle } from "../../../foundation/colors/semantic-color-style";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import "./Page.css";

type PageStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

const pagePadding = {
  top: resolveSpacingPx("numa-spacing-walls-xl"),
  inline: resolveSpacingPx("numa-spacing-pebbles-xl"),
  bottom:
    resolveSpacingPx("numa-spacing-walls-xl") +
    resolveSpacingPx("numa-spacing-bricks-l"),
};

export type PageProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "style"
> & {
  children?: ReactNode;
  className?: string;
  style?: PageStyle;
};

export function Page({ children, className, style, ...elementProps }: PageProps) {
  const classes = ["numa-page", className].filter(Boolean).join(" ");
  const pageStyle: PageStyle = {
    ...getSemanticColorStyle(),
    "--numa-page-background": "var(--numa-color-context-background-default)",
    "--numa-page-padding-top": `${pagePadding.top}px`,
    "--numa-page-padding-inline": `${pagePadding.inline}px`,
    "--numa-page-padding-bottom": `${pagePadding.bottom}px`,
    ...style,
  };

  return (
    <div {...elementProps} className={classes} style={pageStyle}>
      {children}
    </div>
  );
}
