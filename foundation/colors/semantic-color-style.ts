import type { CSSProperties } from "react";
import primitiveColors from "../../tokens/primitive/color.json";
import semanticColors from "../../tokens/semantic/color.json";

type SemanticColorStyle = CSSProperties & {
  [key: `--numa-color-${string}`]: string;
};

const disabledTokenByScope = {
  background: "numa-color-interactive-background-disabled",
  surface: "numa-color-interactive-surface-disabled",
  content: "numa-color-interactive-content-disabled",
  outline: "numa-color-interactive-outline-disabled",
} as const;

function resolveColor(name: keyof typeof semanticColors): string {
  const token = semanticColors[name];
  if (token.$type !== "color" || typeof token.$value !== "string") {
    throw new TypeError(`Expected a semantic color token: ${name}`);
  }

  const match = /^\{([^{}]+)\}$/.exec(token.$value);
  if (!match) {
    throw new TypeError(`Expected a primitive color alias: ${name}`);
  }

  const primitive = primitiveColors[match[1] as keyof typeof primitiveColors];
  if (!primitive || primitive.$type !== "color" || typeof primitive.$value !== "string") {
    throw new Error(`Missing primitive color referenced by ${name}`);
  }

  return primitive.$value;
}

function getDisabledScope(name: keyof typeof semanticColors): keyof typeof disabledTokenByScope | undefined {
  const scope = name.slice("numa-color-".length).split("-")[1];
  return scope in disabledTokenByScope ? (scope as keyof typeof disabledTokenByScope) : undefined;
}

function buildSemanticColorStyle(disabled: boolean): SemanticColorStyle {
  const style: SemanticColorStyle = {};

  for (const name of Object.keys(semanticColors) as (keyof typeof semanticColors)[]) {
    const token = semanticColors[name];
    if (token.$type !== "color") continue;

    const scope = getDisabledScope(name);
    const preserveFocus = name.includes("-outline-focus");
    const disabledToken = disabled && !preserveFocus && scope
      ? disabledTokenByScope[scope]
      : undefined;
    style[`--${name}`] = resolveColor(disabledToken ?? name);
  }

  return style;
}

const enabledSemanticColorStyle = buildSemanticColorStyle(false);
const disabledSemanticColorStyle = buildSemanticColorStyle(true);

export function getSemanticColorStyle(disabled = false): SemanticColorStyle {
  return disabled ? disabledSemanticColorStyle : enabledSemanticColorStyle;
}

export function semanticColorVariable(name: keyof typeof semanticColors): string {
  return `var(--${name})`;
}
