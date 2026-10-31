# Dimensional scale generator

## Purpose and separation

[`scripts/dimensional-scale.js`](../../scripts/dimensional-scale.js) exports a pure, reusable generator for numeric dimensional scales. It has no typography or gap-specific calculations. The gap generator supplies a config and writes the module's integer and REM representations.

Typography remains separate. It calculates modular sizes and quantizes each result to the nearest member of the existing integer primitive collection, whereas the generic dimensional generator rounds each `baseValue * multiplier` to an integer. Sharing those behaviors would change typography's scale semantics, so the typography workflow is intentionally not refactored to use this module.

## API

```js
const { generateDimensionalScale } = require("../../scripts/dimensional-scale");

const scale = generateDimensionalScale({
  baseValue: 2,
  multipliers: [1, 2, 3],
  rounding: { strategy: "nearest", tieBreak: "down" },
  unit: "rem",
  baseFontSize: 16,
  precision: 3,
  namePrefix: "numa-sys-gap-"
});
```

The function accepts:

| Input | Requirements |
|---|---|
| `baseValue` | Positive finite number |
| `multipliers` | Non-empty sequence of positive finite numbers |
| `rounding.strategy` | `nearest`, `floor`, or `ceil` |
| `rounding.tieBreak` | `down` or `up` for `nearest`; required when `strategy` is `nearest` |
| `unit` | Unit name used for `unitValue`; gap uses `rem` |
| `baseFontSize` | Positive reference size used for REM conversion |
| `precision` | Integer from 0 to 12 for REM formatting |
| `namePrefix` | Lowercase token namespace ending in `-` |

`generateDimensionalScale` returns `integerTokens`, `remTokens`, and ordered `steps`. The two token maps have matching keys. Each step includes its token name, multiplier, raw calculated value, resolved integer, configured `unitValue`, and REM value. `baseFontSize` is required because the result always includes REM tokens; `unit` controls the additional `unitValue` representation.

## Calculation and rounding

For each configured multiplier, the raw value is `baseValue * multiplier`. The selected rounding strategy resolves it to a safe positive integer. With `nearest`, exact half values use the configured `tieBreak`; gap defaults to `down`. Invalid inputs, non-finite results, and duplicate resolved integers fail with descriptive errors rather than silently dropping a scale step.

REM values are calculated only after integer resolution:

```text
remValue = resolvedInteger / baseFontSize
```

The result is formatted to the configured precision; zero, if supported in a future collection, is represented as `0rem`. Integer and REM outputs therefore represent the same resolved dimensional scale. The generator does not alter source configuration or existing primitive collections.

## Error behavior and extension

Configuration errors identify the invalid field. Generation fails if two multipliers resolve to the same integer because they would collide in the value-based token namespace. Correct the multipliers or base value instead of silently deduplicating tokens.

To use the generator for another scale, provide an independent config and namespace. Review whether its naming, output unit, and duplicate policy fit that collection; do not make those design decisions implicitly in the shared math module.
