import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useContext } from "react";
import { SurfaceCompositionContext, containerPadding } from "../surface-context";
import { TileNestingContext, type TileStyleOverrides, type TileVariant, Tile } from "../tile/Tile";
import "./Container.css";

export type ContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "children"
  | "className"
  | "disabled"
  | "download"
  | "form"
  | "href"
  | "name"
  | "onClick"
  | "rel"
  | "style"
  | "target"
  | "type"
  | "value"
> & {
  children?: ReactNode;
  size?: TileVariant;
  className?: string;
  style?: TileStyleOverrides;
};

export function Container({
  children,
  size = "m",
  className,
  style,
  ...elementProps
}: ContainerProps) {
  const composition = useContext(SurfaceCompositionContext);
  const tileNesting = useContext(TileNestingContext);
  if (composition || tileNesting) {
    throw new Error("Container must be a top-level page surface, not nested inside another surface.");
  }

  const classes = ["numa-container", className].filter(Boolean).join(" ");
  const containerStyle: CSSProperties = {
    padding: containerPadding[size],
    ...style,
  };

  return (
    <Tile
      {...elementProps}
      variant={size}
      surfaceLevel="level-1"
      href={undefined}
      onClick={undefined}
      disabled={undefined}
      className={classes}
      style={containerStyle}
    >
      <SurfaceCompositionContext.Provider value={{ size, cardDepth: 0, surfaceLevel: "level-1" }}>
        {children}
      </SurfaceCompositionContext.Provider>
    </Tile>
  );
}
