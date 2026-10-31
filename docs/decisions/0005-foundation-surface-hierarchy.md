# ADR 0005: Foundation Surface Hierarchy

- **Date:** 2026-10-31
- **Status:** Accepted

## Context

The generic Tile surface had been used for page regions, content cards, and
nested card content. Those roles have different structural purposes and
padding requirements. Counting generic nested Tiles to infer the role also
made the rule unclear when the outer surface contains fieldsets or arbitrary
compositions.

## Decision

Define the page surface hierarchy as
`page background → Container → Card → optional Card child`. Container is the
first surface directly in a page composition, may contain fieldsets and other
compositions, and cannot nest. Card groups a cohesive unit within a Container;
one nested Card may represent subordinate child content. Reject Cards outside
the Container/Card hierarchy and reject deeper Card nesting.

The outer Container chooses the shared `s`, `m`, or `l` size, which Cards
inherit. Assign padding by hierarchy role to taper inward, and use available
semantic radii satisfying `R_outer >= P_outer + R_inner` at every boundary.
Keep this as a practical visual rule rather than claiming universal geometry.
Use semantic Container and Card components in new page/card compositions;
retain Tile as a lower-level surface primitive.

## Alternatives considered

1. **Keep one generic Tile and infer all roles from depth.** This does not
   distinguish a page region from a card and makes arbitrary compositions
   affect surface meaning.
2. **Make each layer a separate top-level component.** A separate component
   for card children would add API without a distinct surface contract; nested
   Card already represents that subordinate role.
3. **Allow unrestricted Card nesting.** Repeated surface boundaries flatten
   visual hierarchy and make the card-child distinction ineffective.
4. **Wrap every group, including fieldsets, in Cards.** This confuses semantic
   form structure with a visual card and adds unnecessary containers.

## Consequences

- Page surfaces and card content have explicit component names and rules.
- Fieldsets and other compositions can remain direct Container children.
- Container size drives consistent dimensions throughout a Card hierarchy;
  role-specific padding and radii taper inward.
- Tile remains available as a low-level component; new semantic page/card
  compositions should prefer Container and Card.
- The enforced hierarchy is implemented for React Web only. Other platforms
  must define and validate their own implementation.

## Related documentation and implementation

- [Surface hierarchy](../foundation/surface-hierarchy.md)
- [Container](../../components/molecules/container/README.md)
- [Card](../../components/molecules/card/README.md)
- [Tile](../../components/molecules/tile/README.md)
