import { type CSSProperties, type ReactNode, useState } from "react";
import { createRoot } from "react-dom/client";
import primitiveColors from "../../../tokens/primitive/color.json";
import semanticColors from "../../../tokens/semantic/color.json";
import { Container } from "../../molecules/container";
import { Tile } from "../../molecules/tile";
import { Text } from "../text";
import { getPrimaryFontFamily } from "../text/text.variants";
import { Button, buttonSizes, buttonVariants } from "./Button";
import "./story.css";

type ThemeStyle = CSSProperties & {
  [key: `--${string}`]: string;
};

function resolveSemanticColor(name: keyof typeof semanticColors): string {
  const token = semanticColors[name];
  if (token.$type !== "color" || typeof token.$value !== "string") {
    throw new TypeError(`Expected a semantic color token: ${name}`);
  }

  const match = /^\{([^{}]+)\}$/.exec(token.$value);
  if (!match) {
    throw new TypeError(`Expected a primitive color alias: ${name}`);
  }

  const primitive = primitiveColors[match[1] as keyof typeof primitiveColors];
  if (!primitive || primitive.$type !== "color" || typeof primitive.$value !== "string") {
    throw new Error(`Missing primitive color referenced by ${name}`);
  }

  return primitive.$value;
}

const theme: ThemeStyle = {
  "--paper": resolveSemanticColor("numa-color-context-background-default"),
  "--surface": resolveSemanticColor("numa-color-context-surface-level-1"),
  "--ink": resolveSemanticColor("numa-color-context-text-primary"),
  "--muted": resolveSemanticColor("numa-color-context-text-secondary"),
  "--line": resolveSemanticColor("numa-color-context-border-subtle"),
  "--accent": resolveSemanticColor("numa-color-interactive-text-primary"),
  "--font-family": getPrimaryFontFamily(),
};

function Preview({ label, children }: { label: string; children: ReactNode }) {
  return (
    <article className="preview">
      <Text variant="label" size="s" as="p" className="preview__label">
        {label}
      </Text>
      {children}
    </article>
  );
}

function StoryApp() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="button-story" style={theme}>
      <header className="hero">
        <div className="shell">
          <Text variant="display" size="m" as="h1">
            Button
          </Text>
          <Text variant="body" size="m" as="p">
            A reusable action atom using Foundation semantic colors, spacing, radius, and typography.
          </Text>
        </div>
      </header>

      <main className="shell">
        <section aria-labelledby="button-sizes-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" as="p" style={{ color: "var(--accent)" }}>
                Sizes
              </Text>
              <Text variant="headline" size="s" as="h2" id="button-sizes-heading">
                Size scale
              </Text>
            </div>
          </div>

          <Container size="m">
            <div className="button-group">
              {buttonSizes.map((size) => (
                <Button key={size} size={size} onClick={() => setClickCount((count) => count + 1)}>
                  {size.toUpperCase()} button
                </Button>
              ))}
            </div>
          </Container>
        </section>

        <section aria-labelledby="button-variants-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" as="p" style={{ color: "var(--accent)" }}>
                Variants
              </Text>
              <Text variant="headline" size="s" as="h2" id="button-variants-heading">
                Surface hierarchy
              </Text>
            </div>
          </div>

          <div className="preview-grid">
            {buttonVariants.map((variant) => (
              <Preview key={variant} label={variant}>
                <div className="button-stack">
                  <Button variant={variant} size="m">
                    Default
                  </Button>
                  <Button variant={variant} size="m" leadingIcon={<span aria-hidden="true">★</span>} trailingIcon={<span aria-hidden="true">→</span>}>
                    With icons
                  </Button>
                  <Button variant={variant} size="s" iconOnly aria-label={`${variant} action`}>
                    <span aria-hidden="true">＋</span>
                  </Button>
                  <Button variant={variant} size="m" disabled>
                    Disabled
                  </Button>
                  <Button variant={variant} size="m" loading>
                    Loading
                  </Button>
                </div>
              </Preview>
            ))}
          </div>
        </section>

        <section aria-labelledby="button-layout-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" as="p" style={{ color: "var(--accent)" }}>
                Layout
              </Text>
              <Text variant="headline" size="s" as="h2" id="button-layout-heading">
                Width and composition
              </Text>
            </div>
          </div>

          <div className="preview-grid">
            <Preview label="Full width">
              <div className="full-width-demo">
                <Button variant="primary" size="m" fullWidth>
                  Full-width action
                </Button>
              </div>
            </Preview>

            <Preview label="Tile surface">
              <Tile variant="m">
                <div className="button-stack">
                  <Button variant="secondary" size="m">
                    Secondary in context
                  </Button>
                  <Button variant="ghost" size="m">
                    Ghost action
                  </Button>
                </div>
              </Tile>
            </Preview>
          </div>
        </section>

        <Text variant="body" size="s" as="p" className="action-status" aria-live="polite">
          Button interactions: {clickCount} click{clickCount === 1 ? "" : "s"} recorded.
        </Text>
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<StoryApp />);
