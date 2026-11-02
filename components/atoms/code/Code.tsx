import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import "./Code.css";

type CodeStyle = CSSProperties & { [key: `--${string}`]: string | number | undefined };
type InlineCodeProps = Omit<HTMLAttributes<HTMLElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};
type CodeBlockProps = Omit<HTMLAttributes<HTMLPreElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function codeStyle(style?: CSSProperties): CodeStyle {
  return {
    ...getSemanticColorStyle(),
    "--numa-code-content": semanticColorVariable("numa-color-context-content-strong"),
    "--numa-code-surface": semanticColorVariable("numa-color-context-surface-strong"),
    "--numa-code-radius": `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
    "--numa-code-inline-padding": `${resolveSpacingPx("numa-spacing-pebbles-xs")}px`,
    "--numa-code-block-padding": `${resolveSpacingPx("numa-spacing-pebbles-l")}px`,
    color: "var(--numa-code-content)",
    ...style,
  };
}

export function Code({ children, className, style, ...codeProps }: InlineCodeProps) {
  const classes = ["numa-code", className].filter(Boolean).join(" ");
  return <code {...codeProps} className={classes} style={codeStyle(style)}>{children}</code>;
}

export function CodeBlock({ children, className, style, ...preProps }: CodeBlockProps) {
  const classes = ["numa-code-block", className].filter(Boolean).join(" ");
  return (
    <pre {...preProps} className={classes} style={codeStyle(style)}>
      <code>{children}</code>
    </pre>
  );
}

export type { InlineCodeProps as CodeProps, CodeBlockProps };
