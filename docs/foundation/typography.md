# Typography

## Font family and attributes

Typography tokens use the `numa-text-` namespace and are generated into [`tokens/typography/tokens.json`](../../tokens/typography/tokens.json) and a duplicate at [`tokens/text/typography.json`](../../tokens/text/typography.json).

| Group | Current tokens or values |
|---|---|
| Primary family | `numa-text-family-primary`: Rubik, Helvetica Neue, Arial, sans-serif |
| Weights | `numa-text-weight-100` through `numa-text-weight-900`, step 100 |
| Style | `normal`, `italic` |
| Decoration | `none`, `underline`, `line-through` |
| Transform | `none`, `uppercase`, `lowercase`, `capitalize` |
| Alignment | `start`, `center`, `end`, `justify` |

The configured Google Fonts CSS2 URL is [Rubik, weights 300–900, normal and italic](https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&display=swap). This URL is stored as data and included in the generated typography README; token generation itself makes no network request. The token collection declares weights 100–900, while the URL requests 300–900, so those declared ranges are not aligned. There is no web font loader or bundled React Native font asset in the repository. React Native font packaging remains a platform implementation concern, not part of this generator.

## Modular scale

The current defaults are defined as constants in [`scripts/generate-typography.js`](../../scripts/generate-typography.js):

| Setting | Default |
|---|---:|
| Base size | 16 |
| Base size in REM | 1rem (via the 16px primitive) |
| Number of items | 12 |
| Ratio preset | Minor Third, 1.2 |
| Line-height ratio | 1.5 |
| Letter-spacing multiplier | 0 |

Available preset ratios in the script are Minor Second `1.067`, Major Second `1.125`, Minor Third `1.200`, Major Third `1.250`, Perfect Fourth `1.333`, Augmented Fourth `1.414`, Perfect Fifth `1.500`, and Golden Ratio `1.618`.

For `n` scale items, the base index is `n / 2` when `n` is even and `(n + 1) / 2` when odd (one-based token indexes). Thus the lower of the two central items is the base for an even count, and the center item is the base for an odd count. The raw size formula is:

```text
size = baseSize * ratio ^ (index - baseIndex)
```

For each size, line height is the calculated size multiplied by the line-height ratio. Letter spacing is the calculated size multiplied by the configured letter-spacing value.

### Configuration limitation

The generator has an internal configuration object, but does not read `tokens/typography/config.json` or `tokens/text/config.json`; both are outputs written by the generator. There is no CLI or supported external configuration interface. Although the ratio helper can parse a numeric candidate, generation currently passes the hard-coded preset key. The config files therefore describe the current output but cannot be edited to change generation.

## Quantization and references

Generated size, line-height, and letter-spacing tokens use the names `numa-text-size-{n}`, `numa-text-line-height-{n}`, and `numa-text-letter-spacing-{n}`. Every calculated value is resolved to the nearest available integer primitive, then references the corresponding REM primitive. No new primitive is generated. Equal distances resolve to the smaller integer.

[`tokens/typography/report.json`](../../tokens/typography/report.json) records each calculated value, its integer and REM primitive, and the absolute rounding difference. Reported values are expressed in the generator's numeric pixel-scale units; the report rounds calculated values and differences to three decimal places. Quantization can make separate scale positions resolve to the same token and can produce noticeable differences when the primitive collection is sparse. Review the report when changing scale parameters or integer primitives.

## Platform considerations

Canonical typography token definitions do not depend on React Web or React Native. The repository currently produces JSON only. CSS custom properties, TypeScript objects, web font loading, and React Native font bundling are intended platform concerns and have not been implemented here. See [architecture](architecture.md) and [tooling and workflow](tooling-and-workflow.md).
