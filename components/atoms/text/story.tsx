import { useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import colorTokens from "../../../tokens/primitive/color.json";
import semanticColorTokens from "../../../tokens/semantic/color.json";
import {
  getDefaultTextWeight,
  getDefaultFontFamily,
  getTextTypography,
  textVariants,
  type TextVariant,
} from "./text.variants";
import { Text, type TextProps } from "./Text";
import {
  letterSpacingOptions,
  resolveLetterSpacing,
  type FontSizeToken,
  type LetterSpacingOption,
} from "../../../foundation/typography/letter-spacing";
import "./story.css";

type StorySize = "s" | "m" | "l";
type StoryElement = "span" | "p" | "div" | "h1" | "h2" | "h3" | "a" | "label" | "code" | "small" | "strong" | "th" | "td";
type StoryTextProps = {
  variant: TextVariant;
  size: StorySize;
  as?: StoryElement;
  className?: string;
  color?: CSSProperties["color"];
  fontWeight?: CSSProperties["fontWeight"];
  fontFamily?: CSSProperties["fontFamily"];
  style?: ThemeProperties;
  letterSpacing?: LetterSpacingOption;
  href?: string;
  htmlFor?: string;
  id?: string;
  scope?: "col";
  children: ReactNode;
};

type ThemeProperties = CSSProperties & {
  [key: `--${string}`]: string;
};

const harmonicRatios = [
  { name: "Minor second", value: 1.067 },
  { name: "Major second", value: 1.125 },
  { name: "Minor third", value: 1.2 },
  { name: "Major third", value: 1.25 },
  { name: "Perfect fourth", value: 1.333 },
  { name: "Augmented fourth", value: 1.414 },
  { name: "Perfect fifth", value: 1.5 },
  { name: "Golden ratio", value: 1.618 },
] as const;

function resolveSemanticColor(name: keyof typeof semanticColorTokens): string {
  const token = semanticColorTokens[name];
  if (token.$type !== "color") {
    throw new TypeError(`Expected a semantic color token: ${name}`);
  }

  const match = /^\{([^{}]+)\}$/.exec(token.$value);
  if (!match) {
    throw new TypeError(`Semantic color must alias a primitive color: ${name}`);
  }

  const primitive = colorTokens[match[1] as keyof typeof colorTokens];
  if (!primitive || primitive.$type !== "color" || typeof primitive.$value !== "string") {
    throw new Error(`Missing primitive color referenced by ${name}: ${match[1]}`);
  }

  return primitive.$value;
}

const palette = {
  ink: resolveSemanticColor("numa-color-context-content-strong"),
  muted: resolveSemanticColor("numa-color-context-content-weak"),
  tertiary: resolveSemanticColor("numa-color-context-content-weak"),
  line: resolveSemanticColor("numa-color-context-outline-subtle"),
  paper: resolveSemanticColor("numa-color-context-background-default"),
  surface: resolveSemanticColor("numa-color-context-surface-weak"),
  accent: resolveSemanticColor("numa-color-accent-content-default"),
  accentSurface: resolveSemanticColor("numa-color-interactive-surface-action-default"),
  accentText: resolveSemanticColor("numa-color-interactive-content-on-action"),
  focus: resolveSemanticColor("numa-color-interactive-outline-focus"),
  focusOnAccent: resolveSemanticColor("numa-color-interactive-outline-focus-on-action-inner"),
  subtleHover: resolveSemanticColor("numa-color-interactive-surface-subtle-hover"),
} as const;

const themeStyle: ThemeProperties = {
  "--ink": palette.ink,
  "--muted": palette.muted,
  "--tertiary": palette.tertiary,
  "--line": palette.line,
  "--paper": palette.paper,
  "--surface": palette.surface,
  "--accent": palette.accent,
  "--accent-surface": palette.accentSurface,
  "--accent-text": palette.accentText,
  "--focus": palette.focus,
  "--focus-on-accent": palette.focusOnAccent,
  "--subtle-hover": palette.subtleHover,
  "--font-family": getDefaultFontFamily(),
};

const variants = Object.keys(textVariants) as TextVariant[];
const sample = "Clear words. Thoughtful hierarchy.";
const elements: StoryElement[] = ["span", "p", "div", "h1", "h2", "h3"];

function StoryText(props: StoryTextProps) {
  const { variant, size, as = "span", children, ...rest } = props;
  if (!(size in textVariants[variant])) {
    throw new RangeError(`Unsupported Text story variant/size combination: ${variant}/${size}`);
  }
  const textProps = { variant, size, as, ...rest } as TextProps<ElementType>;
  return <Text {...textProps}>{children}</Text>;
}

function metricsFor(variant: TextVariant, size: StorySize) {
  const typography = getTextTypography(variant, size);
  const fontSize = Number.parseFloat(typography.fontSize) * 16;
  const lineHeight = Number.parseFloat(typography.lineHeight) * 16;
  return {
    fontSizeToken: typography.fontSizeToken,
    fontSize,
    lineHeight,
    fontSizeRem: typography.fontSize,
    lineHeightRem: typography.lineHeight,
  };
}

function trackingFor(fontSizeToken: FontSizeToken) {
  return Object.fromEntries(
    letterSpacingOptions.map((option) => [
      option,
      resolveLetterSpacing(fontSizeToken, option),
    ]),
  ) as Record<LetterSpacingOption, string>;
}

function Code({ children }: { children: ReactNode }) {
  return (
    <StoryText variant="label" size="s" as="code" className="inline-code">
      {children}
    </StoryText>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  id,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  id: string;
}) {
  return (
    <header className="section-heading">
      <div>
        <StoryText variant="label" size="s" className="section-kicker">{eyebrow}</StoryText>
        <StoryText variant="title" size="m" as="h2" id={id}>{title}</StoryText>
      </div>
      <StoryText variant="body" size="m" as="p" className="section-description">
        {description}
      </StoryText>
    </header>
  );
}

function StoryApp() {
  const [variant, setVariant] = useState<TextVariant>("body");
  const [size, setSize] = useState<StorySize>("m");
  const [element, setElement] = useState<StoryElement>("p");
  const [letterSpacing, setLetterSpacing] = useState<LetterSpacingOption>("relaxed");
  const [harmonicRatio, setHarmonicRatio] = useState<number>(1.2);

  const selectedMetrics = metricsFor(variant, size);
  const selectedTracking = resolveLetterSpacing(selectedMetrics.fontSizeToken, letterSpacing);
  const selectedToken = `numa-text-letter-spacing-${letterSpacing}-${selectedMetrics.fontSizeToken
    .replace("numa-text-size-", "")}`;
  const availableSizes = Object.keys(textVariants[variant]) as StorySize[];
  const fontSizes = Array.from(
    new Map(
      variants.flatMap((name) =>
        (Object.keys(textVariants[name]) as StorySize[]).map((textSize) => {
          const metrics = metricsFor(name, textSize);
          return [metrics.fontSize, metrics] as const;
        }),
      ),
    ).values(),
  ).sort((a, b) => a.fontSize - b.fontSize);
  const scaleSamples = variants.flatMap((name) =>
    (Object.keys(textVariants[name]) as StorySize[]).map((textSize) => {
      const metrics = metricsFor(name, textSize);
      const step = fontSizes.findIndex((fontSize) => fontSize.fontSize === metrics.fontSize);
      const generatedFontSize = 16 * harmonicRatio ** (step - 2);
      return {
        variant: name,
        size: textSize,
        metrics,
        generatedFontSize,
        generatedLineHeight: generatedFontSize * (metrics.lineHeight / metrics.fontSize),
      };
    }),
  );

  return (
    <div className="story-theme" style={themeStyle}>
      <header className="hero">
        <div className="shell">
          <StoryText variant="label" size="s" className="eyebrow">Numa · Atoms · React Web</StoryText>
          <StoryText variant="display" size="l" as="h1" className="hero-title">
            Text, with intent.
          </StoryText>
          <StoryText variant="body" size="l" as="p" className="hero-copy">
            One typography atom. Five visual variants. HTML semantics remain a
            deliberate choice made for the content, not inferred from its size.
          </StoryText>
          <div className="status-row" aria-label="Implementation status">
            <span className="pill"><StoryText variant="label" size="s">13 supported variant / size pairs</StoryText></span>
            <span className="pill"><StoryText variant="label" size="s">Foundation-backed typography</StoryText></span>
            <span className="pill note"><StoryText variant="label" size="s">Web only · no font loader</StoryText></span>
          </div>
        </div>
      </header>

      <div className="shell">
        <nav className="story-nav" aria-label="Story sections">
          {[
            ["#specimens", "Specimens"],
            ["#playground", "Playground"],
            ["#semantics", "Semantics"],
            ["#scale", "Type scale"],
            ["#rules", "Component rules"],
            ["#references", "References"],
          ].map(([href, label]) => (
            <StoryText key={href} variant="label" size="m" as="a" href={href}>{label}</StoryText>
          ))}
        </nav>

        <main>
          <section id="specimens" aria-labelledby="specimens-title">
            <SectionHeading
              eyebrow="01 · Visual language"
              title="Variant specimens"
              id="specimens-title"
              description="Each card shows every supported size. Labels show the implemented font size, line height, default weight, and relaxed tracking."
            />
            <div className="variant-grid">
              {variants.map((name) => {
                const sizes = Object.keys(textVariants[name]) as StorySize[];
                return (
                  <article className="variant-card card" key={name}>
                    <div className="variant-topline">
                      <StoryText variant="title" size="s" as="h3" className="variant-name">
                        {name}
                      </StoryText>
                      <span className="tag">
                        <StoryText variant="label" size="s" color={palette.accent}>
                          default weight {getDefaultTextWeight(name)}
                        </StoryText>
                      </span>
                    </div>
                    {sizes.map((textSize) => {
                      const dimensions = metricsFor(name, textSize);
                      const tracking = resolveLetterSpacing(dimensions.fontSizeToken, "relaxed");
                      return (
                        <div className="specimen" key={`${name}-${textSize}`}>
                          <StoryText variant={name} size={textSize} className="variant-sample">
                            {sample}
                          </StoryText>
                          <div className="sample-meta">
                            <StoryText variant="label" size="s">{textSize}</StoryText>
                            <StoryText variant="label" size="s">
                              {dimensions.fontSize}px / {dimensions.lineHeight}px line · relaxed {tracking}
                            </StoryText>
                          </div>
                        </div>
                      );
                    })}
                  </article>
                );
              })}
            </div>
          </section>

          <section id="playground" aria-labelledby="playground-title">
            <SectionHeading
              eyebrow="02 · Try a combination"
              title="Live typography playground"
              id="playground-title"
              description="Change visual treatment and HTML element independently. The displayed tag never changes the selected typography."
            />
            <div className="interactive-card card">
              <form className="controls">
                <div className="control">
                  <StoryText variant="label" size="m" as="label" htmlFor="variant">Variant</StoryText>
                  <select
                    id="variant"
                    value={variant}
                    onChange={(event) => {
                      const nextVariant = event.currentTarget.value as TextVariant;
                      setVariant(nextVariant);
                      setSize((current) =>
                        (Object.keys(textVariants[nextVariant]) as StorySize[]).includes(current)
                          ? current
                          : "s",
                      );
                    }}
                  >
                    {variants.map((name) => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
                <div className="control">
                  <StoryText variant="label" size="m" as="label" htmlFor="size">Size</StoryText>
                  <select id="size" value={size} onChange={(event) => setSize(event.currentTarget.value as StorySize)}>
                    {availableSizes.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </div>
                <div className="control">
                  <StoryText variant="label" size="m" as="label" htmlFor="element">HTML element</StoryText>
                  <select id="element" value={element} onChange={(event) => setElement(event.currentTarget.value as StoryElement)}>
                    {elements.map((value) => <option key={value} value={value}>{value}</option>)}
                  </select>
                </div>
                <div className="control">
                  <StoryText variant="label" size="m" as="label" htmlFor="letter-spacing">Letter spacing</StoryText>
                  <select
                    id="letter-spacing"
                    value={letterSpacing}
                    onChange={(event) => setLetterSpacing(event.currentTarget.value as LetterSpacingOption)}
                  >
                    {letterSpacingOptions.map((value) => (
                      <option key={value} value={value}>
                        {value}{value === "relaxed" ? " (default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <StoryText variant="body" size="m" as="p" className="control-note">
                  No role is added automatically. Choose a heading element only
                  when the content belongs in the document outline. Tracking
                  presets resolve to named Foundation tokens for the selected
                  font size. Relaxed is the default.
                </StoryText>
              </form>
              <div className="preview">
                <StoryText variant="label" size="s" className="preview-label">Rendered sample</StoryText>
                <div className="preview-sample" aria-live="polite">
                  <StoryText
                    variant={variant}
                    size={size}
                    as={element}
                    className="live-preview"
                    letterSpacing={letterSpacing}
                  >
                    {sample}
                  </StoryText>
                </div>
                <StoryText variant="label" size="s" as="code" className="preview-code">
                  {`<Text variant="${variant}" size="${size}" as="${element}"${
                    letterSpacing === "relaxed" ? "" : ` letterSpacing="${letterSpacing}"`
                  }>…</Text> · ${selectedMetrics.fontSize}px / ${selectedMetrics.lineHeight}px · weight ${getDefaultTextWeight(variant)} · ${selectedToken}: ${selectedTracking}`}
                </StoryText>
              </div>
            </div>
          </section>

          <section id="semantics" aria-labelledby="semantics-title">
            <SectionHeading
              eyebrow="03 · Accessibility by design"
              title="Same look. Different meaning."
              id="semantics-title"
              description="A visual style is not a document outline. Choose the semantic tag that matches the role of the content."
            />
            <div className="semantic-grid">
              <article className="semantic-card card">
                <StoryText variant="label" size="m" as="h3" className="semantic-title">Page heading</StoryText>
                <StoryText variant="display" size="l" as="h1" className="semantic-sample">A new chapter</StoryText>
                <StoryText variant="label" size="s" as="small" className="semantic-meta">display / l · &lt;h1&gt;</StoryText>
              </article>
              <article className="semantic-card card">
                <StoryText variant="label" size="m" as="h3" className="semantic-title">Prominent non-heading</StoryText>
                <StoryText variant="display" size="l" as="div" className="semantic-sample">A new chapter</StoryText>
                <StoryText variant="label" size="s" as="small" className="semantic-meta">display / l · &lt;div&gt;</StoryText>
              </article>
              <article className="semantic-card card">
                <StoryText variant="label" size="m" as="h3" className="semantic-title">Section heading</StoryText>
                <StoryText variant="title" size="m" as="h3" className="semantic-sample">Your preferences</StoryText>
                <StoryText variant="label" size="s" as="small" className="semantic-meta">title / m · &lt;h3&gt;</StoryText>
              </article>
              <article className="semantic-card card">
                <StoryText variant="label" size="m" as="h3" className="semantic-title">Paragraph</StoryText>
                <StoryText variant="body" size="m" as="p" className="semantic-sample">
                  Manage the details that make this experience yours.
                </StoryText>
                <StoryText variant="label" size="s" as="small" className="semantic-meta">body / m · &lt;p&gt;</StoryText>
              </article>
            </div>
            <aside className="callout">
              <StoryText variant="body" size="m" as="p">
                <StoryText variant="title" size="s" as="strong">Native semantics first.</StoryText>{" "}
                Text defaults to a <Code>span</Code>; it does not infer a heading
                or ARIA role. Applicable native attributes, <Code>aria-*</Code>,
                and <Code>data-*</Code> props are forwarded to the chosen element.
              </StoryText>
            </aside>
          </section>

          <section id="scale" aria-labelledby="scale-title">
            <SectionHeading
              eyebrow="04 · Harmonic configurations"
              title="Harmonic scale explorer"
              id="scale-title"
              description="Compare harmonic-ratio configurations across every Text style. The Foundation scale currently used by Text remains documented below."
            />
            <div className="scale-explorer card">
              <div className="scale-explorer-heading">
                <div>
                  <StoryText variant="title" size="s" as="h3">Test a harmonic ratio</StoryText>
                  <StoryText variant="body" size="s" as="p">
                    Select a ratio to generate a geometric scale. The 16px
                    base is anchored at the current 16px Foundation step; all
                    13 styles are previewed at their corresponding scale step.
                  </StoryText>
                </div>
                <div className="scale-picker">
                  <StoryText variant="label" size="m" as="label" htmlFor="harmonic-ratio">
                    Harmonic ratio
                  </StoryText>
                  <select
                    id="harmonic-ratio"
                    value={harmonicRatio}
                    onChange={(event) => setHarmonicRatio(Number(event.currentTarget.value))}
                  >
                    {harmonicRatios.map(({ name, value }) => (
                      <option key={value} value={value}>
                        {name} · {value.toFixed(3)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <StoryText variant="label" size="s" as="p" className="scale-selection-status" aria-live="polite">
                Ratio {harmonicRatio.toFixed(3)} · 16px base · {fontSizes.length} steps · {scaleSamples.length} style previews
              </StoryText>
              <div className="scale-preview-grid">
                {scaleSamples.map(({ variant: name, size: textSize, metrics, generatedFontSize, generatedLineHeight }) => (
                  <article className="scale-preview-card" key={`${name}-${textSize}`}>
                    <StoryText variant="label" size="s" className="scale-preview-name">
                      {name} / {textSize}
                    </StoryText>
                    <StoryText
                      variant={name}
                      size={textSize}
                      className="scale-preview-sample scale-generated-sample"
                      style={{
                        "--generated-font-size": `${generatedFontSize}px`,
                        "--generated-line-height": `${generatedLineHeight}px`,
                      }}
                    >
                      The quick brown fox
                    </StoryText>
                    <StoryText variant="label" size="s" className="scale-preview-meta">
                      {generatedFontSize.toFixed(1)}px · {harmonicRatio.toFixed(3)} ratio step · weight {getDefaultTextWeight(name)}
                    </StoryText>
                  </article>
                ))}
              </div>
            </div>
            <StoryText variant="title" size="s" as="h3" className="foundation-scale-heading">
              Foundation scale currently used by Text
            </StoryText>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {["Font size", "Rem", "Compact", "Relaxed", "Spacious", "Next step", "Adjacent ratio", "Used by"].map((heading) => (
                      <StoryText key={heading} variant="label" size="s" as="th" scope="col">{heading}</StoryText>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fontSizes.map((metrics, index) => {
                    const tracking = trackingFor(metrics.fontSizeToken);
                    const next = fontSizes[index + 1];
                    const usedBy = variants.flatMap((name) =>
                      (Object.keys(textVariants[name]) as StorySize[])
                        .filter((textSize) => metricsFor(name, textSize).fontSize === metrics.fontSize)
                        .map((textSize) => `${name}/${textSize}`),
                    ).join(", ");
                    return (
                      <tr key={metrics.fontSize}>
                        <StoryText variant="body" size="s" as="td">{metrics.fontSize}px</StoryText>
                        <StoryText variant="body" size="s" as="td">{metrics.fontSize / 16}rem</StoryText>
                        <StoryText variant="body" size="s" as="td">{tracking.compact}</StoryText>
                        <StoryText variant="body" size="s" as="td">{tracking.relaxed}</StoryText>
                        <StoryText variant="body" size="s" as="td">{tracking.spacious}</StoryText>
                        <StoryText variant="body" size="s" as="td">{next ? `${next.fontSize}px` : "—"}</StoryText>
                        <StoryText variant="body" size="s" as="td" className="ratio">
                          {next ? `${(next.fontSize / metrics.fontSize).toFixed(3)}×` : "—"}
                        </StoryText>
                        <StoryText variant="body" size="s" as="td">{usedBy}</StoryText>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="scale-bars" aria-hidden="true">
              {fontSizes.map((metrics) => (
                <div className="scale-row" key={metrics.fontSize}>
                  <StoryText variant="label" size="s">{metrics.fontSize}px</StoryText>
                  <div className="bar-track">
                    <div className="bar" style={{ width: `${(metrics.fontSize / fontSizes[fontSizes.length - 1].fontSize) * 100}%` }} />
                  </div>
                  <StoryText variant="label" size="s">{metrics.fontSize / 16}rem</StoryText>
                </div>
              ))}
            </div>
            <aside className="callout">
              <StoryText variant="body" size="m" as="p">
                The ratio explorer is an illustration for comparing generated
                scales; it does not change Text’s Foundation token mapping.
                Adjacent steps in the implemented scale vary, so it remains a
                discrete, hand-specified scale rather than a geometric
                progression. Line-height tokens are separate fixed values,
                paired explicitly per variant and size. Letter-spacing presets
                are size-aware, expressed in em, and independent of line
                height; relaxed is used when the prop is omitted.
              </StoryText>
            </aside>
          </section>

          <section id="rules" aria-labelledby="rules-title">
            <SectionHeading
              eyebrow="05 · Implementation contract"
              title="Rules future work must preserve"
              id="rules-title"
              description="These requirements describe the implemented component and repository guidance; they are not optional styling preferences."
            />
            <div className="rule-grid">
              <Rule title="Inspect before extending">
                Read the existing implementation, package scripts, Foundation
                definitions, and component README before adding a new pattern
                or expanding platform support.
              </Rule>
              <Rule title="Use existing components and tokens">
                Prefer existing Numa components and Foundation tokens in
                application UI, demos, stories, and examples instead of
                recreating their behavior or copying their values.
              </Rule>
              <Rule title="Foundation owns shared values">
                Consume named typography tokens from <Code>tokens/typography/text.json</Code>.
                Use semantic color tokens for presentation, and do not duplicate
                Foundation values or invent component token layers.
              </Rule>
              <Rule title="Variant is not semantics">
                Select headings and other HTML elements according to document
                structure with <Code>as</Code>. Visual variants never infer
                tags, heading levels, or roles.
              </Rule>
              <Rule title="Protect the type mapping">
                Font size and line height are exclusively controlled by
                variant and size. Invalid pairs are rejected by TypeScript and
                throw at runtime when supplied by untyped callers.
              </Rule>
              <Rule title="Accessibility is part of the API">
                Preserve native semantics, forward valid element and
                accessibility attributes, and apply a role only when the
                caller explicitly supplies one.
              </Rule>
              <Rule title="Document and test changes">
                Update the component README, index, relevant Foundation docs,
                and tests with implementation changes. Verify links; do not
                describe unimplemented platforms or font loading as available.
              </Rule>
            </div>
          </section>

          <section id="references" aria-labelledby="references-title">
            <SectionHeading
              eyebrow="06 · Source documents"
              title="Read the implementation"
              id="references-title"
              description="This story is a visual companion to the source documentation, not a replacement for it."
            />
            <div className="docs-links">
              <StoryText variant="body" size="m" as="a" href="./README.md">Text Atom API and specification</StoryText>
              <StoryText variant="body" size="m" as="a" href="../../../docs/foundation/typography.md">Foundation Typography</StoryText>
              <StoryText variant="body" size="m" as="a" href="../../../docs/foundation/semantic-colors.md">Foundation Semantic Colors</StoryText>
              <StoryText variant="body" size="m" as="a" href="../../../docs/decisions/0001-foundation-text-typography.md">ADR 0001 · Typography decision</StoryText>
              <StoryText variant="body" size="m" as="a" href="../../../.github/skills/numa-components/SKILL.md">Component-development skill</StoryText>
              <StoryText variant="body" size="m" as="a" href="../../../.github/copilot-instructions.md">Repository Copilot instructions</StoryText>
            </div>
          </section>
        </main>
      </div>

      <footer className="story-footer">
        <div className="shell">
          <StoryText variant="label" size="s">
            Numa Text Atom · React Web story · Typography and semantic color values from Foundation · No external fonts or network requests.
          </StoryText>
        </div>
      </footer>
    </div>
  );
}

function Rule({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="rule-card card">
      <StoryText variant="title" size="s" as="h3" className="rule-title">{title}</StoryText>
      <StoryText variant="body" size="m" as="p" className="rule-description">{children}</StoryText>
    </article>
  );
}

createRoot(document.getElementById("root")!).render(<StoryApp />);
