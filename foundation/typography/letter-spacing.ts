import typographyTokens from "../../tokens/typography/text.json";

export const letterSpacingOptions = ["compact", "relaxed", "spacious"] as const;

export type LetterSpacingOption = (typeof letterSpacingOptions)[number];
export type ResponsiveTypographyMode = LetterSpacingOption;
export const TYPOGRAPHY_HARMONIC_RATIOS: Record<ResponsiveTypographyMode, number> = {
  compact: 1.125,
  relaxed: 1.2,
  spacious: 1.25,
};
export type FontSizeToken = Extract<keyof typeof typographyTokens, `numa-text-size-${string}`>;

type TokenName = keyof typeof typographyTokens;

function getTokenValue(name: TokenName): string | number | string[] {
  const token = typographyTokens[name];
  if (!token || !("$value" in token)) {
    throw new Error(`Missing Foundation typography token: ${name}`);
  }

  return token.$value;
}

export function resolveLetterSpacing(
  fontSizeToken: FontSizeToken,
  option: LetterSpacingOption = "relaxed",
): string {
  const sizeMatch = /^numa-text-size-(3xs|2xs|xs|s|m|l|xl|2xl|3xl)$/.exec(fontSizeToken);
  if (!sizeMatch) {
    throw new RangeError(`Unsupported Foundation font-size token: ${fontSizeToken}`);
  }

  const tokenName = `numa-text-letter-spacing-${option}-${sizeMatch[1]}` as TokenName;
  const value = getTokenValue(tokenName);
  if (typeof value !== "string" || !/^-?\d+(?:\.\d+)?em$/.test(value)) {
    throw new TypeError(`Foundation letter-spacing token must be an em dimension: ${tokenName}`);
  }

  return value;
}

const sizeSteps: Record<string, number> = {
  "3xs": -2,
  "2xs": -1,
  xs: 0,
  s: 1,
  m: 2,
  l: 3,
  xl: 4,
  "2xl": 5,
  "3xl": 6,
};

/** Apply the selected harmonic progression while keeping the default text size at 16px. */
export function resolveResponsiveTypography(
  fontSizeToken: FontSizeToken,
  baseFontSize: string,
  baseLineHeight: string,
  mode: ResponsiveTypographyMode,
): { fontSize: string; lineHeight: string } {
  const match = /^numa-text-size-(3xs|2xs|xs|s|m|l|xl|2xl|3xl)$/.exec(fontSizeToken);
  if (!match) throw new RangeError(`Unsupported Foundation font-size token: ${fontSizeToken}`);
  const fontSizePx = Number.parseFloat(baseFontSize) * (baseFontSize.endsWith("rem") ? 16 : 1);
  const lineHeightPx = Number.parseFloat(baseLineHeight) * (baseLineHeight.endsWith("rem") ? 16 : 1);
  const step = sizeSteps[match[1]];
  const scaledFontSize = 16 * TYPOGRAPHY_HARMONIC_RATIOS[mode] ** step;
  const lineHeightRatio = lineHeightPx / fontSizePx;
  return {
    fontSize: `${scaledFontSize / 16}rem`,
    lineHeight: `${(scaledFontSize * lineHeightRatio) / 16}rem`,
  };
}

export function resolveAbsoluteLetterSpacing(fontSizePx: number, emValue: string): number {
  const match = /^(-?\d+(?:\.\d+)?)em$/.exec(emValue);
  if (!match) {
    throw new TypeError(`Expected an em letter-spacing value, received: ${emValue}`);
  }
  if (!Number.isFinite(fontSizePx) || fontSizePx < 0) {
    throw new RangeError(`Font size must be a non-negative finite number: ${fontSizePx}`);
  }

  return fontSizePx * Number(match[1]);
}
