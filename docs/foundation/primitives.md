# Primitives

Primitive source files live in [`tokens/primitive/`](../../tokens/primitive/). The values below describe the checked-in collections; use the JSON files as the definitive value source.

The independent gap scale is documented in [Gap primitives](gap.md). Its paired output files live in `tokens/gap/` rather than extending the broad integer and REM collections below.

## Colors

Colors use the `numa-sys-col-{color}-{scale}` namespace and store HEX values as `$type: "color"` tokens. The repository contains these 22 Tailwind-style palette names:

`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`.

Each listed palette has the scales `50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950` (242 color tokens total). The actual HEX values are in [`color.json`](../../tokens/primitive/color.json). The repository does not depend on Tailwind at runtime or fetch palette values from a network service.

## Integer primitives

Integer tokens use `numa-sys-int-{value}` and `$type: "number"`. The complete checked-in progression is:

```text
0, 2, 4, 8, 12, 16, 20, 24, 32, 36, 40, 44, 48, 56, 64, 72, 80, 88, 96,
112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 352, 384, 416,
448, 480, 512, 576, 640, 704, 768, 832, 896, 960, 1024, 1200, 1400, 1600,
1800, 2000, 2400, 2800, 3200, 3600, 4000
```

The collection has 55 values ranging from 0 to 4000, includes the specifically established value 1200, and becomes progressively less dense at larger values. The generator reads [`numeric.json`](../../tokens/primitive/numeric.json) as the source when it creates REM tokens.

## REM primitives

REM tokens use `numa-sys-rem-{value}` and `$type: "dimension"`. The current [`rem.json`](../../tokens/primitive/rem.json) contains an entry for every integer primitive, with the same suffix and a value calculated as `integer / 16`, formatted to three decimal places; zero is written as `0rem`.

Examples:

| Integer token | REM token value |
|---|---:|
| `numa-sys-int-4` | `0.250rem` |
| `numa-sys-int-8` | `0.500rem` |
| `numa-sys-int-16` | `1.000rem` |
| `numa-sys-int-24` | `1.500rem` |
| `numa-sys-int-32` | `2.000rem` |

Run the generator to refresh this generated file; do not edit it independently of its integer source.

## Percentage primitives

Percentage tokens use `numa-sys-per-{value}` with a three-digit zero-padded suffix and `$type: "number"`. [`percentage.json`](../../tokens/primitive/percentage.json) contains every value from 0 through 200 inclusive in increments of 5 (41 tokens). Values are stored as numbers, for example `numa-sys-per-050` has value `50`.
