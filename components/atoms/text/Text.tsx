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
  resolveResponsiveTypography,
  type LetterSpacingOption,
} from "../../../foundation/typography/letter-spacing";
import { useContext } from "react";
import { ContainerModeContext } from "../../molecules/container/container-mode-context";

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
  const responsiveMode = useContext(ContainerModeContext);
  const resolvedWeight = fontWeight ?? getDefaultTextWeight(variant);
  const responsiveDimensions = responsiveMode && typography.fontSizeToken
    ? resolveResponsiveTypography(typography.fontSizeToken, typography.fontSize, typography.lineHeight, responsiveMode)
    : undefined;
  const resolvedLetterSpacing = typography.fontSizeToken
    ? resolveLetterSpacing(typography.fontSizeToken, letterSpacing ?? responsiveMode)
    : "0em";

  const resolvedStyle: CSSProperties = {
    ...style,
    fontFamily: fontFamily ?? defaultFontFamily,
    fontWeight: resolvedWeight,
    fontSize: responsiveDimensions?.fontSize ?? typography.fontSize,
    lineHeight: responsiveDimensions?.lineHeight ?? typography.lineHeight,
  };

  if (fontStyle !== undefined) resolvedStyle.fontStyle = fontStyle;
  resolvedStyle.letterSpacing = resolvedLetterSpacing;
  if (textDecoration !== undefined) resolvedStyle.textDecoration = textDecoration;
  if (color !== undefined) resolvedStyle.color = color;

  return createElement(as ?? "span", { ...elementProps, style: resolvedStyle });
}
