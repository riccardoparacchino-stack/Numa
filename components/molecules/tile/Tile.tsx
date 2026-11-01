import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import { useContext } from "react";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { DisabledContext } from "../../disabled-context";
import { TileNestingContext, type TileSurfaceLevel } from "./tile-nesting-context";
import {
  generateTileDimensions,
  TILE_NESTING_STEP_OFFSETS,
  type TileNestingRole,
} from "./tile-sizing";
import "./Tile.sizing.css";
import "./Tile.css";

type TileCommonProps = Omit<
  HTMLAttributes<HTMLElement>,
  "children" | "className" | "style" | "onClick"
> & {
  children?: ReactNode;
  surfaceLevel?: TileSurfaceLevel;
  className?: string;
  style?: TileStyleOverrides;
};

export type { TileSurfaceLevel } from "./tile-nesting-context";

const nestingRoles: TileNestingRole[] = ["outer", "middle", "inner"];
const defaultSizing = generateTileDimensions();

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

export function Tile(props: TileProps) {
  const parentNesting = useContext(TileNestingContext);
  const inheritedDisabled = useContext(DisabledContext);
  const {
    children,
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
  const depth = parentNesting?.depth ?? 0;
  const parentSurfaceLevel = parentNesting?.surfaceLevel;
  const surfaceLevel =
    requestedSurfaceLevel ??
    (parentSurfaceLevel === undefined
      ? "level-1"
      : parentSurfaceLevel === "level-1"
        ? "level-2"
        : "level-1");
  if (depth > 2) {
    throw new RangeError("Tiles can be nested three levels maximum.");
  }
  const interactive = href !== undefined || onClick !== undefined;
  const isDisabled = inheritedDisabled || disabled === true;
  if (surfaceLevel !== "level-1" && surfaceLevel !== "level-2") {
    throw new RangeError(`Unsupported Tile surface level: ${surfaceLevel}`);
  }
  const role = nestingRoles[depth];
  const classes = [
    "numa-tile",
    `numa-tile--surface-${surfaceLevel}`,
    `numa-tile--nesting-${role}`,
    interactive ? "numa-tile--interactive" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

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
    padding: `var(--numa-sizing-selected-step-${TILE_NESTING_STEP_OFFSETS[role]}-padding, var(--numa-sizing-auto-step-${TILE_NESTING_STEP_OFFSETS[role]}-padding, ${defaultSizing[role].padding}px))`,
    borderRadius: `var(--numa-sizing-selected-step-${TILE_NESTING_STEP_OFFSETS[role]}-radius, var(--numa-sizing-auto-step-${TILE_NESTING_STEP_OFFSETS[role]}-radius, ${defaultSizing[role].radius}px))`,
    ...style,
  };

  const nestedContext = { depth: depth + 1, surfaceLevel };
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
