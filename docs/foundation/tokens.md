# Tokens

## Structure and format

Token files are JSON maps of names to objects containing `$type` and `$value`. Names encode the Numa namespace directly, and typography dimensions use brace-delimited aliases such as `{numa-sys-rem-16}`. This is DTCG-style structure; the repository does not include a DTCG conformance validator or use nested token groups.

The canonical files and their generated counterparts are:

| Collection | File | Status |
|---|---|---|
| Colors | [`tokens/primitive/color.json`](../../tokens/primitive/color.json) | Primitive values |
| Integers | [`tokens/primitive/numeric.json`](../../tokens/primitive/numeric.json) | Primitive values |
| Percentages | [`tokens/primitive/percentage.json`](../../tokens/primitive/percentage.json) | Primitive values |
| REM dimensions | [`tokens/primitive/rem.json`](../../tokens/primitive/rem.json) | Generated from integer primitives |
| Gap configuration and paired outputs | [`tokens/gap/config.json`](../../tokens/gap/config.json) | Config is maintained; integer and REM files are generated independently |
| Typography | [`tokens/typography/tokens.json`](../../tokens/typography/tokens.json) | Generated |
| Typography copy | [`tokens/text/typography.json`](../../tokens/text/typography.json) | Generated duplicate |

Typography generation reads the maintained scale configuration from `tokens/typography/config.json` and writes a mirror to `tokens/text/config.json`, along with `tokens/typography/report.json`. Gap configuration and its outputs are separate; see [Gap primitives](gap.md). Details are in [tooling and workflow](tooling-and-workflow.md).

## Naming conventions

| Token family | Pattern | Example |
|---|---|---|
| Colors | `numa-sys-col-{color}-{scale}` | `numa-sys-col-blue-100` |
| Integer primitives | `numa-sys-int-{value}` | `numa-sys-int-24` |
| REM primitives | `numa-sys-rem-{value}` | `numa-sys-rem-24` |
| Percentage primitives | `numa-sys-per-{three-digit-value}` | `numa-sys-per-050` |
| Typography | `numa-text-{group}-{value}` | `numa-text-weight-400` |

The current typography groups are family, weight, style, decoration, transform, alignment, size, line-height, and letter-spacing. Do not infer additional groups from these examples.

Gap is an independent primitive collection under [`tokens/gap/`](../../tokens/gap/config.json). Its generated integer and REM representations intentionally share `numa-sys-gap-{value}` keys; see [Gap primitives](gap.md) for why the representations are separate.

## References and derived values

Typography dimensions reference REM tokens rather than storing independently calculated dimensions. The generator derives the REM collection from integer primitives using `rem = int / 16`, and typography values are quantized to existing integer primitives before the corresponding REM alias is written. The integer source file is not modified by REM generation.

Color, integer, and percentage collections contain literal values. The actual ranges and collections are documented in [primitives](primitives.md). The repository currently has no semantic or component token layer.

## Extending collections

Before changing tokens, inspect the source JSON and the generation workflow. Preserve existing namespaces and avoid inventing values, categories, or aliases. If a typography result needs finer precision than the integer collection provides, do not add a primitive automatically: generation intentionally resolves to an existing primitive. Any change to that policy or to the primitive source must be explicit and reviewable.
