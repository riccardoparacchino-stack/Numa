import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { createContext, useContext } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveRadiusPx, resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import { DisabledContext } from "../../disabled-context";
import { SurfaceCompositionContext } from "../surface-context";
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
  disabled?: boolean;
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
  Pick<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "name" | "value" | "form"> & {
    onClick: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    href?: never;
    target?: never;
    rel?: never;
    download?: never;
  };

export type TileProps = StaticTileProps | LinkTileProps | ButtonTileProps;

type TileStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
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

export function Tile(props: TileProps) {
  const parentNesting = useContext(TileNestingContext);
  const surfaceComposition = useContext(SurfaceCompositionContext);
  const inheritedDisabled = useContext(DisabledContext);
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
  const isDisabled = inheritedDisabled || disabled === true;
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
    ...getSemanticColorStyle(isDisabled),
    "--numa-tile-surface": semanticColorVariable(
      surfaceLevel === "level-1" ? "numa-color-context-surface-weak" : "numa-color-context-surface-strong",
    ),
    "--numa-tile-border": semanticColorVariable(
      interactive
        ? "numa-color-interactive-outline-subtle"
        : "numa-color-context-outline-subtle",
    ),
    "--numa-tile-hover": semanticColorVariable("numa-color-interactive-surface-subtle-hover"),
    "--numa-tile-active": semanticColorVariable("numa-color-interactive-surface-subtle-active"),
    "--numa-tile-disabled": semanticColorVariable("numa-color-interactive-surface-disabled"),
    "--numa-tile-disabled-border": semanticColorVariable("numa-color-interactive-outline-disabled"),
    "--numa-tile-disabled-text": semanticColorVariable("numa-color-interactive-content-disabled"),
    "--numa-tile-focus": semanticColorVariable("numa-color-interactive-outline-focus"),
    "--numa-tile-text": semanticColorVariable("numa-color-context-content-strong"),
    padding: dimensions[variant].padding,
    borderRadius: dimensions[variant].radii[role],
    ...style,
  };

  const nestedContext = { variant, depth: depth + 1, surfaceLevel };
  const content = (
    <DisabledContext.Provider value={isDisabled}>
      <TileNestingContext.Provider value={nestedContext}>{children}</TileNestingContext.Provider>
    </DisabledContext.Provider>
  );

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
        disabled={isDisabled}
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
