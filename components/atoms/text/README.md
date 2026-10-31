# Text Atom

`Text` is a React Web typography component in `components/atoms/text/`. It
applies Numa Foundation typography while keeping visual treatment independent
from HTML semantics. This implementation targets React Web; React Native is
not implemented or claimed.

## API

```tsx
import { Text } from "./components/atoms/text";

<Text variant="body" size="m">Example text</Text>
```

`Text` renders a `span` by default. `variant` and `size` are required and
TypeScript constrains valid pairs:

The component exports `TextProps<T extends ElementType = "span">`,
`TextVariant`, `TextSize<V extends TextVariant>`, `TextVariantSize`, and
`TextLetterSpacing` (an alias for Foundation's `LetterSpacingOption`).
`TextVariant` is the union `"label" | "body" | "title" | "headline" |
"display"`. `TextSize` is derived from the actual variant map, so its result
depends on `V`; `TextVariantSize` forms the discriminated union of valid
variant/size pairs shown below.

`TextProps<T>` derives element attributes from the `as` element and forwards
applicable native, `aria-*`, and `data-*` attributes. Explicitly supplied
`role` is forwarded; no role is inferred. `style` accepts CSS properties
except `fontSize` and `lineHeight`, which remain controlled by variant and size.
Those computed dimensions are applied after caller styles.

| Prop | Type | Behavior |
|---|---|---|
| `variant` | `TextVariant` | Selects visual typography; does not determine semantics. |
| `size` | Variant-specific union above | Selects Foundation font size and line height. |
| `as` | React element type; defaults to `"span"` | Selects the rendered element independently. |
| `fontFamily` | `CSSProperties["fontFamily"]` | Optional override; defaults to Foundation Rubik stack. |
| `fontWeight` | `CSSProperties["fontWeight"]` | Optional override; otherwise uses the variant default. |
| `fontStyle` | `CSSProperties["fontStyle"]` | Optional style override. |
| `letterSpacing` | `"compact" \| "relaxed" \| "spacious"` | Named Foundation letter-spacing preset. Defaults to `relaxed`. |
| `textDecoration` | `CSSProperties["textDecoration"]` | Optional CSS text-decoration override. |
| `color` | `CSSProperties["color"]` | Optional CSS color override. |
| `style` | `Omit<CSSProperties, "fontSize" \| "lineHeight" \| "letterSpacing">` | Supports other inline style properties; typography token properties use dedicated props. |
| `children` and element attributes | React element-specific props | Forwarded to the selected element, including accessibility attributes. |

`fontSize` and `lineHeight` are not component props. Their `style` properties
are excluded by the public type and overwritten by the resolved variant
dimensions if an untyped caller supplies them. The component does not add
default ARIA roles or override native semantics.

## Variants, sizes, and Foundation mapping

All dimensions use rem based on a 16px root font size. The component maps each
pair to named Foundation typography tokens in
[`tokens/typography/text.json`](../../../tokens/typography/text.json).
Repeated dimensions share the same token; the component does not define
duplicate values or component tokens.

`letterSpacing` defaults to `relaxed`; each option resolves from Foundation
using the selected pair's font-size token. Values are expressed in `em`, so
spacing is relative to the effective font size. The complete matrix is:

| Font size | Line height | `compact` | `relaxed` (default) | `spacious` |
|---:|---:|---:|---:|---:|
| 12px | 16px | 0em | +0.01em | +0.02em |
| 14px | 20px | 0em | +0.005em | +0.01em |
| 16px | 24px | -0.005em | 0em | +0.01em |
| 22px | 28px | -0.02em | -0.01em | 0em |
| 24px | 32px | -0.02em | -0.01em | 0em |
| 32px | 40px | -0.025em | -0.015em | -0.005em |
| 36px | 44px | -0.03em | -0.02em | -0.01em |
| 45px | 52px | -0.03em | -0.02em | -0.01em |
| 57px | 64px | -0.03em | -0.02em | -0.01em |

Omitting `letterSpacing` selects `relaxed`. The effective size comes from the
variant/size mapping; letter spacing is not derived from line height. Line
height measures vertical leading, while tracking is proportional to the glyph
em and is tuned independently. Raw CSS values are not accepted through
`letterSpacing` or `style`. The previous API left tracking unset when omitted;
the relaxed default is an intentional visual behavior change. Arbitrary manual
tracking overrides are not part of this API and were not previously supported.

| Variant | Size | Font size | Line height | Default weight |
|---|---|---:|---:|---|
| `label` | `s` | 12px / 0.75rem | 16px / 1rem | Medium / 500 |
| `label` | `m` | 14px / 0.875rem | 20px / 1.25rem | Medium / 500 |
| `label` | `l` | 16px / 1rem | 24px / 1.5rem | Medium / 500 |
| `body` | `s` | 12px / 0.75rem | 16px / 1rem | Regular / 400 |
| `body` | `m` | 14px / 0.875rem | 20px / 1.25rem | Regular / 400 |
| `body` | `l` | 16px / 1rem | 24px / 1.5rem | Regular / 400 |
| `title` | `s` | 16px / 1rem | 24px / 1.5rem | Medium / 500 |
| `title` | `m` | 22px / 1.375rem | 28px / 1.75rem | Medium / 500 |
| `headline` | `s` | 24px / 1.5rem | 32px / 2rem | SemiBold / 600 |
| `headline` | `m` | 32px / 2rem | 40px / 2.5rem | SemiBold / 600 |
| `display` | `s` | 36px / 2.25rem | 44px / 2.75rem | Regular / 400 |
| `display` | `m` | 45px / 2.8125rem | 52px / 3.25rem | Regular / 400 |
| `display` | `l` | 57px / 3.5625rem | 64px / 4rem | Regular / 400 |

The explicit table contains **13** valid combinations. The initial brief called
these “12” combinations, but its variant/size table specifies 13 rows; this
implementation follows every explicitly listed row. `title/l`,
`headline/l`, unknown variants, and unknown sizes are invalid. TypeScript
rejects invalid pairs; the runtime throws `RangeError` for invalid pairs from
untyped JavaScript callers.

Foundation provides the Rubik, Helvetica Neue, Arial, sans-serif family and
the default weights 400, 500, and 600. Font availability/loading is not
implemented; consumers must provide the Rubik font where required. The `color`
prop accepts CSS color values and is not token-resolved by the Text component.
The interactive story uses the shared semantic color aliases for its
documentation-page styling; it does not add color behavior to the Text API.

## Semantics and accessibility

Visual styles do not imply document hierarchy or accessibility roles. Choose
the element based on content structure:

```tsx
<Text variant="display" size="l" as="h1">
  Page title
</Text>

<Text variant="display" size="l" as="div">
  Prominent content that is not a heading
</Text>

<Text variant="title" size="m" as="h2">
  Section heading
</Text>

<Text variant="body" size="m" as="p" aria-describedby="summary">
  Paragraph content
</Text>

<Text variant="label" size="s" as="span" aria-label="Required field">
  Required
</Text>
```

The two `display` examples retain identical typography while rendering as
different elements. Native semantics remain intact unless the caller
explicitly supplies a `role`. The selected element's React attribute types
provide element-specific type checking; `aria-*` and `data-*` attributes are
forwarded through to the rendered node.

## Foundation relationship and decisions

Foundation owns the shared typography values and the size-aware
letter-spacing resolution in
[`foundation/typography/letter-spacing.ts`](../../../foundation/typography/letter-spacing.ts).
`text.variants.ts` provides the selected font-size token; the component passes
that token and the preset to Foundation and applies the returned `em` value.
Font size and line height use the existing mapping, and the named
letter-spacing options resolve to Foundation tokens. Font customization is
explicit and independent of semantic selection.

The Foundation value is platform-independent. Web applies the `em` string as
CSS `letter-spacing`. A future React Native adapter would convert the `em`
coefficient to an absolute platform unit by multiplying it by the effective
font size; this repository has no native Text implementation or runtime, so
that adapter and visual parity are not claimed. The optional prop accepts
named presets only, so there is no manual tracking override precedence to
document; callers cannot provide raw values through the public API.

This repository previously had numeric and color primitives but no
typography-specific Foundation definitions. The requested values absent from
the numeric collection are therefore established as named Foundation
typography values rather than changing existing primitive values. The
decision, context, alternatives, trade-offs, impact, and status are recorded
in [ADR 0001](../../../docs/decisions/0001-foundation-text-typography.md).
Foundation scope and token discrepancy details are in
[Foundation Typography](../../../docs/foundation/typography.md).

## Tests

`Text.test.tsx` covers every valid pair, font defaults and overrides,
semantic independence, attribute forwarding, runtime invalid-pair handling,
and protected dimensions. `Text.type-test.tsx` is included in TypeScript
checking to verify invalid variant/size pairs and independent dimension props
are rejected.

## Interactive story

Run `npm run story` to open the [Text Atom story](./story.html) through Vite.
The page renders its copy and specimens with the real `Text` component,
resolves font sizes, weights, font family, and letter-spacing from Foundation,
and applies semantic color tokens for its page, surfaces, text, accents, and
focus indicators. See [Foundation Semantic Colors](../../../docs/foundation/semantic-colors.md).
An interactive variant/size/element playground demonstrates the API and
semantics. The type-scale selector previews all variant/size pairs that use a
generated scale for the selected harmonic ratio, anchored at a 16px base. It is
an exploratory illustration and does not change Text's Foundation token
mapping, which is listed alongside it. Page structure and controls remain
native HTML elements where the Text component does not replace those
primitives.
