import primitiveNumbers from "../tokens/primitive/numeric.json";
import semanticRadii from "../tokens/semantic/radius.json";
import semanticSpacing from "../tokens/semantic/spacing.json";
import semanticContainer from "../tokens/semantic/container.json";
import semanticPage from "../tokens/semantic/page.json";

type PrimitiveName = keyof typeof primitiveNumbers;

function resolveDimension<TCollection extends object>(
  name: keyof TCollection,
  collection: TCollection,
): number {
  const token = collection[name] as { $type?: unknown; $value?: unknown } | undefined;
  if (!token || token.$type !== "number") {
    throw new Error(`Missing semantic dimension token: ${String(name)}`);
  }

  if (typeof token.$value !== "string") {
    throw new TypeError(`Expected a primitive alias for semantic dimension: ${String(name)}`);
  }
  const match = /^\{([^{}]+)\}$/.exec(token.$value);
  if (!match) {
    throw new TypeError(`Expected a primitive alias for semantic dimension: ${String(name)}`);
  }

  const primitive = primitiveNumbers[match[1] as PrimitiveName];
  if (!primitive || primitive.$type !== "number" || typeof primitive.$value !== "number") {
    throw new Error(`Missing numeric primitive referenced by semantic dimension: ${String(name)}`);
  }

  return primitive.$value;
}

export function resolveSpacingPx(name: keyof typeof semanticSpacing): number {
  return resolveDimension(name, semanticSpacing);
}

export function resolveRadiusPx(name: keyof typeof semanticRadii): number {
  return resolveDimension(name, semanticRadii);
}

export type ContainerMaxWidth = "compact" | "relaxed" | "spacious";

const containerMaxWidthTokens = {
  compact: "numa-container-max-width-compact",
  relaxed: "numa-container-max-width-relaxed",
  spacious: "numa-container-max-width-spacious",
} as const satisfies Record<ContainerMaxWidth, keyof typeof semanticContainer>;

export function resolveContainerMaxWidthPx(size: ContainerMaxWidth): number {
  return resolveDimension(containerMaxWidthTokens[size], semanticContainer);
}

const containerGapTokens = {
  compact: "numa-container-gap-compact",
  relaxed: "numa-container-gap-relaxed",
  spacious: "numa-container-gap-spacious",
} as const satisfies Record<ContainerMaxWidth, keyof typeof semanticContainer>;

const pageGapTokens = {
  compact: "numa-page-gap-compact",
  relaxed: "numa-page-gap-relaxed",
  spacious: "numa-page-gap-spacious",
} as const satisfies Record<ContainerMaxWidth, keyof typeof semanticPage>;

const pagePaddingTokens = {
  compact: "numa-page-padding-compact",
  relaxed: "numa-page-padding-relaxed",
  spacious: "numa-page-padding-spacious",
} as const satisfies Record<ContainerMaxWidth, keyof typeof semanticPage>;

export type PageBreakpointWidth = "375" | "680" | "1280" | "1440" | "1900";

const pageWidthTokens = {
  "375": "numa-page-width-375",
  "680": "numa-page-width-680",
  "1280": "numa-page-width-1280",
  "1440": "numa-page-width-1440",
  "1900": "numa-page-width-1900",
} as const satisfies Record<PageBreakpointWidth, keyof typeof semanticPage>;

export function resolveContainerGapPx(mode: ContainerMaxWidth): number {
  return resolveDimension(containerGapTokens[mode], semanticContainer);
}

export function resolvePageGapPx(mode: ContainerMaxWidth): number {
  return resolveDimension(pageGapTokens[mode], semanticPage);
}

export function resolvePagePaddingPx(mode: ContainerMaxWidth): number {
  return resolveDimension(pagePaddingTokens[mode], semanticPage);
}

export function resolvePageWidthPx(width: PageBreakpointWidth): number {
  return resolveDimension(pageWidthTokens[width], semanticPage);
}
