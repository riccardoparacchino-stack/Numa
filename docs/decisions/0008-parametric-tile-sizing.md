# ADR 0008: Parametric Tile Sizing and Container Composition

- **Date:** 2026-11-01
- **Status:** Current

## Context

Tile used predefined size variants backed by token names, while Container
rendered Tile internally and supplied Tile-specific React context. This
coupled layout to Tile surface behavior and limited Tile sizing to a small
fixed scale.

## Decision

- Make Container a `div` with a named inline-size query boundary, the first
  semantic surface, and the outermost dimension step. It does not render a
  Tile internally, but establishes the Tile nesting context for its children.
- Let Container occupy step 4 in the shared progression and expose generated
  sizing values through CSS custom properties. Explicit compact, relaxed, and
  spacious modes remain fixed at every width. In automatic mode, a
  ResizeObserver selects Container and descendant Tile dimensions together;
  CSS container queries provide a fallback for Tile dimensions.
- Give Container the former outer Tile's surface and dimensions. Start its
  first descendant Tile at the middle role, followed by the inner role as the
  final Tile level within a Container. Standalone Tile nesting remains
  outer/middle/inner.
- Generate Tile padding from a configurable base and harmonic ratio, rounding
  to the nearest 4px. Compact, relaxed, and spacious use initial steps 0, 1,
  and 2. Outer, middle, and inner roles use four, two, and zero additional
  steps.
- Derive initial radii from the resolved padding using one central
  configurable multiplier, then raise radii at steps two apart as needed to
  preserve the Foundation nested-contour guideline
  `R_outer >= P_outer + R_inner` at each Tile boundary. Do not create a token
  for every generated value.
- Preserve Tile's native static, anchor, and button renderings; disabled
  propagation; surface-color alternation; and focus, hover, active, and
  disabled colors.
- Keep Card as a semantic grouping component, independent from Container
  presence. It retains one nested child level and uses the same Tile sizing
  environment.

## Alternatives considered

1. **Keep Container composed from Tile.** This preserves the Tile surface
   styling but makes Container itself a Tile and transfers its interaction and
   nesting semantics.
2. **Use JavaScript resize observation for Container only.** A self-query
   cannot select Container's own dimensions, but it can leave Tile sizing
   entirely to CSS. A shared observed mode keeps both parts of the progression
   aligned, with CSS queries retained as a fallback.
3. **Add semantic tokens for each generated dimension.** Arbitrary base and
   ratio configurations would proliferate tokens; calculate values instead.

## Consequences

- Container can wrap arbitrary content, and nested Containers establish
  independent query boundaries and surface compositions.
- Tile defaults to compact when no sizing environment is inherited.
- Automatic mode uses compact below 480px, relaxed from 480px, and spacious
  from 800px. An explicit mode is unaffected by those thresholds.
- Container applies the former outer Tile's generated padding, radius, and
  weak semantic surface. Descendant middle and inner Tiles use strong then
  weak semantic surfaces. Page still owns the page-background role.
- Page owns the page-background role, independently of Container sizing and
  Tile surface nesting.
- FigCraft's Page fill maps to `context-background-default`; Page and the
  weak Container/inner-Tile surfaces use slate-100, while the middle Tile
  uses the existing strong surface token (slate-200). The white Container
  frame fill is not used.
- Generated dimensions are React Web CSS pixels. Other platform adapters
  remain out of scope.

## Related documentation and implementation

- [Container](../../components/molecules/container/README.md)
- [Page](../../components/molecules/page/README.md)
- [Tile](../../components/molecules/tile/README.md)
- [Card](../../components/molecules/card/README.md)
- [Surface hierarchy](../foundation/surface-hierarchy.md)
- [`foundation/parametric-sizing.ts`](../../foundation/parametric-sizing.ts)
