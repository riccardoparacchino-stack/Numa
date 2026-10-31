import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { createContext, useContext } from "react";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import { SurfaceCompositionContext } from "../surface-context";
import semanticColors from "../../../tokens/semantic/color.json";
import primitiveColors from "../../../tokens/primitive/color.json";
import "./Tile.css";

type TileCommonProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className" | "style" | "onClick"
> & {
  children?: ReactNode;
  variant?: TileVariant;
  surfaceLevel?: TileSurfaceLevel;
  className?: string;
  style?: TileStyleOverrides;
};

export type TileVariant = "s" | "m" | "l";
export type TileSurfaceLevel = "level-1" | "level-2";
type TileNestingRole = "outer" | "middle" | "inner";

type TileNestingContextValue = {
  variant: TileVariant;
  depth: number;
  surfaceLevel: TileSurfaceLevel;
};

export const TileNestingContext = createContext<TileNestingContextValue | null>(null);

export type TileStyleOverrides = Omit<
  CSSProperties,
  "borderRadius" | "width" | "minWidth"
>;

type StaticTileProps = TileCommonProps & {
  href?: never;
  onClick?: never;
  disabled?: never;
  target?: never;
  rel?: never;
  type?: never;
  download?: never;
  name?: never;
  value?: never;
  form?: never;
};

type LinkTileProps = TileCommonProps &
  Pick<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel" | "download"> & {
    href: string;
    onClick?: never;
    disabled?: never;
    type?: never;
    name?: never;
    value?: never;
    form?: never;
  };

type ButtonTileProps = TileCommonProps &
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "disabled" | "type" | "name" | "value" | "form"> & {
    onClick: MouseEventHandler<HTMLButtonElement>;
    href?: never;
    target?: never;
    rel?: never;
    download?: never;
  };

export type TileProps = StaticTileProps | LinkTileProps | ButtonTileProps;

type TileStyle = CSSProperties & {
  "--numa-tile-surface": string;
  "--numa-tile-border": string;
  "--numa-tile-hover": string;
  "--numa-tile-active": string;
  "--numa-tile-disabled": string;
  "--numa-tile-disabled-border": string;
  "--numa-tile-disabled-text": string;
  "--numa-tile-focus": string;
  "--numa-tile-text": string;
};

const dimensions: Record<
  TileVariant,
  { padding: string; radii: Record<TileNestingRole, string> }
> = {
  s: {
    padding: `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
    radii: {
      outer: `${resolveRadiusPx("numa-radius-walls-s")}px`,
      middle: `${resolveRadiusPx("numa-radius-bricks-s")}px`,
      inner: `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
    },
  },
  m: {
    padding: `${resolveSpacingPx("numa-spacing-pebbles-l")}px`,
    radii: {
      outer: `${resolveRadiusPx("numa-radius-walls-m")}px`,
      middle: `${resolveRadiusPx("numa-radius-bricks-s")}px`,
      inner: `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
    },
  },
  l: {
    padding: `${resolveSpacingPx("numa-spacing-bricks-s")}px`,
    radii: {
      outer: `${resolveRadiusPx("numa-radius-walls-xl")}px`,
      middle: `${resolveRadiusPx("numa-radius-bricks-m")}px`,
      inner: `${resolveRadiusPx("numa-radius-pebbles-xs")}px`,
    },
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
  if (!primitive || primitive.$type !== "color") {
    throw new Error(`Missing primitive color referenced by ${name}`);
  }

  return primitive.$value;
}

export function Tile(props: TileProps) {
  const parentNesting = useContext(TileNestingContext);
  const surfaceComposition = useContext(SurfaceCompositionContext);
  const {
    children,
    variant: requestedVariant,
    surfaceLevel: requestedSurfaceLevel,
    className,
    style,
    href,
    onClick,
    disabled,
    target,
    rel,
    download,
    type,
    name,
    value,
    form,
    ...elementProps
  } = props;
  const inheritedVariant = surfaceComposition?.size ?? parentNesting?.variant;
  const variant = inheritedVariant ?? requestedVariant ?? "m";
  const depth = parentNesting?.depth ?? (surfaceComposition ? surfaceComposition.cardDepth + 1 : 0);
  const parentSurfaceLevel = parentNesting?.surfaceLevel ?? surfaceComposition?.surfaceLevel;
  const surfaceLevel =
    requestedSurfaceLevel ??
    (parentSurfaceLevel === undefined
      ? "level-1"
      : parentSurfaceLevel === "level-1"
        ? "level-2"
        : "level-1");
  if (inheritedVariant && requestedVariant !== undefined && requestedVariant !== inheritedVariant) {
    throw new TypeError("Nested Tiles inherit the outer Tile variant.");
  }
  if (depth > 2) {
    throw new RangeError("Tiles can be nested three levels maximum.");
  }
  const interactive = href !== undefined || onClick !== undefined;
  if (surfaceLevel !== "level-1" && surfaceLevel !== "level-2") {
    throw new RangeError(`Unsupported Tile surface level: ${surfaceLevel}`);
  }
  if (!(variant in dimensions)) {
    throw new RangeError(`Unsupported Tile variant: ${variant}`);
  }
  const classes = [
    "numa-tile",
    `numa-tile--${variant}`,
    `numa-tile--surface-${surfaceLevel}`,
    `numa-tile--nesting-${(["outer", "middle", "inner"] as const)[depth]}`,
    interactive ? "numa-tile--interactive" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const role = (["outer", "middle", "inner"] as const)[depth];
  const tokenStyle: TileStyle = {
    "--numa-tile-surface": resolveColor(
      surfaceLevel === "level-1"
        ? "numa-color-context-surface-level-1"
        : "numa-color-context-surface-level-2",
    ),
    "--numa-tile-border": resolveColor(
      interactive
        ? "numa-color-interactive-outline-subtle"
        : "numa-color-context-border-subtle",
    ),
    "--numa-tile-hover": resolveColor("numa-color-interactive-surface-subtle-hover"),
    "--numa-tile-active": resolveColor("numa-color-interactive-surface-subtle-active"),
    "--numa-tile-disabled": resolveColor("numa-color-interactive-surface-subtle-disabled"),
    "--numa-tile-disabled-border": resolveColor("numa-color-interactive-outline-disabled"),
    "--numa-tile-disabled-text": resolveColor("numa-color-interactive-text-disabled"),
    "--numa-tile-focus": resolveColor("numa-color-interactive-outline-focus"),
    "--numa-tile-text": resolveColor("numa-color-context-text-primary"),
    padding: dimensions[variant].padding,
    borderRadius: dimensions[variant].radii[role],
    ...style,
  };

  const nestedContext = { variant, depth: depth + 1, surfaceLevel };
  const content = <TileNestingContext.Provider value={nestedContext}>{children}</TileNestingContext.Provider>;

  if (href !== undefined) {
    return (
      <a
        {...(elementProps as AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        style={tokenStyle}
        href={href}
        target={target}
        rel={rel}
        download={download}
      >
        {content}
      </a>
    );
  }

  if (onClick !== undefined) {
    return (
      <button
        {...(elementProps as ButtonHTMLAttributes<HTMLButtonElement>)}
        className={classes}
        style={tokenStyle}
        onClick={onClick}
        disabled={disabled}
        type={type ?? "button"}
        name={name}
        value={value}
        form={form}
      >
        {content}
      </button>
    );
  }

  return (
    <div {...elementProps} className={classes} style={tokenStyle}>
      {content}
    </div>
  );
}
