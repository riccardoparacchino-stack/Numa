import { useState, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import primitiveColors from "../../tokens/primitive/color.json";
import semanticColors from "../../tokens/semantic/color.json";
import { Text } from "../atoms/text";
import { getDefaultFontFamily } from "../atoms/text/text.variants";
import { Card } from "./card";
import { ContentCompositor } from "./content-compositor";
import { Container } from "./container";
import { Page } from "./page";
import { TextCompositor } from "./text-compositor";
import { Tile } from "./tile";
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
    throw new TypeError(`Expected a primitive alias for semantic color: ${name}`);
  }

  const primitive = primitiveColors[match[1] as keyof typeof primitiveColors];
  if (!primitive || primitive.$type !== "color") {
    throw new Error(`Missing primitive color referenced by ${name}`);
  }

  return primitive.$value;
}

const theme: ThemeStyle = {
  "--paper": resolveSemanticColor("numa-color-context-background-default"),
  "--surface": resolveSemanticColor("numa-color-context-surface-weak"),
  "--ink": resolveSemanticColor("numa-color-context-content-strong"),
  "--muted": resolveSemanticColor("numa-color-context-content-weak"),
  "--line": resolveSemanticColor("numa-color-context-outline-subtle"),
  "--accent": resolveSemanticColor("numa-color-accent-content-default"),
  "--font-family": getDefaultFontFamily(),
};

const alignments = ["start", "center", "end"] as const;
const gaps = [
  "numa-spacing-pebbles-xs",
  "numa-spacing-pebbles-s",
  "numa-spacing-pebbles-m",
  "numa-spacing-pebbles-l",
] as const;
const tileModes = ["compact", "relaxed", "spacious"] as const;
const actionKinds = ["static", "link", "button"] as const;

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

