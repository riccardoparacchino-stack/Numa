import type { CSSProperties, ReactNode } from "react";
import { useContext } from "react";
import { cardPadding, SurfaceCompositionContext } from "../surface-context";
import {
  Tile,
  TileNestingContext,
  type TileProps,
  type TileStyleOverrides,
} from "../tile/Tile";

type WithoutVariant<T> = T extends unknown ? Omit<T, "variant" | "surfaceLevel"> : never;

export type CardProps = WithoutVariant<TileProps> & {
  children?: ReactNode;
  className?: string;
  style?: TileStyleOverrides;
};

export function Card(props: CardProps) {
  const composition = useContext(SurfaceCompositionContext);
  const tileNesting = useContext(TileNestingContext);
  if (!composition) {
    throw new Error("Card must be placed inside a Container or another Card.");
  }
  if (composition.cardDepth > 1) {
    throw new RangeError("Cards can have one nested card-child level maximum.");
  }

  const {
    children,
    className,
    style,
    ...tileProps
  } = props;
  const role = composition.cardDepth === 0 ? "middle" : "inner";
  const parentSurfaceLevel = tileNesting?.surfaceLevel ?? composition.surfaceLevel;
  const surfaceLevel = parentSurfaceLevel === "level-1" ? "level-2" : "level-1";
  const classes = ["numa-card", `numa-card--${role}`, className].filter(Boolean).join(" ");
  const cardStyle: CSSProperties = {
    padding: cardPadding[composition.size][role],
    ...style,
  };

  return (
    <Tile
      {...tileProps}
      surfaceLevel={surfaceLevel}
      className={classes}
      style={cardStyle}
    >
      <SurfaceCompositionContext.Provider
        value={{ ...composition, cardDepth: composition.cardDepth + 1, surfaceLevel }}
      >
        {children}
      </SurfaceCompositionContext.Provider>
    </Tile>
  );
}
