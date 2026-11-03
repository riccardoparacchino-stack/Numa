import { createRoot } from "react-dom/client";
import { Text } from "./Text";
import { Page } from "../../molecules/page";
import { Container } from "../../molecules/container";
import { Stack } from "../../molecules/stack";
import { showcaseFoundationStyle } from "../../showcase-foundation";
import "./responsive-showcase.css";

const samples = [
  { size: "3XL", text: <Text variant="display" size="l" as="p" data-text-size="3XL">3XL — Clear words. Thoughtful hierarchy.</Text> },
  { size: "2XL", text: <Text variant="display" size="m" as="p" data-text-size="2XL">2XL — Clear words. Thoughtful hierarchy.</Text> },
  { size: "XL", text: <Text variant="display" size="s" as="p" data-text-size="XL">XL — Clear words. Thoughtful hierarchy.</Text> },
  { size: "L", text: <Text variant="headline" size="m" as="p" data-text-size="L">L — Clear words. Thoughtful hierarchy.</Text> },
  { size: "M", text: <Text variant="headline" size="s" as="p" data-text-size="M">M — Clear words. Thoughtful hierarchy.</Text> },
  { size: "S", text: <Text variant="title" size="m" as="p" data-text-size="S">S — Clear words. Thoughtful hierarchy.</Text> },
  { size: "XS", text: <Text variant="title" size="s" as="p" data-text-size="XS">XS — Clear words. Thoughtful hierarchy.</Text> },
  { size: "2XS", text: <Text variant="body" size="m" as="p" data-text-size="2XS">2XS — Clear words. Thoughtful hierarchy.</Text> },
  { size: "3XS", text: <Text variant="body" size="s" as="p" data-text-size="3XS">3XS — Clear words. Thoughtful hierarchy.</Text> },
] as const;

function ResponsiveTextShowcase() {
  return (
    <Page className="responsive-text-page" style={showcaseFoundationStyle}>
      <Container className="responsive-text-container">
        <Stack direction="vertical" className="responsive-text-stack">
          <header className="responsive-text-heading">
            <Text variant="label" size="s" as="p">Typography scale</Text>
            <Text variant="display" size="m" as="h1">Responsive text</Text>
            <Text variant="body" size="m" as="p">
              Resize the viewport to see the page and container adapt at each layout breakpoint. Text samples are ordered from the largest token to the smallest.
            </Text>
          </header>
          <Stack direction="vertical" className="responsive-text-samples" aria-label="Text sizes from 3XL to 3XS">
            {samples.map(({ size, text }) => (
              <div className="responsive-text-sample" key={size}>
                {text}
              </div>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Page>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root element for the responsive text showcase.");
createRoot(root).render(<ResponsiveTextShowcase />);