function MoleculeStory() {
  const [actionMessage, setActionMessage] = useState("Activate a button preview to test its action.");

  return (
    <Page className="molecule-story" style={theme}>
      <header className="hero">
        <div className="shell">
          <Text variant="display" size="m" as="h1">
            Molecules
          </Text>
          <Text variant="body" size="m" as="p">
            Live previews for Tile and Text Compositor. These use the shipped React Web components.
          </Text>
        </div>
      </header>

      <main className="shell">
        <section aria-labelledby="text-compositor-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Text Compositor</p>
              <Text variant="headline" size="s" as="h2" id="text-compositor-heading">
                Alignment × gap
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              All 12 combinations: three logical alignments and four semantic gap options.
            </Text>
          </div>
          <div className="preview-grid preview-grid--text">
            {alignments.flatMap((align) =>
              gaps.map((gap) => (
                <Preview key={`${align}-${gap}`} label={`${align} · ${gap.replace("numa-spacing-", "")}`}>
                  <TextCompositor
                    title="Clear, flexible title"
                    description="Supporting text wraps naturally within the available width."
                    align={align}
                    gap={gap}
                  />
                </Preview>
              )),
            )}
            <Preview label="Title only · no description gap">
              <TextCompositor title="A title without supporting copy" />
            </Preview>
          </div>
        </section>

        <section aria-labelledby="tile-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Tile</p>
              <Text variant="headline" size="s" as="h2" id="tile-heading">
                Density mode × behavior
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              All nine combinations: three container modes and static, link, or button behavior.
            </Text>
          </div>
          <div className="preview-grid preview-grid--tile">
            {tileModes.flatMap((mode) =>
              actionKinds.map((kind) => (
                <Preview key={`${mode}-${kind}`} label={`Tile · ${mode} · ${kind}`}>
                  <Container mode={mode}>
                    {kind === "link" ? (
                      <Tile href="#rules">
                        <ContentCompositor
                          leading={<span aria-hidden="true">✦</span>}
                          trailing={<span aria-hidden="true">→</span>}
                        >
                          <TextCompositor
                            title="A tile link"
                            description="Native anchor semantics and keyboard behavior."
                          />
                        </ContentCompositor>
                      </Tile>
                    ) : kind === "button" ? (
                      <Tile onClick={() => setActionMessage(`Activated ${mode} button Tile.`)}>
                        <ContentCompositor as="span" leading={<span aria-hidden="true">＋</span>}>
                          <TextCompositor title={`Activate ${mode} Tile`} />
                        </ContentCompositor>
                      </Tile>
                    ) : (
                      <Tile>
                        <ContentCompositor
                          leading={<span aria-hidden="true">◈</span>}
                          trailing={<span aria-hidden="true">•</span>}
                          footer="Optional footer"
                        >
                          <TextCompositor title="A static tile" description="Grouped, non-interactive content." />
                        </ContentCompositor>
                      </Tile>
                    )}
                  </Container>
                </Preview>
              )),
            )}
          </div>
          <Text variant="body" size="s" as="p" className="action-status" aria-live="polite">
            {actionMessage}
          </Text>
        </section>

        <section aria-labelledby="slots-heading">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Composition</p>
              <Text variant="headline" size="s" as="h2" id="slots-heading">
                Content Compositor
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              Leading, central content, trailing, and footer are arranged here—not by Tile.
            </Text>
          </div>
          <div className="preview-grid preview-grid--tile">
            <Preview label="Main content only">
              <Tile>
                <ContentCompositor>
                  <TextCompositor title="Content only" description="No leading or trailing region." />
                </ContentCompositor>
              </Tile>
            </Preview>
            <Preview label="Leading only">
              <Tile>
                <ContentCompositor leading={<span aria-hidden="true">★</span>} />
              </Tile>
            </Preview>
            <Preview label="Trailing only">
              <Tile>
                <ContentCompositor trailing={<span aria-hidden="true">✓</span>} />
              </Tile>
            </Preview>
            <Preview label="Footer only">
              <Tile>
                <ContentCompositor footer="The footer works without a main region." />
              </Tile>
            </Preview>
            <Preview label="Custom content">
              <Tile>
                <ContentCompositor
                  layout="vertical"
                  leading={<span aria-hidden="true">✦</span>}
                  trailing={<span aria-hidden="true">→</span>}
                >
                  <TextCompositor title="Custom arrangement" description="Compose existing atoms as needed." />
                </ContentCompositor>
              </Tile>
            </Preview>
            <Preview label="Disabled action">
              <Tile disabled onClick={() => setActionMessage("Disabled action unexpectedly activated.")}>
                Unavailable action
              </Tile>
            </Preview>
            <Preview label="Page Container with fieldset composition">
              <Container mode="compact">
                <fieldset>
                  <legend>Account settings</legend>
                  <p>Fieldsets and page-level compositions can sit directly in a Container.</p>
                  <Card>
                    <TextCompositor title="Profile card" description="A cohesive group inside the page surface." />
                  </Card>
                </fieldset>
              </Container>
            </Preview>
            {tileModes.map((mode) => {
              return (
                <Preview key={`nested-${mode}`} label={`Container, Card, and child Card · ${mode}`}>
                  <Container mode={mode}>
                    <ContentCompositor layout="vertical">
                      <TextCompositor
                        title="Page Container"
                        description={`Container sizing mode: ${mode}`}
                      />
                      <Card>
                        <ContentCompositor layout="vertical">
                          <TextCompositor
                            title="Card"
                            description="A cohesive content group."
                          />
                          <Card>
                            <ContentCompositor>
                              <TextCompositor
                                title="Card child"
                                description="A nested card group."
                              />
                            </ContentCompositor>
                          </Card>
                        </ContentCompositor>
                      </Card>
                    </ContentCompositor>
                  </Container>
                </Preview>
              );
            })}
          </div>
        </section>

        <section id="rules" aria-labelledby="rules-heading" className="rules">
          <Text variant="label" size="s" as="p" className="eyebrow">
            Usage rules
          </Text>
          <Text variant="headline" size="s" as="h2" id="rules-heading">
            Compose with intent
          </Text>
          <ul>
            <li>
              <Text variant="body" size="m" as="span">
                Use TextCompositor for title and optional description; choose semantic Text elements by document structure.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Use Container as a sizing/query boundary; use Card for cohesive groups and one nested Card for child groups.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Containers may hold fieldsets and other compositions without wrapping them in cards. Use native fieldset and legend semantics for form groups.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Container sets the inherited density mode; Tile padding and radius are generated from the harmonic scale.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Use Page for the semantic page background, Container for sizing, and Tile for contained surfaces.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Use Tile as the low-level surface primitive and Container as an optional responsive sizing boundary.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Use ContentCompositor for optional leading/trailing/footer regions; custom children can compose other layouts.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Do not put independent controls inside interactive Cards; choose native links for navigation and buttons for one action.
              </Text>
            </li>
            <li>
              <Text variant="body" size="m" as="span">
                Selectable and expandable Tiles are not implemented. Use native selection or disclosure controls.
              </Text>
            </li>
          </ul>
        </section>
      </main>
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<MoleculeStory />);
