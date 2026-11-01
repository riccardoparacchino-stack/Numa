import type { ReactNode } from "react";
import { createContext, useContext } from "react";
import { Tile, type TileProps, type TileStyleOverrides } from "../tile/Tile";
import { TileNestingContext } from "../tile/tile-nesting-context";

type WithoutSurfaceLevel<T> = T extends unknown ? Omit<T, "surfaceLevel"> : never;

export type CardProps = WithoutSurfaceLevel<TileProps> & {
  children?: ReactNode;
  className?: string;
  style?: TileStyleOverrides;
};

const CardDepthContext = createContext(0);

export function Card(props: CardProps) {
  const parentDepth = useContext(CardDepthContext);
  if (parentDepth > 1) {
    throw new RangeError("Cards can have one nested card-child level maximum.");
  }

  const {
    children,
    className,
    style,
    ...tileProps
  } = props;
  const role = parentDepth === 0 ? "middle" : "inner";
  const surfaceLevel = parentDepth === 0 ? "level-2" : "level-1";
  const depth = parentDepth + 1;
  const classes = ["numa-card", `numa-card--${role}`, className].filter(Boolean).join(" ");

  return (
    <CardDepthContext.Provider value={depth}>
      <TileNestingContext.Provider value={{ depth, surfaceLevel }}>
        <Tile {...tileProps} surfaceLevel={surfaceLevel} className={classes} style={style}>
          {children}
        </Tile>
      </TileNestingContext.Provider>
    </CardDepthContext.Provider>
  );
}
