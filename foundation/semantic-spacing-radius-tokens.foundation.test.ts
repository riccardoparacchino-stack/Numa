import { describe, expect, it } from "vitest";
import primitiveNumbers from "../tokens/primitive/numeric.json";
import semanticRadii from "../tokens/semantic/radius.json";
import semanticSpacing from "../tokens/semantic/spacing.json";

const semanticTokens = {
  ...semanticSpacing,
  ...semanticRadii,
};

const expectedValues: Record<string, number> = {
  "numa-spacing-pebbles-none": 0,
  "numa-spacing-pebbles-xs": 4,
  "numa-spacing-pebbles-s": 8,
  "numa-spacing-pebbles-m": 12,
  "numa-spacing-pebbles-l": 16,
  "numa-spacing-pebbles-xl": 20,
  "numa-spacing-bricks-s": 24,
  "numa-spacing-bricks-m": 32,
  "numa-spacing-bricks-l": 40,
  "numa-spacing-bricks-xl": 48,
  "numa-spacing-walls-s": 56,
  "numa-spacing-walls-m": 64,
  "numa-spacing-walls-l": 72,
  "numa-spacing-walls-xl": 80,
  "numa-spacing-walls-2xl": 88,
  "numa-spacing-walls-3xl": 96,
  "numa-spacing-stack-compact-vertical": 8,
  "numa-spacing-stack-compact-horizontal": 12,
  "numa-spacing-stack-relaxed-vertical": 12,
  "numa-spacing-stack-relaxed-horizontal": 16,
  "numa-spacing-stack-spacious-vertical": 16,
  "numa-spacing-stack-spacious-horizontal": 24,
  "numa-radius-pebbles-xs": 4,
  "numa-radius-pebbles-s": 8,
  "numa-radius-pebbles-m": 12,
  "numa-radius-bricks-s": 24,
  "numa-radius-bricks-m": 32,
  "numa-radius-bricks-l": 40,
  "numa-radius-walls-s": 48,
  "numa-radius-walls-m": 72,
  "numa-radius-walls-l": 80,
  "numa-radius-walls-xl": 96,
};

function getPrimitiveReference(value: unknown): string {
  if (typeof value !== "string") {
    throw new TypeError("Semantic token values must be primitive aliases.");
  }

  const match = /^\{([^{}]+)\}$/.exec(value);
  if (!match) {
    throw new TypeError(`Expected a primitive alias, received: ${value}`);
  }

  return match[1];
}

describe("semantic spacing and radius tokens", () => {
  it("contains exactly the documented semantic scale", () => {
    expect(Object.keys(semanticTokens).sort()).toEqual(Object.keys(expectedValues).sort());
  });

  it.each(Object.entries(semanticTokens))(
    "%s aliases the matching existing numeric primitive",
    (name, token) => {
      expect(token.$type).toBe("number");

      const reference = getPrimitiveReference(token.$value) as keyof typeof primitiveNumbers;
      const primitive = primitiveNumbers[reference];
      expect(primitive).toBeDefined();
      expect(primitive.$type).toBe(token.$type);
      expect(primitive.$value).toBe(expectedValues[name]);
    },
  );

  it("keeps the standard spacing scale on the 4px grid and omits the 2px primitive", () => {
    const spacingValues = Object.entries(semanticSpacing)
      .filter(([name]) => !name.endsWith("-none"))
      .map(([, token]) => {
        const reference = getPrimitiveReference(token.$value) as keyof typeof primitiveNumbers;
        return primitiveNumbers[reference].$value;
      });

    expect(spacingValues.every((value) => value % 4 === 0)).toBe(true);
    expect(Object.values(semanticSpacing).some((token) => token.$value === "{numa-sys-int-2}")).toBe(
      false,
    );
  });
});
