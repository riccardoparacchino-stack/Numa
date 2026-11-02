import type { CSSProperties, ReactNode, TableHTMLAttributes } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import "./Table.css";

type TableStyle = CSSProperties & { [key: `--${string}`]: string | number | undefined };
export type TableProps = Omit<TableHTMLAttributes<HTMLTableElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function Table({ children, className, style, ...tableProps }: TableProps) {
  const classes = ["numa-table", className].filter(Boolean).join(" ");
  const tableStyle: TableStyle = {
    ...getSemanticColorStyle(),
    "--numa-table-content": semanticColorVariable("numa-color-context-content-strong"),
    "--numa-table-surface": semanticColorVariable("numa-color-context-surface-weak"),
    "--numa-table-header-surface": semanticColorVariable("numa-color-context-surface-strong"),
    "--numa-table-outline": semanticColorVariable("numa-color-context-outline-default"),
    "--numa-table-cell-padding-block": `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
    "--numa-table-cell-padding-inline": `${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
    color: "var(--numa-table-content)",
    ...style,
  };
  return (
    <div className="numa-table__overflow">
      <table {...tableProps} className={classes} style={tableStyle}>{children}</table>
    </div>
  );
}

