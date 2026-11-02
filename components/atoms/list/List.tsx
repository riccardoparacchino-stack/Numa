import type { CSSProperties, HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode } from "react";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";

export type ListType = "unordered" | "ordered";
type ListCommonProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};
export type ListProps = ListCommonProps & (
  | (Omit<HTMLAttributes<HTMLUListElement>, "children" | "className" | "style"> & { listType?: "unordered" })
  | (Omit<OlHTMLAttributes<HTMLOListElement>, "children" | "className" | "style"> & { listType: "ordered" })
);

export function List({ listType = "unordered", children, className, style, ...listProps }: ListProps) {
  const Element = listType === "ordered" ? "ol" : "ul";
  const classes = ["numa-list", className].filter(Boolean).join(" ");
  return (
    <Element
      {...listProps}
      className={classes}
      style={{
        display: "grid",
        rowGap: `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
        paddingInlineStart: `${resolveSpacingPx("numa-spacing-bricks-s")}px`,
        ...style,
      }}
    >
      {children}
    </Element>
  );
}

export type ListItemProps = Omit<LiHTMLAttributes<HTMLLIElement>, "children" | "className" | "style"> & {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ListItem({ children, className, style, ...itemProps }: ListItemProps) {
  const classes = ["numa-list__item", className].filter(Boolean).join(" ");
  return <li {...itemProps} className={classes} style={{ minWidth: 0, ...style }}>{children}</li>;
}
