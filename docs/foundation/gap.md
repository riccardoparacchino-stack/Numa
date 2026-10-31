# Gap primitives

## Purpose and status

The gap collection is an independently configured dimensional scale. Its canonical configuration is [`tokens/gap/config.json`](../../tokens/gap/config.json); generated representations are [`tokens/gap/integer.json`](../../tokens/gap/integer.json) and [`tokens/gap/rem.json`](../../tokens/gap/rem.json). The paired files use the same `numa-sys-gap-{value}` token names, with number values in the integer representation and dimension values in the REM representation. They are alternative representations; do not load both maps into one flat token dictionary because token keys intentionally correspond.

The existing broad primitive collections at `tokens/primitive/numeric.json` and `tokens/primitive/rem.json` remain unchanged. Gap generation does not add entries to, or consume values from, those collections.

## Configuration and proposed progression

The repository does not establish a canonical gap progression. The current config therefore uses an explicit **proposed default** multiplier sequence `[1, 2, 3, 4, 6, 8, 12, 16, 24, 32]`. This is a practical, configurable progression and is not an approved design-system rule; review it before treating it as canonical.

| Configuration | How to use |
|---|---|
| Base 2 | Set `baseValue` to `2` (current proposed default) |
| Base 4 | Set `baseValue` to `4` |
| Custom | Set `baseValue` to any positive finite number |

`multipliers` are independent of `baseValue`. The current ten-step proposal yields integer values `2, 4, 6, 8, 12, 16, 24, 32, 48, 64` at base 2, and `4, 8, 12, 16, 24, 32, 48, 64, 96, 128` at base 4.

The config also declares `rounding` (`nearest`, with exact ties down), the unit, `baseFontSize` (`16`), REM `precision` (`3`), and the `numa-sys-gap-` namespace. Positive custom bases, multiplier sequences, and the supported rounding strategies require no generator code changes. If values collide after rounding, generation fails rather than silently dropping a step.

## Generation

The reusable math is in [`scripts/dimensional-scale.js`](../../scripts/dimensional-scale.js); the collection-specific entry point is [`scripts/generate-gap.js`](../../scripts/generate-gap.js). The function first resolves `baseValue * multiplier` to an integer, then derives REM from that resolved integer divided by `baseFontSize`. Both output maps are generated from the same resolved scale data.

To regenerate after editing `tokens/gap/config.json`:

```sh
npm run generate:gap
npm test
```

Foundation validation checks that both output files exactly match the config-derived result and that integer/REM keys correspond. Tests cover bases 2, 4, and custom values, configurable multipliers, rounding, duplicates, deterministic generation, and source integrity.

## Typography compatibility

Gap and typography have separate configs and generation entry points. The generic module does not import typography code. Typography retains its existing modular-scale formula and nearest-existing-primitive quantization; it is not refactored to use the gap rounding strategy, so gap config changes cannot change typography outputs. The two paths share the established idea of reporting and validating generated artifacts, not token behavior.
