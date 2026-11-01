import type {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from "react";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import primitiveColors from "../../../tokens/primitive/color.json";
import primitivePercentages from "../../../tokens/primitive/percentage.json";
import semanticColors from "../../../tokens/semantic/color.json";
import { Text } from "../text/Text";
import "./Button.css";

export const buttonSizes = ["s", "m", "l", "xl"] as const;
export const buttonVariants = ["primary", "secondary", "subtle", "ghost"] as const;

export type ButtonSize = (typeof buttonSizes)[number];
export type ButtonVariant = (typeof buttonVariants)[number];

type ButtonCommonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "type"> & {
  children?: ReactNode;
  label?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  iconOnly?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className?: string;
  style?: CSSProperties;
};

export type ButtonProps = ButtonCommonProps;

type ButtonTokenSet = {
  background: string;
  backgroundHover: string;
  backgroundActive: string;
  backgroundDisabled: string;
  text: string;
  textDisabled: string;
  border: string;
  borderHover: string;
  borderActive: string;
  borderDisabled: string;
  focus: string;
};

const sizeMetadata: Record<
  ButtonSize,
  { height: number; horizontalPadding: number; iconSize: number; gap: number; radius: number }
> = {
  s: {
    height: 32,
    horizontalPadding: resolveSpacingPx("numa-spacing-pebbles-m"),
    iconSize: 16,
    gap: resolveSpacingPx("numa-spacing-pebbles-s"),
    radius: resolveRadiusPx("numa-radius-pebbles-s"),
  },
  m: {
    height: 40,
    horizontalPadding: resolveSpacingPx("numa-spacing-pebbles-l"),
    iconSize: 16,
    gap: resolveSpacingPx("numa-spacing-pebbles-s"),
    radius: resolveRadiusPx("numa-radius-pebbles-s"),
  },
  l: {
    height: 48,
    horizontalPadding: resolveSpacingPx("numa-spacing-pebbles-xl"),
    iconSize: 20,
    gap: resolveSpacingPx("numa-spacing-pebbles-s"),
    radius: resolveRadiusPx("numa-radius-pebbles-s"),
  },
  xl: {
    height: 56,
    horizontalPadding: resolveSpacingPx("numa-spacing-bricks-s"),
    iconSize: 24,
    gap: resolveSpacingPx("numa-spacing-pebbles-s"),
    radius: resolveRadiusPx("numa-radius-pebbles-s"),
  },
};

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

function resolveOpacity(name: keyof typeof semanticColors): number {
  const token = semanticColors[name];
  if (token.$type !== "number" || typeof token.$value !== "string") {
    throw new TypeError(`Expected a semantic opacity token: ${name}`);
  }

  const match = /^\{([^{}]+)\}$/.exec(token.$value);
  if (!match) {
    throw new TypeError(`Expected a primitive percentage alias: ${name}`);
  }

  const primitive = primitivePercentages[match[1] as keyof typeof primitivePercentages];
  if (!primitive || primitive.$type !== "number" || typeof primitive.$value !== "number") {
    throw new Error(`Missing primitive percentage referenced by ${name}`);
  }

  return primitive.$value;
}

function resolveOverlay(name: keyof typeof semanticColors, opacityName: keyof typeof semanticColors): string {
  return `color-mix(in srgb, ${resolveColor(name)} ${resolveOpacity(opacityName)}%, transparent)`;
}

const tokensByVariant: Record<ButtonVariant, ButtonTokenSet> = {
  primary: {
    background: resolveColor("numa-color-interactive-surface-primary-default"),
    backgroundHover: resolveColor("numa-color-interactive-surface-primary-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-primary-active"),
    backgroundDisabled: resolveColor("numa-color-interactive-surface-primary-disabled"),
    text: resolveColor("numa-color-interactive-text-on-primary"),
    textDisabled: resolveColor("numa-color-interactive-text-disabled"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    borderDisabled: resolveColor("numa-color-interactive-outline-disabled"),
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  secondary: {
    background: resolveColor("numa-color-context-surface-level-1"),
    backgroundHover: resolveColor("numa-color-interactive-surface-subtle-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-subtle-active"),
    backgroundDisabled: resolveColor("numa-color-interactive-surface-subtle-disabled"),
    text: resolveColor("numa-color-interactive-text-primary"),
    textDisabled: resolveColor("numa-color-interactive-text-disabled"),
    border: resolveColor("numa-color-interactive-outline-primary"),
    borderHover: resolveColor("numa-color-interactive-outline-primary"),
    borderActive: resolveColor("numa-color-interactive-outline-primary"),
    borderDisabled: resolveColor("numa-color-interactive-outline-disabled"),
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  subtle: {
    background: resolveColor("numa-color-interactive-surface-subtle-default"),
    backgroundHover: resolveColor("numa-color-interactive-surface-subtle-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-subtle-active"),
    backgroundDisabled: resolveColor("numa-color-interactive-surface-subtle-disabled"),
    text: resolveColor("numa-color-context-text-primary"),
    textDisabled: resolveColor("numa-color-interactive-text-disabled"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    borderDisabled: resolveColor("numa-color-interactive-outline-disabled"),
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  ghost: {
    background: resolveOverlay(
      "numa-color-interactive-surface-ghost-default-color",
      "numa-color-interactive-surface-ghost-default-opacity",
    ),
    backgroundHover: resolveOverlay(
      "numa-color-interactive-surface-ghost-hover-color",
      "numa-color-interactive-surface-ghost-hover-opacity",
    ),
    backgroundActive: resolveOverlay(
      "numa-color-interactive-surface-ghost-active-color",
      "numa-color-interactive-surface-ghost-active-opacity",
    ),
    backgroundDisabled: resolveOverlay(
      "numa-color-interactive-surface-ghost-disabled-color",
      "numa-color-interactive-surface-ghost-disabled-opacity",
    ),
    text: resolveColor("numa-color-interactive-text-primary"),
    textDisabled: resolveColor("numa-color-interactive-text-disabled"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    borderDisabled: resolveColor("numa-color-interactive-outline-disabled"),
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
};

export function Button(props: ButtonProps) {
  const {
    children,
    label,
    size = "m",
    variant = "primary",
    disabled = false,
    loading = false,
    fullWidth = false,
    leadingIcon,
    trailingIcon,
    iconOnly = false,
    onClick,
    type = "button",
    className,
    style,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    ...elementProps
  } = props;

  const isDisabled = disabled || loading;
  const content = label ?? children;
  const resolvedLabel = typeof content === "string" || typeof content === "number" ? String(content) : content;
  const accessibleName =
    ariaLabel ?? ariaLabelledBy ?? (iconOnly && typeof resolvedLabel === "string" ? resolvedLabel : undefined) ?? "Button";
  const metadata = sizeMetadata[size];
  const palette = tokensByVariant[variant];
  const currentBackground = isDisabled ? palette.backgroundDisabled : palette.background;
  const currentText = isDisabled ? palette.textDisabled : palette.text;
  const currentBorder = isDisabled ? palette.borderDisabled : palette.border;

  const classes = [
    "numa-button",
    `numa-button--${size}`,
    `numa-button--${variant}`,
    fullWidth ? "numa-button--full-width" : "",
    iconOnly ? "numa-button--icon-only" : "",
    loading ? "numa-button--loading" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const buttonStyle: CSSProperties & {
    [key: `--numa-button-${string}`]: string;
  } = {
    borderWidth: variant === "secondary" ? 1 : 0,
    borderRadius: `${metadata.radius}px`,
    borderStyle: "solid",
    padding: iconOnly ? "0" : `0 ${metadata.horizontalPadding}px`,
    height: `${metadata.height}px`,
    minHeight: `${metadata.height}px`,
    width: fullWidth && !iconOnly ? "100%" : undefined,
    minWidth: iconOnly ? `${metadata.height}px` : undefined,
    gap: iconOnly ? "0" : `${metadata.gap}px`,
    "--numa-button-background": currentBackground,
    "--numa-button-hover-background": palette.backgroundHover,
    "--numa-button-active-background": palette.backgroundActive,
    "--numa-button-text": currentText,
    "--numa-button-border": currentBorder,
    "--numa-button-hover-border": palette.borderHover,
    "--numa-button-active-border": palette.borderActive,
    "--numa-button-focus-ring": palette.focus,
    ...style,
  };

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const spinner = loading ? (
    <span className="numa-button__spinner" aria-hidden="true" style={{ width: `${metadata.iconSize}px`, height: `${metadata.iconSize}px` }} />
  ) : null;

  const renderIcon = (icon: ReactNode, sizePx: number) =>
    icon ? (
      <span className="numa-button__icon" aria-hidden="true" style={{ width: `${sizePx}px`, height: `${sizePx}px` }}>
        {icon}
      </span>
    ) : null;

  const contentNode = resolvedLabel ? (
    <Text variant="button" size={size} as="span" aria-hidden={iconOnly && typeof resolvedLabel === "string" ? undefined : undefined}>
      {resolvedLabel}
    </Text>
  ) : null;

  return (
    <button
      {...elementProps}
      type={type}
      className={classes}
      style={buttonStyle}
      onClick={handleClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-disabled={isDisabled || undefined}
      aria-label={ariaLabel ?? (iconOnly ? accessibleName : undefined)}
      aria-labelledby={iconOnly ? undefined : ariaLabelledBy}
    >
      {loading ? spinner : null}
      {leadingIcon ? renderIcon(leadingIcon, metadata.iconSize) : null}
      {!iconOnly && contentNode}
      {!iconOnly && trailingIcon ? renderIcon(trailingIcon, metadata.iconSize) : null}
      {iconOnly && !loading && leadingIcon ? renderIcon(leadingIcon, metadata.iconSize) : null}
      {iconOnly && !loading && !leadingIcon && !trailingIcon ? renderIcon(children, metadata.iconSize) : null}
    </button>
  );
}
