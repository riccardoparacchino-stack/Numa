import { createRoot } from "react-dom/client";
import { Callout } from "./callout";
import { Code, CodeBlock } from "./code";
import { Link } from "./link";
import { List, ListItem } from "./list";
import { Table } from "./table";
import { Text } from "./text";
import { Container } from "../molecules/container";
import { Page } from "../molecules/page";
import { showcaseFoundationStyle } from "../showcase-foundation";
import "./story.css";

function ContentStory() {
  return (
    <Page className="content-story" style={showcaseFoundationStyle}>
      <Container mode="relaxed">
        <header className="content-story__header">
          <Text variant="display" size="m" as="h1">Document content</Text>
          <Text variant="body" size="l" as="p">
            Reusable content atoms keep native HTML semantics in the hands of the composition.
          </Text>
        </header>
        <main className="content-story__sections">
          <section aria-labelledby="links-heading">
            <Text variant="headline" size="s" as="h2" id="links-heading">Links</Text>
            <Text variant="body" size="m" as="p">
              Read the <Link href="../../docs/foundation/semantic-colors.md">semantic color guidance</Link> or continue in this page.
            </Text>
          </section>
          <section aria-labelledby="lists-heading">
            <Text variant="headline" size="s" as="h2" id="lists-heading">Lists</Text>
            <List aria-label="Component principles">
              <ListItem><Text variant="body" size="m">Choose semantics from the content.</Text></ListItem>
              <ListItem><Text variant="body" size="m">Compose existing Numa components.</Text></ListItem>
            </List>
          </section>
          <section aria-labelledby="code-heading">
            <Text variant="headline" size="s" as="h2" id="code-heading">Code</Text>
            <Text variant="body" size="m" as="p">Use <Code>aria-describedby</Code> to associate supporting text.</Text>
            <CodeBlock aria-label="React example">{`<Link href="/docs">Documentation</Link>\n<List listType="ordered">…</List>`}</CodeBlock>
          </section>
          <section aria-labelledby="callout-heading">
            <Text variant="headline" size="s" as="h2" id="callout-heading">Callout</Text>
            <Callout>
              <Text variant="body" size="m" as="p">Static guidance has no implicit alert or status role. Add text when a message needs a specific meaning.</Text>
            </Callout>
          </section>
          <section aria-labelledby="table-heading">
            <Text variant="headline" size="s" as="h2" id="table-heading">Table</Text>
            <Table>
              <caption><Text variant="title" size="s">Foundation source and its consumer</Text></caption>
              <thead><tr><th scope="col"><Text variant="label" size="m">Definition</Text></th><th scope="col"><Text variant="label" size="m">Consumer</Text></th></tr></thead>
              <tbody>
                <tr><th scope="row"><Text variant="body" size="m">Typography</Text></th><td><Link href="../../docs/foundation/typography.md">Text</Link></td></tr>
                <tr><th scope="row"><Text variant="body" size="m">Semantic spacing</Text></th><td><Code>List</Code> and <Code>Table</Code></td></tr>
              </tbody>
            </Table>
          </section>
        </main>
      </Container>
    </Page>
  );
}

createRoot(document.getElementById("root")!).render(<ContentStory />);
