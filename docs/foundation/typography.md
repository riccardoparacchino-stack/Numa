# Typography

## Source of truth

[`tokens/typography/text.json`](../../tokens/typography/text.json) defines the
shared typography values used by the Text Atom. It contains the default font
family fallback stack, default font weights, named font-size and line-height
dimensions, and named letter-spacing dimensions.

Font-size and line-height dimensions use `rem` based on a 16px root font size.
Letter-spacing uses `em` so tracking scales with the selected font size. The
complete Foundation matrix is:

| Font size token suffix | Line height | Compact | Relaxed (default) | Spacious |
|---:|---:|---:|---:|---:|
| 12 | 16px | 0em | +0.01em | +0.02em |
| 14 | 20px | 0em | +0.005em | +0.01em |
| 16 | 24px | -0.005em | 0em | +0.01em |
| 22 | 28px | -0.02em | -0.01em | 0em |
| 24 | 32px | -0.02em | -0.01em | 0em |
| 32 | 40px | -0.025em | -0.015em | -0.005em |
| 36 | 44px | -0.03em | -0.02em | -0.01em |
| 45 | 52px | -0.03em | -0.02em | -0.01em |
| 57 | 64px | -0.03em | -0.02em | -0.01em |

Each cell is an independent named token, for example
`numa-text-letter-spacing-compact-12`. The Foundation resolver in
[`foundation/typography/letter-spacing.ts`](../../foundation/typography/letter-spacing.ts)
takes a font-size token and preset, then retrieves the matching token. The
component does not duplicate this matrix. The preset's output depends on the
effective font size, not the line height: line height controls vertical
leading and is not the reference unit for glyph tracking.

The collection is canonical Foundation data. It is not a set of
variant-specific component tokens: multiple Text variants and sizes reuse
the same named size and line-height values. No typography generator is
currently configured for this collection.

## Text integration

[`components/atoms/text/text.variants.ts`](../../components/atoms/text/text.variants.ts)
maps each valid pair in the five-variant typography scale to Foundation token
names. The React component resolves the named tokens and applies their values
as CSS `fontSize` and `lineHeight`. It resolves the named tracking preset from
the font-size token through Foundation and applies that value as CSS
`letter-spacing`. Default font weights are also resolved from the Foundation
weight tokens:

| Variant | Default weight token | Weight |
|---|---|---:|
| `label` | `numa-text-weight-500` | 500 |
| `body` | `numa-text-weight-400` | 400 |
| `title` | `numa-text-weight-500` | 500 |
| `headline` | `numa-text-weight-600` | 600 |
| `display` | `numa-text-weight-400` | 400 |

The component's supported combinations and their mapped values are documented
in the [Text Atom README](../../components/atoms/text/README.md). Font family
and weight defaults, font size, line height, and named letter spacing are the
Foundation-controlled typography properties. The component API permits font
customization and choosing among the named letter-spacing presets; size and
line height remain controlled by variant and size. Omitted `letterSpacing`
now selects `relaxed`, a behavior change from the prior unset/browser-default
behavior.

The proposal listed 13 combinations but described them as 12. The
implementation follows all 13 explicit variant/size rows. Named values absent
from the existing numeric primitives were added to this typography collection;
the primitive collection was not modified. The decision and alternatives are
recorded in [ADR 0001](../decisions/0001-foundation-text-typography.md).
The Text API also exposes a separate four-size `button` variant for Button
labels; its fixed size and line-height values are component utilities, not
Foundation typography tokens. See the [Text README](../../components/atoms/text/README.md)
for the component contract.

## Semantics and accessibility

Typography variants only control visual presentation. They do not determine
HTML tags, heading levels, or accessibility roles. The Text component's
`as` prop selects the element independently; `role` and native/ARIA
attributes are component API concerns, not typography tokens. Native element
semantics are preserved unless the caller explicitly supplies a role.

## Platform and font limitations

The Text implementation targets React Web and resolves CSS dimensions. It
applies the Foundation's `em` value directly as CSS letter spacing. React
Native's `letterSpacing` expects an absolute platform unit; the equivalent
numeric value is the em coefficient multiplied by the effective font size.
There is no React Native implementation or native runtime/test harness here,
so no native adapter or visual parity has been verified. A future adapter
must perform this conversion and test on-device.

There is also no bundled Rubik font asset or font loader. The fallback stack
makes browser fallback explicit but does not guarantee Rubik is installed or
loaded. The matrix is an initial proposal tuned for Rubik and may need visual
review across platforms.

The optional `color` property accepts a CSS color. This Foundation collection
does not map it to a semantic color token; no such mapping is inferred.
