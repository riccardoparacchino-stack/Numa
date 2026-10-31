# Semantic spacing and radius

Semantic spacing and radius tokens name shared layout intent while keeping
numeric values in the Foundation primitive collection. The sources are
[`tokens/semantic/spacing.json`](../../tokens/semantic/spacing.json) and
[`tokens/semantic/radius.json`](../../tokens/semantic/radius.json). They use
the repository's flat `numa-` token names and DTCG alias syntax, as do
[semantic colors](semantic-colors.md).

## Primitive and semantic values

The canonical existing source for integer values is
[`tokens/primitive/numeric.json`](../../tokens/primitive/numeric.json). It
contains unitless `number` tokens such as `numa-sys-int-4` and
`numa-sys-int-24`; there is no separate REM primitive collection. The
semantic tokens alias those existing numbers instead of repeating values or
introducing new primitives.

These aliases preserve the primitive numbers; they do not declare a physical
unit or perform conversion. Typography separately stores CSS `rem` dimensions
in its own collection, but that is not an alternate spacing/radius source.
There is no configured Style Dictionary build, CSS output pipeline, or React
Native transform in this repository. Therefore these definitions do not yet
emit CSS lengths or validated platform-specific output. A future consumer must
establish and test the intended conversion for its platform; this document
does not assume that a bare number means CSS pixels or React Native points.

## Spacing scale

Use the groups as broad guidance rather than component-specific assignments:

- **Pebbles:** compact internal spacing and small gaps.
- **Bricks:** medium spacing, grouping, and section padding.
- **Walls:** large composition spacing and separation.

The scale intentionally follows the 4px grid, omits the available 2px
primitive, and includes `none` as an explicit zero-spacing choice.

| Group | Token | Primitive value |
| --- | --- | ---: |
| Pebbles | `numa-spacing-pebbles-none` | 0 |
| Pebbles | `numa-spacing-pebbles-xs` | 4 |
| Pebbles | `numa-spacing-pebbles-s` | 8 |
| Pebbles | `numa-spacing-pebbles-m` | 12 |
| Pebbles | `numa-spacing-pebbles-l` | 16 |
| Pebbles | `numa-spacing-pebbles-xl` | 20 |
| Bricks | `numa-spacing-bricks-s` | 24 |
| Bricks | `numa-spacing-bricks-m` | 32 |
| Bricks | `numa-spacing-bricks-l` | 40 |
| Bricks | `numa-spacing-bricks-xl` | 48 |
| Walls | `numa-spacing-walls-s` | 56 |
| Walls | `numa-spacing-walls-m` | 64 |
| Walls | `numa-spacing-walls-l` | 72 |
| Walls | `numa-spacing-walls-xl` | 80 |
| Walls | `numa-spacing-walls-2xl` | 88 |
| Walls | `numa-spacing-walls-3xl` | 96 |

## Radius scale

These are maximum intended corner radii; actual rendering can be constrained
by element dimensions and platform behavior.

- **Pebbles:** compact surfaces and small rounded elements.
- **Bricks:** medium and large containers.
- **Walls:** oversized rounded compositions.

| Group | Token | Primitive value |
| --- | --- | ---: |
| Pebbles | `numa-radius-pebbles-xs` | 4 |
| Pebbles | `numa-radius-pebbles-s` | 8 |
| Pebbles | `numa-radius-pebbles-m` | 12 |
| Bricks | `numa-radius-bricks-s` | 24 |
| Bricks | `numa-radius-bricks-m` | 32 |
| Bricks | `numa-radius-bricks-l` | 40 |
| Walls | `numa-radius-walls-s` | 48 |
| Walls | `numa-radius-walls-m` | 72 |
| Walls | `numa-radius-walls-l` | 80 |

## Nested surfaces

For visually consistent nested corners, use the practical guideline:

`R_outer >= P + R_inner`

`R_outer` is the outer surface radius, `P` is the padding between surfaces,
and `R_inner` is the inner surface radius. Apply it at every nested boundary;
do not compare only the outermost and innermost surfaces when there are
intermediate layers. Where strict contour consistency is desired, choose the
next available radius that satisfies it.

| Padding | Inner radius | Minimum outer radius | Suggested available radius |
| ---: | ---: | ---: | --- |
| 4 | 4 | 8 | Pebbles `s` (8) |
| 8 | 8 | 16 | Bricks `s` (24) |
| 12 | 12 | 24 | Bricks `s` (24) |
| 16 | 12 | 28 | Bricks `m` (32) |
| 20 | 12 | 32 | Bricks `m` (32) |
| 24 | 24 | 48 | Walls `s` (48) |
| 32 | 32 | 64 | Walls `m` (72) |
| 40 | 40 | 80 | Walls `l` (80) |

This is not a universal geometric law or a token validation rule. Do not force
it when it looks wrong for compact or unusual shapes. Asymmetric padding,
clipping, dimensions, corner shape, and optical adjustments can all affect the
result. Do not add tokens just to satisfy every possible combination, and do
not enforce the guideline automatically.

## Scope and validation limits

These are Foundation definitions only; no component tokens or component
implementations consume them. Tests verify the documented inventory, exact
primitive aliases, and 4px spacing scale. The repository has no token build or
generated output, so Style Dictionary output, CSS units, React Web output, and
React Native transforms cannot currently be validated. No shared Definition
of Done document was present in the repository at implementation time.
