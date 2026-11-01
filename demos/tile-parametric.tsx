import { useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CONTAINER_MODE_STEP_OFFSETS,
  CONTAINER_SCALE_STEPS,
  CONTAINER_SIZING_STEP_OFFSET,
  CONTAINER_MODE_BREAKPOINTS,
  DEFAULT_BASE_PADDING,
  DEFAULT_RADIUS_MULTIPLIER,
  HARMONIC_RATIOS,
  generateDimensionScale,
  modeForContainerWidth,
  type ContainerMode,
  type HarmonicRatioName,
} from "../foundation/parametric-sizing";
import { Container } from "../components/molecules/container";
import { Page } from "../components/molecules/page";
import { Tile } from "../components/molecules/tile";
import { generateTileDimensions } from "../components/molecules/tile/tile-sizing";
import "./tile-parametric.css";

type DemoMode = ContainerMode | "auto";

function TileParametricDemo() {
  const [mode, setMode] = useState<DemoMode>("auto");
  const [basePadding, setBasePadding] = useState(DEFAULT_BASE_PADDING);
  const [harmonicRatio, setHarmonicRatio] =
    useState<HarmonicRatioName>("Minor Third");
  const [radiusMultiplier, setRadiusMultiplier] = useState(DEFAULT_RADIUS_MULTIPLIER);
  const [width, setWidth] = useState(720);
  const [containerWidth, setContainerWidth] = useState(width);
  const controlsRef = useRef<HTMLFormElement>(null);

  useLayoutEffect(() => {
    const configurationContainer = controlsRef.current?.parentElement;
    if (!configurationContainer) return;

    const updateContainerWidth = () => {
      setContainerWidth(configurationContainer.clientWidth);
    };
    updateContainerWidth();

    const observer = new ResizeObserver(updateContainerWidth);
    observer.observe(configurationContainer);
    return () => observer.disconnect();
  }, [width]);

  const effectiveMode =
    mode === "auto" ? modeForContainerWidth(containerWidth) : mode;
  const sizing = generateTileDimensions({
    basePadding,
    harmonicRatio: HARMONIC_RATIOS[harmonicRatio],
    radiusMultiplier,
    mode: effectiveMode,
  });
  const containerSizing =
    generateDimensionScale({
      basePadding,
      harmonicRatio: HARMONIC_RATIOS[harmonicRatio],
      radiusMultiplier,
      steps: CONTAINER_SCALE_STEPS,
    })[CONTAINER_MODE_STEP_OFFSETS[effectiveMode] + CONTAINER_SIZING_STEP_OFFSET];
  if (!containerSizing) {
    throw new RangeError(`Scale steps are insufficient for the ${effectiveMode} Container.`);
  }

  return (
    <Page>
      <Container
        className="tile-demo__configuration"
        mode={mode === "auto" ? undefined : mode}
        style={{ maxWidth: `${width}px` }}
        basePadding={basePadding}
        harmonicRatio={HARMONIC_RATIOS[harmonicRatio]}
        radiusMultiplier={radiusMultiplier}
      >
        <h1>Numa Tile sizing</h1>
        <form
          ref={controlsRef}
          className="tile-demo__controls"
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            Container mode
            <select value={mode} onChange={(event) => setMode(event.target.value as DemoMode)}>
              <option value="auto">Automatic (container width)</option>
              <option value="compact">Compact</option>
              <option value="relaxed">Relaxed</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>
          <label>
            Base padding (px)
            <input
              type="number"
              min="4"
              max="64"
              step="4"
              value={basePadding}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && value > 0) setBasePadding(value);
              }}
            />
          </label>
          <label>
            Harmonic ratio
            <select
              value={harmonicRatio}
              onChange={(event) => setHarmonicRatio(event.target.value as HarmonicRatioName)}
            >
              {Object.entries(HARMONIC_RATIOS).map(([name, ratio]) => (
                <option key={name} value={name}>
                  {name} ({ratio})
                </option>
              ))}
            </select>
          </label>
          <label>
            Radius multiplier
            <input
              type="number"
              min="0.25"
              max="8"
              step="0.25"
              value={radiusMultiplier}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && value > 0) setRadiusMultiplier(value);
              }}
            />
          </label>
          <label>
            Container max width (px)
            <input
              type="range"
              min="320"
              max="1000"
              step="20"
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
            />
          </label>
        </form>

        <p>
          Effective configuration: {effectiveMode} · container width: {containerWidth}px · maximum
          width: {width}px · base padding: {basePadding}px · {harmonicRatio} (
          {HARMONIC_RATIOS[harmonicRatio]}) · radius multiplier: {radiusMultiplier}
        </p>
        <p>
          Automatic thresholds: compact &lt; {CONTAINER_MODE_BREAKPOINTS.relaxed}px, relaxed
          &lt; {CONTAINER_MODE_BREAKPOINTS.spacious}px, spacious otherwise. Explicit modes
          ignore width.
        </p>
        <Tile>
          <h2>Generated dimensions</h2>
          <p className="tile-demo__tile-label">
            Container · current level 1 · {containerSizing.padding}px padding ·{" "}
            {containerSizing.radius}px radius
          </p>
          <p className="tile-demo__tile-label">
            Middle Tile · current level 2 · {sizing.middle.padding}px padding ·{" "}
            {sizing.middle.radius}px radius
          </p>
          <Tile>
            <p className="tile-demo__tile-label">
              Inner Tile · current level 3 · {sizing.inner.padding}px padding ·{" "}
              {sizing.inner.radius}px radius
            </p>
          </Tile>
        </Tile>
      </Container>
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<TileParametricDemo />);
