import { describe, expect, it } from "vitest";
import primitiveColors from "../../tokens/primitive/color.json";
import primitivePercentages from "../../tokens/primitive/percentage.json";
import semanticColors from "../../tokens/semantic/color.json";
import typographyTokens from "../../tokens/typography/text.json";
import { getSemanticColorStyle } from "./semantic-color-style";

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

const contextBackgrounds = [
  "numa-color-context-background-sunken",
  "numa-color-context-background-default",
  "numa-color-context-surface-weak",
  "numa-color-context-surface-strong",
] as const;

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

  it("uses explicit color scopes and avoids ordinal color or typography token names", () => {
    const names = Object.keys(semanticColors);
    const allTokenNames = [...names, ...Object.keys(typographyTokens)];

    expect(allTokenNames.every((name) => !/(primary|secondary)/i.test(name))).toBe(true);
    expect(names.every((name) => /-(background|surface|content|outline)-/.test(name))).toBe(true);
  });

  it("uses only the existing percentage primitives for ghost feedback", () => {
    const expected = {
      "numa-color-interactive-surface-ghost-opacity-default": 0,
      "numa-color-interactive-surface-ghost-opacity-hover": 5,
      "numa-color-interactive-surface-ghost-opacity-active": 10,
    } as const;

    for (const [name, value] of Object.entries(expected)) {
      const token = semanticColors[name as keyof typeof semanticColors];
      expect(token.$type).toBe("number");
      const primitive = primitiveTokens.get(getPrimitiveReference(token.$value));
      expect(primitive?.value).toBe(value);
    }
  });

  it("meets WCAG AA contrast for contextual content and interactive content", () => {
    for (const content of [
      "numa-color-context-content-strong",
      "numa-color-context-content-weak",
      "numa-color-interactive-content-action",
      "numa-color-interactive-content-status-success",
      "numa-color-interactive-content-status-warning",
      "numa-color-interactive-content-status-error",
      "numa-color-interactive-content-status-info",
    ] as const) {
      for (const background of contextBackgrounds) {
        expect(getContrastRatio(resolveColor(content), resolveColor(background))).toBeGreaterThanOrEqual(4.5);
      }
    }

    expect(semanticColors["numa-color-accent-content-default"].$value).toBe(
      "{numa-sys-col-teal-800}",
    );
    for (const background of contextBackgrounds) {
      expect(
        getContrastRatio(resolveColor("numa-color-accent-content-default"), resolveColor(background)),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of [
      "numa-color-interactive-surface-action-default",
      "numa-color-interactive-surface-action-hover",
      "numa-color-interactive-surface-action-active",
    ] as const) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-content-on-action"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(4.5);
    }

    for (const surface of [
      "numa-color-interactive-surface-subtle-default",
      "numa-color-interactive-surface-subtle-hover",
      "numa-color-interactive-surface-subtle-active",
    ] as const) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-content-subtle"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("uses one gray token for each disabled scope", () => {
    const disabledAliases = {
      "numa-color-interactive-background-disabled": "{numa-sys-col-gray-100}",
      "numa-color-interactive-surface-disabled": "{numa-sys-col-gray-200}",
      "numa-color-interactive-content-disabled": "{numa-sys-col-gray-500}",
      "numa-color-interactive-outline-disabled": "{numa-sys-col-gray-300}",
    } as const;

    expect(
      Object.keys(semanticColors).filter((name) => name.endsWith("-disabled")),
    ).toEqual(Object.keys(disabledAliases));
    for (const [name, value] of Object.entries(disabledAliases)) {
      expect(semanticColors[name as keyof typeof semanticColors].$value).toBe(value);
    }

    expect(semanticColors["numa-color-interactive-content-disabled"].$value).toBe(
      "{numa-sys-col-gray-500}",
    );
    expect(semanticColors["numa-color-interactive-outline-disabled"].$value).toBe(
      "{numa-sys-col-gray-300}",
    );
  });

  it("maps every semantic color scope to the shared disabled token and preserves focus colors", () => {
    const disabledStyle = getSemanticColorStyle(true);
    const enabledStyle = getSemanticColorStyle(false);
    const disabledColorByScope = {
      background: "#f3f4f6",
      surface: "#e5e7eb",
      content: "#6b7280",
      outline: "#d1d5db",
    } as const;

    for (const name of Object.keys(semanticColors) as (keyof typeof semanticColors)[]) {
      const token = semanticColors[name];
      if (token.$type !== "color") continue;
      const scope = name.slice("numa-color-".length).split("-")[1] as keyof typeof disabledColorByScope;
      const variableName = `--${name}` as keyof typeof disabledStyle;
      const focusToken = name.includes("-outline-focus");

      expect(disabledStyle[variableName]).toBe(
        focusToken ? enabledStyle[variableName] : disabledColorByScope[scope],
      );
    }
  });

  it("keeps focus indicators distinguishable across light, action, and disabled surfaces", () => {
    for (const surface of [
      ...contextBackgrounds,
      "numa-color-interactive-surface-subtle-default",
      "numa-color-interactive-surface-subtle-hover",
      "numa-color-interactive-surface-subtle-active",
      "numa-color-interactive-surface-disabled",
    ] as const) {
      expect(
        getContrastRatio(resolveColor("numa-color-interactive-outline-focus"), resolveColor(surface)),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of [
      "numa-color-interactive-surface-action-default",
      "numa-color-interactive-surface-action-hover",
      "numa-color-interactive-surface-action-active",
    ] as const) {
      expect(
        getContrastRatio(
          resolveColor("numa-color-interactive-outline-focus-on-action-inner"),
          resolveColor(surface),
        ),
      ).toBeGreaterThanOrEqual(3);
    }

    for (const surface of contextBackgrounds) {
      expect(
        getContrastRatio(
          resolveColor("numa-color-interactive-outline-focus-on-action-outer"),
          resolveColor(surface),
        ),
      ).toBeGreaterThanOrEqual(3);
    }
  });
});
