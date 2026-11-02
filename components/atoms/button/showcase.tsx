import { type ReactNode, useState } from "react";
import { createRoot } from "react-dom/client";
import { showcaseFoundationStyle } from "../../showcase-foundation";
import { Card } from "../../molecules/card";
import { Container } from "../../molecules/container";
import { Page } from "../../molecules/page";
import { Tile } from "../../molecules/tile";
import { Text } from "../text";
import { Button, buttonSizes, buttonVariants } from "./Button";
import "./showcase.css";

function Preview({ label, children, surface = true }: { label: string; children: ReactNode; surface?: boolean }) {
  const content = (
    <>
      <Text variant="label" size="s" as="p" className="preview__label">
        {label}
      </Text>
      {children}
    </>
  );
  return (
    <article className="preview">
      {surface ? <Card className="preview__card">{content}</Card> : content}
    </article>
  );
}

function StoryApp() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <Page className="button-story" style={{ ...showcaseFoundationStyle, padding: 0 }}>
      <header className="hero">
        <div className="shell">
          <Text variant="display" size="m" as="h1">
            Button
          </Text>
          <Text variant="body" size="m" as="p">
            A native action atom using Foundation semantic colors, spacing, radius, and typography.
          </Text>
        </div>
      </header>

      <main className="shell">
        <section aria-labelledby="button-sizes-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" as="p" color="var(--numa-color-accent-content-default)">
                Sizes
              </Text>
              <Text variant="headline" size="s" as="h2" id="button-sizes-heading">
                Size scale
              </Text>
            </div>
          </div>

          <Container mode="relaxed">
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
              <Text variant="label" size="s" as="p" color="var(--numa-color-accent-content-default)">
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
              <Text variant="label" size="s" as="p" color="var(--numa-color-accent-content-default)">
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
                <Button variant="action" size="m" fullWidth>
                  Full-width action
                </Button>
              </div>
            </Preview>

            <Preview label="Tile surface" surface={false}>
              <Tile>
                <div className="button-stack">
                  <Button variant="outlined" size="m">
                    Outlined in context
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
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<StoryApp />);
