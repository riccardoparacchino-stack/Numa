# ADR 0003: Foundation Semantic Spacing and Radius

- **Date:** 2026-10-31
- **Status:** Accepted

## Context

Foundation has a flat DTCG-style token convention and integer numeric
primitives, but no semantic spacing/radius collections or token build
configuration. The numeric primitives are unitless numbers. Typography has
separate `rem` dimensions, not a canonical REM collection that spacing and
radius could alias. There is no configured CSS output or React Native
transformation pipeline.

## Decision

Add separate flat semantic sources at
[`tokens/semantic/spacing.json`](../../tokens/semantic/spacing.json) and
[`tokens/semantic/radius.json`](../../tokens/semantic/radius.json). Name them
`numa-spacing-{group}-{size}` and `numa-radius-{group}-{size}`, use the
existing `number` type and `{token-name}` aliases, and reference only existing
`numa-sys-int-*` primitives. Keep the requested small pebbles/bricks/walls
scales. Do not create a 2px semantic step or modify primitives.

Do not add a build pipeline or platform conversion as part of this source-only
semantic layer. Preserve the primitive unitlessness rather than declaring
CSS pixels, REM, or React Native points without an established repository
contract. Document that actual platform outputs remain unsupported and must
be defined and validated by future integration work.

Document the padding-to-radius guideline as practical design guidance only,
not as a universal rule or automated validation constraint.

## Alternatives considered

1. **Alias a REM primitive collection.** None exists; treating typography's
   `rem` dimensions as a canonical spacing scale would conflate collections.
2. **Treat integer primitives as CSS pixels.** The existing numeric tokens do
   not encode units and there is no CSS transform to confirm this assumption.
   Keep the source numbers unchanged and make the limitation explicit.
3. **Add Style Dictionary output and React Native transforms now.** The
   repository has no configured output formats, consumer contract, or native
   harness. Adding those would be a wider architecture change than defining
   semantic aliases.
4. **Add more scale steps to satisfy all nested-surface combinations.** This
   would expand the intentionally small scale; use the documented guideline
   contextually instead.

## Consequences

- Spacing and radius roles have stable semantic names and alias existing
  primitive values without duplication.
- Tests can validate every alias and expected numeric value.
- The source does not identify a physical unit and is not yet a platform
  consumption API. CSS dimensions and React Native output remain unimplemented
  and unvalidated.
- The nested-surface guidance can inform design without forcing inappropriate
  geometry or expanding the token inventory.

## Related documentation and implementation

- [Semantic spacing and radius](../foundation/semantic-spacing-radius.md)
- [`tokens/semantic/spacing.json`](../../tokens/semantic/spacing.json)
- [`tokens/semantic/radius.json`](../../tokens/semantic/radius.json)
- [`foundation/semantic-spacing-radius-tokens.test.ts`](../../foundation/semantic-spacing-radius-tokens.test.ts)
