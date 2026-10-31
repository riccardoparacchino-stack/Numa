import typographyTokens from "../../tokens/typography/text.json";

export const letterSpacingOptions = ["compact", "relaxed", "spacious"] as const;

export type LetterSpacingOption = (typeof letterSpacingOptions)[number];
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
  const sizeMatch = /^numa-text-size-(\d+)$/.exec(fontSizeToken);
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
