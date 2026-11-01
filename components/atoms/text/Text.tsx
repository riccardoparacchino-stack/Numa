import {
  createElement,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ElementType,
} from "react";
import {
  getDefaultTextWeight,
  getDefaultFontFamily,
  getTextTypography,
  type TextVariantSize,
} from "./text.variants";
import {
  resolveLetterSpacing,
  type LetterSpacingOption,
} from "../../../foundation/typography/letter-spacing";

export type TextProps<T extends ElementType = "span"> = TextVariantSize & {
  as?: T;
  fontFamily?: CSSProperties["fontFamily"];
  fontWeight?: CSSProperties["fontWeight"];
  fontStyle?: CSSProperties["fontStyle"];
  letterSpacing?: LetterSpacingOption;
  textDecoration?: CSSProperties["textDecoration"];
  color?: CSSProperties["color"];
  style?: Omit<CSSProperties, "fontSize" | "lineHeight" | "letterSpacing">;
} & Omit<
  ComponentPropsWithoutRef<T>,
  | "as"
  | "size"
  | "style"
  | "fontFamily"
  | "fontWeight"
  | "fontStyle"
  | "letterSpacing"
  | "textDecoration"
  | "color"
  | "fontSize"
  | "lineHeight"
  | "variant"
>;

const defaultFontFamily = getDefaultFontFamily();

export function Text<T extends ElementType = "span">(props: TextProps<T>) {
  const {
    as,
    variant,
    size,
    fontFamily,
    fontWeight,
    fontStyle,
    letterSpacing,
    textDecoration,
    color,
    style,
    ...elementProps
  } = props;
  const typography = getTextTypography(variant, size);
  const resolvedWeight = fontWeight ?? getDefaultTextWeight(variant);
  const resolvedLetterSpacing = typography.fontSizeToken
    ? resolveLetterSpacing(typography.fontSizeToken, letterSpacing)
    : "0em";

  const resolvedStyle: CSSProperties = {
    ...style,
    fontFamily: fontFamily ?? defaultFontFamily,
    fontWeight: resolvedWeight,
    fontSize: typography.fontSize,
    lineHeight: typography.lineHeight,
  };

  if (fontStyle !== undefined) resolvedStyle.fontStyle = fontStyle;
  resolvedStyle.letterSpacing = resolvedLetterSpacing;
  if (textDecoration !== undefined) resolvedStyle.textDecoration = textDecoration;
  if (color !== undefined) resolvedStyle.color = color;

  return createElement(as ?? "span", { ...elementProps, style: resolvedStyle });
}
