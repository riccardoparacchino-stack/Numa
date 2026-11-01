# ADR 0004: React Web Semantic Dimension Adapter

- **Date:** 2026-10-31
- **Status:** Accepted

## Context

The semantic spacing and radius tokens alias unitless numeric primitives.
Numa's React Web components need CSS dimensions, but the repository has no
configured token build or transformation pipeline. Inferring units inside
individual components would duplicate conversion logic and risk inconsistent
rendering.

The spacing scale is established on a 4px grid and the requested semantic
spacing/radius values are intended as pixel magnitudes. The component request
explicitly disallows assuming that unitless numbers are CSS lengths without a
verified adapter; the user approved a minimal React Web adapter interpreting
these values as CSS pixels.

## Decision

Add a shared Foundation resolver for semantic spacing and radius aliases.
Resolve each alias against existing numeric primitives, fail explicitly on
invalid references, and expose pixel-valued numbers to React Web components.
Components append the CSS `px` unit when applying values as inline styles.

Keep the primitive and semantic token data unchanged and unitless. Do not add
a Style Dictionary build, generated CSS, or React Native conversion in this
change. The adapter is the React Web consumption contract, not platform
metadata in the token files.

Text Compositor uses semantic spacing for its title-description gap. Tile
dimensions are now generated from a parametric scale as documented in
[ADR 0008](0008-parametric-tile-sizing.md), rather than resolving one of these
semantic tokens per size. The shared resolver remains the Web pixel contract
for components that consume semantic dimension tokens.

## Alternatives considered

1. **Assume all numeric tokens are CSS pixels at every use site.** This would
   make the unit implicit and conversion inconsistent; centralize the Web
   interpretation instead.
2. **Add Style Dictionary transforms and generated output.** There is no
   current generated-token consumer or output convention, so a new build
   pipeline is unnecessary for the two components.
3. **Convert values for React Native now.** No React Native implementation or
   runtime exists to validate native units and layout behavior; do not claim
   cross-platform support.
4. **Store units directly in semantic token values.** This would change the
   established number type and alias-to-number convention; preserve existing
   source values and keep platform interpretation in the consumer adapter.

## Consequences

- React Web components consume the semantic dimensions consistently, with
  resolution checked against existing Foundation primitives.
- Semantic token data stays reusable and does not encode platform-specific
  units.
- CSS pixel interpretation is an explicit Web adapter contract and must not be
  presumed by non-Web consumers.
- React Native output, generated token files, and platform parity remain
  unsupported and unvalidated.

## Related documentation and implementation

- [Semantic spacing and radius](../foundation/semantic-spacing-radius.md)
- [`foundation/semantic-dimensions.ts`](../../foundation/semantic-dimensions.ts)
- [Tile](../../components/molecules/tile/README.md)
- [Text Compositor](../../components/molecules/text-compositor/README.md)
