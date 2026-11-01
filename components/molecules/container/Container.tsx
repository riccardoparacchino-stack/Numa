import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { useContext, useLayoutEffect, useRef, useState } from "react";
import {
  CONTAINER_SCALE_STEPS,
  CONTAINER_SIZING_STEP_OFFSET,
  CONTAINER_MODE_STEP_OFFSETS,
  DEFAULT_BASE_PADDING,
  DEFAULT_HARMONIC_RATIO,
  DEFAULT_RADIUS_MULTIPLIER,
  generateDimensionScale,
  modeForContainerWidth,
  type ContainerMode,
} from "../../../foundation/parametric-sizing";
import { getSemanticColorStyle, semanticColorVariable } from "../../../foundation/colors/semantic-color-style";
import { resolveSpacingPx } from "../../../foundation/semantic-dimensions";
import primitivePercentages from "../../../tokens/primitive/percentage.json";
import { DisabledContext } from "../../disabled-context";
import { TileNestingContext } from "../tile/tile-nesting-context";
import { ContainerModeContext } from "./container-mode-context";
import "./Container.css";

type ContainerStyle = CSSProperties & {
  [key: `--${string}`]: string | number | undefined;
};

export type ContainerProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "className" | "style"
> & {
  children?: ReactNode;
  mode?: ContainerMode;
  basePadding?: number;
  harmonicRatio?: number;
  radiusMultiplier?: number;
  className?: string;
  style?: ContainerStyle;
};

const shadowOpacity = primitivePercentages["numa-sys-per-020"];
if (shadowOpacity.$type !== "number" || typeof shadowOpacity.$value !== "number") {
  throw new TypeError("Expected a numeric primitive percentage for the Container shadow.");
}

export function Container({
  children,
  mode,
  basePadding = DEFAULT_BASE_PADDING,
  harmonicRatio = DEFAULT_HARMONIC_RATIO,
  radiusMultiplier = DEFAULT_RADIUS_MULTIPLIER,
  className,
  style,
  ...elementProps
}: ContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inheritedDisabled = useContext(DisabledContext);
  const [autoMode, setAutoMode] = useState<ContainerMode | null>(null);
  const scale = generateDimensionScale({
    basePadding,
    harmonicRatio,
    radiusMultiplier,
    steps: CONTAINER_SCALE_STEPS,
  });
  const effectiveMode = mode ?? autoMode ?? "compact";
  const containerDimensions =
    scale[CONTAINER_MODE_STEP_OFFSETS[effectiveMode] + CONTAINER_SIZING_STEP_OFFSET];
  if (!containerDimensions) {
    throw new RangeError(`Scale steps are insufficient for the ${effectiveMode} Container.`);
  }

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element || mode || typeof ResizeObserver === "undefined") return;

    const updateMode = () => {
      setAutoMode(modeForContainerWidth(element.clientWidth));
    };
    updateMode();

    const observer = new ResizeObserver(updateMode);
    observer.observe(element);
    return () => observer.disconnect();
  }, [mode]);

  const classes = ["numa-container", className].filter(Boolean).join(" ");
  const generatedStyle: ContainerStyle = {};
  for (const [step, dimensions] of scale.entries()) {
    generatedStyle[`--numa-sizing-scale-step-${step}-padding`] = `${dimensions.padding}px`;
    generatedStyle[`--numa-sizing-scale-step-${step}-radius`] = `${dimensions.radius}px`;
  }
  const selectedMode = mode ?? autoMode;
  if (selectedMode) {
    for (let step = 0; step <= 4; step += 1) {
      const dimensions = scale[CONTAINER_MODE_STEP_OFFSETS[selectedMode] + step];
      if (!dimensions) {
        throw new RangeError(`Scale steps are insufficient for the ${selectedMode} Container.`);
      }
      generatedStyle[`--numa-sizing-selected-step-${step}-padding`] = `${dimensions.padding}px`;
      generatedStyle[`--numa-sizing-selected-step-${step}-radius`] = `${dimensions.radius}px`;
    }
  } else {
    for (let step = 0; step <= 4; step += 1) {
      generatedStyle[`--numa-sizing-selected-step-${step}-padding`] = "initial";
      generatedStyle[`--numa-sizing-selected-step-${step}-radius`] = "initial";
    }
  }

  const sizingStyle: ContainerStyle = {
    ...generatedStyle,
    ...getSemanticColorStyle(inheritedDisabled),
    "--numa-container-surface": semanticColorVariable("numa-color-context-surface-weak"),
    "--numa-container-border": semanticColorVariable("numa-color-context-outline-subtle"),
    "--numa-container-text": semanticColorVariable("numa-color-context-content-strong"),
    "--numa-container-shadow": [
      `${resolveSpacingPx("numa-spacing-pebbles-none")}px`,
      `${resolveSpacingPx("numa-spacing-pebbles-s")}px`,
      `${resolveSpacingPx("numa-spacing-bricks-m")}px`,
      `-${resolveSpacingPx("numa-spacing-pebbles-m")}px`,
      `color-mix(in srgb, ${semanticColorVariable("numa-color-context-shadow-subtle")} ${shadowOpacity.$value}%, transparent)`,
    ].join(" "),
    display: "block",
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    padding: `${containerDimensions.padding}px`,
    borderRadius: `${containerDimensions.radius}px`,
    ...style,
  };

  return (
    <div
      {...elementProps}
      ref={containerRef}
      className={classes}
      style={sizingStyle}
      data-mode={mode ?? "auto"}
      data-effective-mode={effectiveMode}
    >
      <ContainerModeContext.Provider value={effectiveMode}>
        <TileNestingContext.Provider value={{ depth: 1, surfaceLevel: "level-1" }}>
          {children}
        </TileNestingContext.Provider>
      </ContainerModeContext.Provider>
    </div>
  );
}
