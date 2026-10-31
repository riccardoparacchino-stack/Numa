import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Text, type TextProps } from "../../atoms/text";
import type { TextVariantSize } from "../../atoms/text/text.variants";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";

export type TextCompositorGap =
  | "numa-spacing-pebbles-xs"
  | "numa-spacing-pebbles-s"
  | "numa-spacing-pebbles-m"
  | "numa-spacing-pebbles-l";

export type TextCompositorStyle = Omit<
  CSSProperties,
  "display" | "flexDirection" | "gap" | "rowGap" | "textAlign" | "width"
>;

export type TextCompositorProps = Omit<
  HTMLAttributes<HTMLSpanElement>,
  "align" | "children" | "className" | "style"
> & {
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center" | "end";
  gap?: TextCompositorGap;
  titleTypography?: TextVariantSize;
  descriptionTypography?: TextVariantSize;
  titleTextProps?: Omit<TextProps, "children" | "variant" | "size">;
  descriptionTextProps?: Omit<TextProps, "children" | "variant" | "size">;
  className?: string;
  style?: TextCompositorStyle;
};

const defaultTitleTypography: TextVariantSize = { variant: "title", size: "s" };
const defaultDescriptionTypography: TextVariantSize = { variant: "body", size: "m" };

export function TextCompositor({
  title,
  description,
  align = "start",
  gap = "numa-spacing-pebbles-xs",
  titleTypography = defaultTitleTypography,
  descriptionTypography = defaultDescriptionTypography,
  titleTextProps,
  descriptionTextProps,
  className,
  style,
  ...elementProps
}: TextCompositorProps) {
  const hasDescription =
    description !== undefined && description !== null && description !== false && description !== "";
  const gapPx = resolveSpacingPx(gap);

  const resolvedStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    overflowWrap: "anywhere",
    width: "100%",
    textAlign: align,
    ...(hasDescription ? { rowGap: `${gapPx}px` } : {}),
    ...style,
  };

  return (
    <span {...elementProps} className={className} style={resolvedStyle}>
      <Text {...titleTextProps} {...titleTypography}>
        {title}
      </Text>
      {hasDescription ? (
        <Text {...descriptionTextProps} {...descriptionTypography}>
          {description}
        </Text>
      ) : null}
    </span>
  );
}
