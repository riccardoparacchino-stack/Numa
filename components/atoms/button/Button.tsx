import type {
  ButtonHTMLAttributes,
  CSSProperties,
  MouseEventHandler,
  ReactNode,
} from "react";
import { useContext } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import { DisabledContext } from "../../disabled-context";
import primitivePercentages from "../../../tokens/primitive/percentage.json";
import semanticColors from "../../../tokens/semantic/color.json";
import { Text } from "../text/Text";
import "./Button.css";

export const buttonSizes = ["s", "m", "l", "xl"] as const;
export const buttonVariants = ["action", "outlined", "subtle", "ghost"] as const;

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
  text: string;
  border: string;
  borderHover: string;
  borderActive: string;
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
  return semanticColorVariable(name);
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
  action: {
    background: resolveColor("numa-color-interactive-surface-action-default"),
    backgroundHover: resolveColor("numa-color-interactive-surface-action-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-action-active"),
    text: resolveColor("numa-color-interactive-content-on-action"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  outlined: {
    background: resolveColor("numa-color-context-surface-weak"),
    backgroundHover: resolveColor("numa-color-interactive-surface-subtle-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-subtle-active"),
    text: resolveColor("numa-color-interactive-content-action"),
    border: resolveColor("numa-color-interactive-outline-action"),
    borderHover: resolveColor("numa-color-interactive-outline-action"),
    borderActive: resolveColor("numa-color-interactive-outline-action"),
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  subtle: {
    background: resolveColor("numa-color-interactive-surface-subtle-default"),
    backgroundHover: resolveColor("numa-color-interactive-surface-subtle-hover"),
    backgroundActive: resolveColor("numa-color-interactive-surface-subtle-active"),
    text: resolveColor("numa-color-context-content-strong"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
  ghost: {
    background: resolveOverlay(
      "numa-color-interactive-surface-ghost-color",
      "numa-color-interactive-surface-ghost-opacity-default",
    ),
    backgroundHover: resolveOverlay(
      "numa-color-interactive-surface-ghost-color",
      "numa-color-interactive-surface-ghost-opacity-hover",
    ),
    backgroundActive: resolveOverlay(
      "numa-color-interactive-surface-ghost-color",
      "numa-color-interactive-surface-ghost-opacity-active",
    ),
    text: resolveColor("numa-color-interactive-content-action"),
    border: "transparent",
    borderHover: "transparent",
    borderActive: "transparent",
    focus: resolveColor("numa-color-interactive-outline-focus"),
  },
};

export function Button(props: ButtonProps) {
  const inheritedDisabled = useContext(DisabledContext);
  const {
    children,
    label,
    size = "m",
    variant = "action",
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

  const isDisabled = disabled || loading || inheritedDisabled;
  const content = label ?? children;
  const resolvedLabel = typeof content === "string" || typeof content === "number" ? String(content) : content;
  const accessibleName =
    ariaLabel ?? ariaLabelledBy ?? (iconOnly && typeof resolvedLabel === "string" ? resolvedLabel : undefined) ?? "Button";
  const metadata = sizeMetadata[size];
  const palette = tokensByVariant[variant];
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
    [key: `--${string}`]: string | number | undefined;
  } = {
    ...getSemanticColorStyle(isDisabled),
    borderWidth: variant === "outlined" ? 1 : 0,
    borderRadius: `${metadata.radius}px`,
    borderStyle: "solid",
    padding: iconOnly ? "0" : `0 ${metadata.horizontalPadding}px`,
    height: `${metadata.height}px`,
    minHeight: `${metadata.height}px`,
    width: fullWidth && !iconOnly ? "100%" : undefined,
    minWidth: iconOnly ? `${metadata.height}px` : undefined,
    gap: iconOnly ? "0" : `${metadata.gap}px`,
    "--numa-button-background": isDisabled
      ? resolveColor("numa-color-interactive-surface-disabled")
      : palette.background,
    "--numa-button-hover-background": palette.backgroundHover,
    "--numa-button-active-background": palette.backgroundActive,
    "--numa-button-text": palette.text,
    "--numa-button-border": palette.border,
    "--numa-button-hover-border": palette.borderHover,
    "--numa-button-active-border": palette.borderActive,
    "--numa-button-focus-ring": palette.focus,
    "--numa-button-focus-inner": resolveColor("numa-color-interactive-outline-focus-on-action-inner"),
    "--numa-button-focus-outer": resolveColor("numa-color-interactive-outline-focus-on-action-outer"),
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
