import { useLayoutEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  CONTAINER_MODE_STEP_OFFSETS,
  CONTAINER_SCALE_STEPS,
  CONTAINER_SIZING_STEP_OFFSET,
  DEFAULT_BASE_PADDING,
  DEFAULT_PADDING_MULTIPLIER,
  DEFAULT_RADIUS_MULTIPLIER,
  generateDimensionScale,
  type ContainerMode,
} from "../foundation/parametric-sizing";
import { PAGE_MODE_BREAKPOINTS, modeForPageWidth } from "../foundation/page-sizing";
import { TYPOGRAPHY_HARMONIC_RATIOS } from "../foundation/typography/letter-spacing";
import { Container } from "../components/molecules/container";
import { Page } from "../components/molecules/page";
import { Tile } from "../components/molecules/tile";
import { generateTileDimensions } from "../components/molecules/tile/tile-sizing";
import "./tile-parametric.css";

type DemoMode = ContainerMode | "auto";

function TileParametricDemo() {
  const [mode, setMode] = useState<DemoMode>("auto");
  const [basePadding, setBasePadding] = useState(DEFAULT_BASE_PADDING);
  const [paddingMultiplier, setPaddingMultiplier] = useState(DEFAULT_PADDING_MULTIPLIER);
  const [radiusMultiplier, setRadiusMultiplier] = useState(DEFAULT_RADIUS_MULTIPLIER);
  const [width, setWidth] = useState(720);
  const [containerWidth, setContainerWidth] = useState(width);
  const [pageWidth, setPageWidth] = useState(() => document.documentElement.clientWidth);
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

  useLayoutEffect(() => {
    const updatePageWidth = () => setPageWidth(document.documentElement.clientWidth);
    updatePageWidth();
    window.addEventListener("resize", updatePageWidth);
    return () => window.removeEventListener("resize", updatePageWidth);
  }, []);

  const effectiveMode =
    mode === "auto" ? modeForPageWidth(pageWidth) : mode;
  const harmonicRatio = TYPOGRAPHY_HARMONIC_RATIOS[effectiveMode];
  const harmonicName = {
    compact: "Major Second",
    relaxed: "Minor Third",
    spacious: "Major Third",
  }[effectiveMode];
  const sizing = generateTileDimensions({
    basePadding,
    paddingMultiplier,
    harmonicRatio,
    radiusMultiplier,
    mode: effectiveMode,
  });
  const containerSizing =
    generateDimensionScale({
      basePadding,
      paddingMultiplier,
      harmonicRatio,
      radiusMultiplier,
      steps: CONTAINER_SCALE_STEPS,
    })[CONTAINER_MODE_STEP_OFFSETS[effectiveMode] + CONTAINER_SIZING_STEP_OFFSET];
  if (!containerSizing) {
    throw new RangeError(`Scale steps are insufficient for the ${effectiveMode} Container.`);
  }

  const markdownValues = [
    "## Tile sizing values",
    "",
    `- Mode: ${effectiveMode}`,
    `- Container max width: ${width}px`,
    `- Base padding: ${basePadding}px × ${paddingMultiplier} = ${basePadding * paddingMultiplier}px effective`,
    `- Padding multiplier: ${paddingMultiplier}`,
    `- Type harmonic ratio: ${harmonicName} (${harmonicRatio})`,
    `- Radius multiplier: ${radiusMultiplier}`,
    `- Container padding / radius: ${containerSizing.padding}px / ${containerSizing.radius}px`,
    `- Middle Tile padding / radius: ${sizing.middle.padding}px / ${sizing.middle.radius}px`,
    `- Inner Tile padding / radius: ${sizing.inner.padding}px / ${sizing.inner.radius}px`,
  ].join("\n");

  return (
    <Page>
      <Container
        className="tile-demo__configuration"
        mode={mode === "auto" ? undefined : mode}
        style={{ maxWidth: `${width}px` }}
        basePadding={basePadding}
        paddingMultiplier={paddingMultiplier}
        harmonicRatio={harmonicRatio}
        radiusMultiplier={radiusMultiplier}
      >
        <h1>Numa Tile sizing</h1>
        <Tile>
          <p>
            <strong>Experimental demo</strong> — these controls explore the
            sizing algorithm. This is not the standard Tile showcase or a
            complete specification of supported API behavior.
          </p>
        </Tile>
        <form
          ref={controlsRef}
          className="tile-demo__controls"
          onSubmit={(event) => event.preventDefault()}
        >
          <label>
            Sizing mode
            <select value={mode} onChange={(event) => setMode(event.target.value as DemoMode)}>
              <option value="auto">Auto — based on container width</option>
              <option value="compact">Compact</option>
              <option value="relaxed">Relaxed</option>
              <option value="spacious">Spacious</option>
            </select>
          </label>
          <label>
            Base padding (px)
            <input
              type="number"
              min="2"
              max="64"
              step="2"
              value={basePadding}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && value > 0) setBasePadding(value);
              }}
            />
          </label>
          <label>
            Padding multiplier
            <input
              type="number"
              min="0.25"
              max="8"
              step="0.25"
              value={paddingMultiplier}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (Number.isFinite(value) && value > 0) setPaddingMultiplier(value);
              }}
            />
          </label>
          <p className="tile-demo__hint">
            The multiplier scales the base before the harmonic progression. Padding-derived radii
            scale with it; radius multiplier then controls their proportion.
          </p>
          <label>
            Type harmonic ratio
            <output>{harmonicName} ({harmonicRatio})</output>
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
          width: {width}px · base padding: {basePadding}px × {paddingMultiplier} · {harmonicName} (
          {harmonicRatio}) · radius multiplier: {radiusMultiplier}
        </p>
        <p>
          Auto mode follows the page breakpoints shared with typography: compact &lt; {PAGE_MODE_BREAKPOINTS.relaxed}px,
          relaxed &lt; {PAGE_MODE_BREAKPOINTS.spacious}px, spacious otherwise. The matching type ratio
          is applied to tile sizing; manual mode selects both together. Max-width still limits the Container width.
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
        <section className="tile-demo__values" aria-labelledby="tile-demo-values-heading">
          <h2 id="tile-demo-values-heading">Current values as Markdown</h2>
          <pre><code className="language-markdown">{markdownValues}</code></pre>
        </section>
      </Container>
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<TileParametricDemo />);
