import { useState, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Callout } from "../atoms/callout";
import { Code, CodeBlock } from "../atoms/code";
import { Link } from "../atoms/link";
import { List, ListItem } from "../atoms/list";
import { Table } from "../atoms/table";
import { Text } from "../atoms/text";
import { showcaseFoundationStyle } from "../showcase-foundation";
import { Card } from "./card";
import { ContentCompositor } from "./content-compositor";
import { Container } from "./container";
import { Page } from "./page";
import { TextCompositor } from "./text-compositor";
import { Tile } from "./tile";
import "./story.css";

const alignments = ["start", "center", "end"] as const;
const gaps = [
  "numa-spacing-pebbles-xs",
  "numa-spacing-pebbles-s",
  "numa-spacing-pebbles-m",
  "numa-spacing-pebbles-l",
] as const;
const tileModes = ["compact", "relaxed", "spacious"] as const;
const actionKinds = ["static", "link", "button"] as const;

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

function MoleculeStory() {
  const [actionMessage, setActionMessage] = useState("Activate a button preview to test its action.");

  return (
    <Page className="molecule-story" style={{ ...showcaseFoundationStyle, padding: 0 }}>
      <header className="hero">
        <div className="shell">
          <Text variant="display" size="m" as="h1">
            Molecules
          </Text>
          <Text variant="body" size="m" as="p">
            Live previews for every shipped molecule, composed with the document atoms and Foundation tokens.
          </Text>
        </div>
      </header>

      <main className="shell">
        <section aria-labelledby="text-compositor-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" className="eyebrow">Text Compositor</Text>
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

        <section aria-labelledby="text-customization-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" className="eyebrow">TextCompositor</Text>
              <Text variant="headline" size="s" as="h2" id="text-customization-heading">
                Five title compositions
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              Visual typography and the title element are selected independently through the existing Text props.
            </Text>
          </div>
          <div className="preview-grid preview-grid--text">
            <Preview label="1 · Default title and description">
              <TextCompositor title="Workspace" description="Manage members and settings." />
            </Preview>
            <Preview label="2 · Headline style, heading element">
              <h3 className="compositor-semantic">
                <TextCompositor
                  title="Project overview"
                  description="A prominent section title."
                  titleTypography={{ variant: "headline", size: "s" }}
                />
              </h3>
            </Preview>
            <Preview label="3 · Same style, non-heading element">
              <div className="compositor-semantic">
                <TextCompositor
                  title="Project overview"
                  description="Identical visual treatment, different meaning."
                  titleTypography={{ variant: "headline", size: "s" }}
                />
              </div>
            </Preview>
            <Preview label="4 · Custom color, heading element">
              <h3 className="compositor-semantic compositor-semantic--accent">
                <TextCompositor
                  title="Attention to detail"
                  description="The accent comes from the semantic Foundation color."
                  titleTypography={{ variant: "title", size: "m" }}
                />
              </h3>
            </Preview>
            <Preview label="5 · Centered title with smaller description">
              <div className="compositor-semantic">
                <TextCompositor
                  title="A centered group"
                  description="Description typography is independently configurable."
                  align="center"
                  titleTypography={{ variant: "title", size: "m" }}
                  descriptionTypography={{ variant: "body", size: "s" }}
                />
              </div>
            </Preview>
          </div>
        </section>

        <section aria-labelledby="tile-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" className="eyebrow">Tile</Text>
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
              <Text variant="label" size="s" className="eyebrow">Composition</Text>
              <Text variant="headline" size="s" as="h2" id="slots-heading">
                Content Compositor
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              Leading, central content, trailing, and footer are arranged here—not by Tile.
            </Text>
          </div>
          <div className="preview-grid preview-grid--tile">
            <Preview label="Main content only" surface={false}>
              <Tile>
                <ContentCompositor>
                  <TextCompositor title="Content only" description="No leading or trailing region." />
                </ContentCompositor>
              </Tile>
            </Preview>
            <Preview label="Leading only" surface={false}>
              <Tile>
                <ContentCompositor leading={<span aria-hidden="true">★</span>} />
              </Tile>
            </Preview>
            <Preview label="Trailing only" surface={false}>
              <Tile>
                <ContentCompositor trailing={<span aria-hidden="true">✓</span>} />
              </Tile>
            </Preview>
            <Preview label="Footer only" surface={false}>
              <Tile>
                <ContentCompositor footer="The footer works without a main region." />
              </Tile>
            </Preview>
            <Preview label="Custom content" surface={false}>
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
            <Preview label="Disabled action" surface={false}>
              <Tile disabled onClick={() => setActionMessage("Disabled action unexpectedly activated.")}>
                Unavailable action
              </Tile>
            </Preview>
            <Preview label="Page Container with fieldset composition" surface={false}>
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
                <Preview key={`nested-${mode}`} label={`Container, Card, and child Card · ${mode}`} surface={false}>
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

        <section aria-labelledby="api-reference-heading">
          <div className="section-heading">
            <div>
              <Text variant="label" size="s" className="eyebrow">API references</Text>
              <Text variant="headline" size="s" as="h2" id="api-reference-heading">
                Molecules in this showcase
              </Text>
            </div>
            <Text variant="body" size="m" as="p">
              Each listed component has a live example above and a local API guide.
            </Text>
          </div>
          <Table aria-label="Molecules and their component guides">
            <caption><Text variant="title" size="s">Molecule API guides</Text></caption>
            <thead>
              <tr>
                <th scope="col"><Text variant="label" size="m">Component</Text></th>
                <th scope="col"><Text variant="label" size="m">Guide</Text></th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Page", "page"],
                ["Container", "container"],
                ["Card", "card"],
                ["Tile", "tile"],
                ["TextCompositor", "text-compositor"],
                ["ContentCompositor", "content-compositor"],
              ].map(([name, slug]) => (
                <tr key={slug}>
                  <th scope="row"><Text variant="body" size="m">{name}</Text></th>
                  <td><Link href={`./${slug}/README.md`}>Read {name} API</Link></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className="api-reference-examples">
            <Callout>
              <Text variant="body" size="m" as="p">
                No <Code>Stack</Code> component is present in this repository. These showcase-only responsive grids remain page layout; their repeated gaps resolve semantic spacing tokens.
              </Text>
            </Callout>
            <CodeBlock aria-label="Page and content composition example">{`<Page>\n  <Container mode="relaxed">\n    <Card>\n      <ContentCompositor>\n        <TextCompositor title="Workspace" description="Manage settings" />\n      </ContentCompositor>\n    </Card>\n  </Container>\n</Page>`}</CodeBlock>
          </div>
        </section>

        <section id="rules" aria-labelledby="rules-heading" className="rules">
          <Text variant="label" size="s" as="p" className="eyebrow">
            Usage rules
          </Text>
          <Text variant="headline" size="s" as="h2" id="rules-heading">
            Compose with intent
          </Text>
          <List className="rules-list">
            <ListItem>
              <Text variant="body" size="m" as="span">
                Use TextCompositor for title and optional description; choose semantic Text elements by document structure.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Use Container as a sizing/query boundary; use Card for cohesive groups and one nested Card for child groups.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Containers may hold fieldsets and other compositions without wrapping them in cards. Use native fieldset and legend semantics for form groups.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Container sets the inherited density mode; Tile padding and radius are generated from the harmonic scale.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Use Page for the semantic page background, Container for sizing, and Tile for contained surfaces.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Use Tile as the low-level surface primitive and Container as an optional responsive sizing boundary.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Use ContentCompositor for optional leading/trailing/footer regions; custom children can compose other layouts.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Do not put independent controls inside interactive Cards; choose native links for navigation and buttons for one action.
              </Text>
            </ListItem>
            <ListItem>
              <Text variant="body" size="m" as="span">
                Selectable and expandable Tiles are not implemented. Use native selection or disclosure controls.
              </Text>
            </ListItem>
          </List>
        </section>
      </main>
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<MoleculeStory />);
