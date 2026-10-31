import primitiveNumbers from "../tokens/primitive/numeric.json";
import semanticRadii from "../tokens/semantic/radius.json";
import semanticSpacing from "../tokens/semantic/spacing.json";

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
