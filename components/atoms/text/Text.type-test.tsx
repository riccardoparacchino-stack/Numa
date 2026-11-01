import { Text } from "./Text";

const valid = (
  <>
    <Text variant="display" size="l" as="h1">
      Heading
    </Text>
    <Text variant="body" size="m" as="p" id="copy" aria-label="Body">
      Paragraph
    </Text>
    <Text variant="label" size="s" as="span" data-kind="label">
      Label
    </Text>
    <Text variant="button" size="m" as="span">
      Button text
    </Text>
  </>
);

void valid;

// @ts-expect-error title does not support size l
const invalidTitleSize = <Text variant="title" size="l">Title</Text>;
// @ts-expect-error headline does not support size l
const invalidHeadlineSize = <Text variant="headline" size="l">Headline</Text>;
// @ts-expect-error unsupported visual variants are rejected
const invalidVariant = <Text variant="caption" size="s">Caption</Text>;
// @ts-expect-error fontSize is not a public Text prop
const unsupportedFontSize = <Text variant="body" size="m" fontSize="18px">Body</Text>;
// @ts-expect-error lineHeight is not a public Text prop
const unsupportedLineHeight = <Text variant="body" size="m" lineHeight="28px">Body</Text>;
// @ts-expect-error inline styles cannot override the variant-controlled font size
const unsupportedStyleFontSize = <Text variant="body" size="m" style={{ fontSize: "18px" }}>Body</Text>;
// @ts-expect-error inline styles cannot override the variant-controlled line height
const unsupportedStyleLineHeight = <Text variant="body" size="m" style={{ lineHeight: "28px" }}>Body</Text>;
// @ts-expect-error letterSpacing accepts only named Foundation scale options
const unsupportedLetterSpacing = <Text variant="body" size="m" letterSpacing="0.05em">Body</Text>;
// @ts-expect-error inline styles cannot bypass the named letter-spacing API
const unsupportedStyleLetterSpacing = <Text variant="body" size="m" style={{ letterSpacing: "0.05em" }}>Body</Text>;

void [
  invalidTitleSize,
  invalidHeadlineSize,
  invalidVariant,
  unsupportedFontSize,
  unsupportedLineHeight,
  unsupportedStyleFontSize,
  unsupportedStyleLineHeight,
  unsupportedLetterSpacing,
  unsupportedStyleLetterSpacing,
];
