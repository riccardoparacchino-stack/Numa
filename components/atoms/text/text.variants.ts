import typographyTokens from "../../../tokens/typography/text.json";
import type { FontSizeToken } from "../../../foundation/typography/letter-spacing";

type TypographyTokenName = keyof typeof typographyTokens;
type TypographyCSSValue = TypographyTokenName | string;

type TypographyTokenPair = {
  fontSize: FontSizeToken | string;
  lineHeight: TypographyCSSValue;
};

export const textVariants = {
  label: {
    s: { fontSize: "numa-text-size-3xs", lineHeight: "numa-text-line-height-3xs" },
    m: { fontSize: "numa-text-size-2xs", lineHeight: "numa-text-line-height-2xs" },
    l: { fontSize: "numa-text-size-xs", lineHeight: "numa-text-line-height-xs" },
  },
  body: {
    s: { fontSize: "numa-text-size-3xs", lineHeight: "numa-text-line-height-3xs" },
    m: { fontSize: "numa-text-size-2xs", lineHeight: "numa-text-line-height-2xs" },
    l: { fontSize: "numa-text-size-xs", lineHeight: "numa-text-line-height-xs" },
  },
  title: {
    s: { fontSize: "numa-text-size-xs", lineHeight: "numa-text-line-height-xs" },
    m: { fontSize: "numa-text-size-s", lineHeight: "numa-text-line-height-s" },
  },
  headline: {
    s: { fontSize: "numa-text-size-m", lineHeight: "numa-text-line-height-m" },
    m: { fontSize: "numa-text-size-l", lineHeight: "numa-text-line-height-l" },
  },
  display: {
    s: { fontSize: "numa-text-size-xl", lineHeight: "numa-text-line-height-xl" },
    m: { fontSize: "numa-text-size-2xl", lineHeight: "numa-text-line-height-2xl" },
    l: { fontSize: "numa-text-size-3xl", lineHeight: "numa-text-line-height-3xl" },
  },
  button: {
    s: { fontSize: "0.875rem", lineHeight: "100%" },
    m: { fontSize: "1rem", lineHeight: "100%" },
    l: { fontSize: "1.25rem", lineHeight: "100%" },
    xl: { fontSize: "1.5rem", lineHeight: "100%" },
  },
} as const satisfies Record<string, Record<string, TypographyTokenPair>>;

export type TextVariant = keyof typeof textVariants;
export type TextSize<V extends TextVariant> = keyof (typeof textVariants)[V];

export type TextVariantSize = {
  [V in TextVariant]: { variant: V; size: TextSize<V> };
}[TextVariant];

export const defaultTextWeights: Record<TextVariant, TypographyTokenName> = {
  label: "numa-text-weight-500",
  body: "numa-text-weight-400",
  title: "numa-text-weight-500",
  headline: "numa-text-weight-600",
  display: "numa-text-weight-400",
  button: "numa-text-weight-500",
};

function resolveTypographyValue(value: TypographyCSSValue): string {
  const token = typographyTokens[value as keyof typeof typographyTokens];
  if (token && "$value" in token) {
    const resolved = token.$value;
    if (typeof resolved !== "string") {
      throw new TypeError(`Typography token must resolve to a CSS dimension string: ${value}`);
    }
    return resolved;
  }

  if (typeof value !== "string") {
    throw new TypeError(`Typography value must be a string: ${String(value)}`);
  }

  return value;
}

export function getTypographyTokenValue(name: TypographyTokenName): string | number | string[] {
  const token = typographyTokens[name];
  if (!token || !("$value" in token)) {
    throw new Error(`Missing Foundation typography token: ${name}`);
  }

  return token.$value;
}

export function getTextTypography(variant: string, size: string): {
  fontSizeToken: FontSizeToken | undefined;
  fontSize: string;
  lineHeight: string;
} {
  const variants = textVariants as Record<string, Record<string, TypographyTokenPair>>;
  const pair = variants[variant]?.[size];

  if (!pair) {
    throw new RangeError(`Unsupported Text variant/size combination: ${variant}/${size}`);
  }

  const fontSizeValue = resolveTypographyValue(pair.fontSize);
  const lineHeightValue = resolveTypographyValue(pair.lineHeight);

  if (typeof fontSizeValue !== "string" || typeof lineHeightValue !== "string") {
    throw new TypeError(`Text dimensions must resolve to CSS dimension strings: ${variant}/${size}`);
  }

  return {
    fontSizeToken: pair.fontSize && pair.fontSize.startsWith("numa-text-size-") ? pair.fontSize as FontSizeToken : undefined,
    fontSize: fontSizeValue,
    lineHeight: lineHeightValue,
  };
}

export function getDefaultFontFamily(): string {
  const family = getTypographyTokenValue("numa-text-family-default");
  if (!Array.isArray(family) || family.some((name) => typeof name !== "string")) {
    throw new TypeError("Foundation default font family must be an array of strings.");
  }

  return family.join(", ");
}

export function getDefaultTextWeight(variant: TextVariant): number {
  const weight = getTypographyTokenValue(defaultTextWeights[variant]);
  if (typeof weight !== "number") {
    throw new TypeError(`Foundation default weight for ${variant} must be a number.`);
  }

  return weight;
}
