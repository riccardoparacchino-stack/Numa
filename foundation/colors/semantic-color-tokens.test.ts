import { describe, expect, it } from "vitest";
import primitiveColors from "../../tokens/primitive/color.json";
import primitivePercentages from "../../tokens/primitive/percentage.json";
import semanticColors from "../../tokens/semantic/color.json";

const primitiveTokens = new Map<string, { type: string; value: unknown }>();
for (const [name, token] of Object.entries({ ...primitiveColors, ...primitivePercentages })) {
  primitiveTokens.set(name, { type: token.$type, value: token.$value });
}

const primitiveColorValues = new Map<string, string>();
for (const [name, token] of Object.entries(primitiveColors)) {
  primitiveColorValues.set(name, token.$value);
}

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

function resolveColor(name: keyof typeof semanticColors): string {
  const token = semanticColors[name];
  if (token.$type !== "color") {
    throw new TypeError(`Expected a color token: ${name}`);
  }

  const primitive = primitiveColorValues.get(getPrimitiveReference(token.$value));
  if (!primitive) {
    throw new Error(`Missing primitive color referenced by ${name}`);
  }

  return primitive;
}

function getContrastRatio(foreground: string, background: string): number {
  const luminance = (color: string) => {
    const channels = [1, 3, 5].map((index) => Number.parseInt(color.slice(index, index + 2), 16) / 255);
    const linear = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
    );

    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };

  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe("semantic color tokens", () => {
  it.each(Object.entries(semanticColors))(
    "%s aliases an existing primitive of the same type",
    (_name, token) => {
      const reference = getPrimitiveReference(token.$value);
      const primitive = primitiveTokens.get(reference);

      expect(primitive).toBeDefined();
      expect(primitive?.type).toBe(token.$type);
    },
  );

  it("uses the existing percentage primitives for ghost state opacity", () => {
    const expected = {
      "numa-color-interactive-surface-ghost-default-opacity": 0,
      "numa-color-interactive-surface-ghost-hover-opacity": 5,
      "numa-color-interactive-surface-ghost-active-opacity": 10,
      "numa-color-interactive-surface-ghost-selected-opacity": 5,
      "numa-color-interactive-surface-ghost-disabled-opacity": 0,
    } as const;

    for (const [name, value] of Object.entries(expected)) {
      const token = semanticColors[name as keyof typeof semanticColors];
      expect(token.$type).toBe("number");
      const primitive = primitiveTokens.get(getPrimitiveReference(token.$value));
      expect(primitive?.value).toBe(value);
    }
  });

  it("keeps persistent selected surfaces distinct from their defaults", () => {
    expect(resolveColor("numa-color-interactive-surface-primary-selected")).not.toBe(
      resolveColor("numa-color-interactive-surface-primary-default"),
    );
    expect(resolveColor("numa-color-interactive-surface-subtle-selected")).not.toBe(
      resolveColor("numa-color-interactive-surface-subtle-default"),
    );
    expect(
      semanticColors["numa-color-interactive-surface-ghost-selected-opacity"].$value,
    ).not.toBe(
      semanticColors["numa-color-interactive-surface-ghost-default-opacity"].$value,
    );
  });

  it("uses progressively darker subtle surfaces for default, hover, and active states", () => {
    const expected = {
      "numa-color-interactive-surface-subtle-default": "#e2e8f0",
      "numa-color-interactive-surface-subtle-hover": "#cbd5e1",
      "numa-color-interactive-surface-subtle-active": "#94a3b8",
    } as const;

    for (const [name, value] of Object.entries(expected)) {
      expect(resolveColor(name as keyof typeof semanticColors)).toBe(value);
    }

    expect(resolveColor("numa-color-interactive-surface-subtle-default")).not.toBe(
      resolveColor("numa-color-context-surface-level-1"),
    );
    expect(resolveColor("numa-color-interactive-surface-subtle-active")).not.toBe(
      resolveColor("numa-color-interactive-surface-subtle-hover"),
    );
  });

  it("uses the gray palette for disabled surfaces, text, and outlines", () => {
    expect(semanticColors["numa-color-interactive-surface-primary-disabled"].$value).toBe(
      "{numa-sys-col-gray-200}",
    );
    expect(semanticColors["numa-color-interactive-surface-subtle-disabled"].$value).toBe(
      "{numa-sys-col-gray-200}",
    );
    expect(semanticColors["numa-color-interactive-text-disabled"].$value).toBe(
      "{numa-sys-col-gray-500}",
    );
    expect(semanticColors["numa-color-interactive-outline-disabled"].$value).toBe(
      "{numa-sys-col-gray-300}",
    );
    expect(semanticColors["numa-color-interactive-outline-disabled"].$value).not.toBe(
      semanticColors["numa-color-interactive-text-disabled"].$value,
    );
  });

  it("meets WCAG AA text contrast for contextual roles and intended surfaces", () => {
    const backgrounds = [
      "numa-color-context-background-sunken",
      "numa-color-context-background-default",
      "numa-color-context-surface-level-1",
      "numa-color-context-surface-level-2",
    ] as const;
    const textRoles = [
      "numa-color-context-text-primary",
      "numa-color-context-text-secondary",
      "numa-color-context-text-tertiary",
    ] as const;

    for (const text of textRoles) {
      for (const background of backgrounds) {
        expect(getContrastRatio(resolveColor(text), resolveColor(background))).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("meets WCAG AA text contrast for interactive families and states", () => {
    const contextualBackgrounds = [
      "numa-color-context-background-sunken",
      "numa-color-context-background-default",
      "numa-color-context-surface-level-1",
      "numa-color-context-surface-level-2",
    ] as const;
    const primarySurfaces = [
      "numa-color-interactive-surface-primary-default",
      "numa-color-interactive-surface-primary-hover",
      "numa-color-interactive-surface-primary-active",
      "numa-color-interactive-surface-primary-selected",
    ] as const;
    const subtleSurfaces = [
      "numa-color-interactive-surface-subtle-default",
      "numa-color-interactive-surface-subtle-hover",
      "numa-color-interactive-surface-subtle-active",
      "numa-color-interactive-surface-subtle-selected",
    ] as const;

    for (const background of contextualBackgrounds) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-text-primary"), resolveColor(background)),
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-text-ghost"), resolveColor(background)),
      ).toBeGreaterThanOrEqual(4.5);
    }

    for (const surface of primarySurfaces) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-text-on-primary"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(4.5);
    }

    for (const surface of subtleSurfaces) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-text-subtle"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(4.5);
    }

    for (const surface of [
      "numa-color-interactive-surface-primary-disabled",
      "numa-color-interactive-surface-subtle-disabled",
    ] as const) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-outline-disabled"), resolveColor(surface)),
      ).toBeLessThan(3);
    }
  });

  it("keeps focus indicators distinguishable across light, primary, and disabled surfaces", () => {
    const lightSurfaces = [
      "numa-color-context-background-sunken",
      "numa-color-context-background-default",
      "numa-color-context-surface-level-1",
      "numa-color-context-surface-level-2",
      "numa-color-interactive-surface-subtle-default",
      "numa-color-interactive-surface-subtle-hover",
      "numa-color-interactive-surface-subtle-active",
    ] as const;
    const primarySurfaces = [
      "numa-color-interactive-surface-primary-default",
      "numa-color-interactive-surface-primary-hover",
      "numa-color-interactive-surface-primary-active",
      "numa-color-interactive-surface-primary-selected",
    ] as const;

    for (const surface of lightSurfaces) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-outline-focus"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of primarySurfaces) {
      expect(
        getContrastRatio(
          resolveColor("numa-color-interactive-outline-focus-on-primary-inner"),
          resolveColor(surface),
        ),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of [
      "numa-color-context-background-sunken",
      "numa-color-context-background-default",
      "numa-color-context-surface-level-1",
      "numa-color-context-surface-level-2",
    ] as const) {
      expect(
        getContrastRatio(
          resolveColor("numa-color-interactive-outline-focus-on-primary-outer"),
          resolveColor(surface),
        ),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of [
      "numa-color-interactive-surface-primary-disabled",
      "numa-color-interactive-surface-subtle-disabled",
    ] as const) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-outline-focus"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
