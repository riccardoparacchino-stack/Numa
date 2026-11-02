# Card

`Card` is a cohesive content surface. It can contain a composition, and one
nested `Card` may be used for a child item or subordinate group. When a Card
is inside a [Container](../container/README.md), it consumes that Container's
inherited parametric sizing environment; otherwise it uses Tile's compact
defaults.

## API

`Card` uses the Tile interaction and native-attribute API, excluding
`surfaceLevel`. It supports static content, a native `href` link, or one
native `onClick` action; these interaction choices are mutually exclusive.
`className` and `style` are forwarded, and `style.padding` can adjust spacing.
Radius, width, and minimum width remain controlled by Tile.

Cards alternate semantic surface levels: the Card inside a Container uses
`numa-color-context-surface-strong`; its nested Card child uses weak
`numa-color-context-surface-weak`. See the Foundation
[weak/strong surface rule](../../../docs/foundation/semantic-colors.md).

## Rules and rationale

- Use a Card for one cohesive, independently scannable group, not as the
  default wrapper for every child element.
- Use one nested Card for a subordinate child group. Deeper Card nesting is
  rejected; compose further detail inside the current Card instead.
- Use a generic Container to establish an inline-size query boundary and
  optional Tile sizing mode. It is not a visual surface and does not impose a
  parent requirement on Card.
- Use a Card link for navigation and a Card button for one action. Do not put
  independent controls inside an interactive Card.
- Nesting depth determines whether a Card is the middle or inner Tile layer.
  Padding and radius come from the shared parametric sizing generator.

This keeps content-grouping semantics separate from generic layout
boundaries, without requiring form structures or arbitrary compositions to
be wrapped in Cards.

`Card` is a React Web component. See the [Tile sizing guide](../tile/README.md)
and [representative molecule compositions](../showcase.html#slots-heading).
Behavior is covered by [runtime tests](Card.runtime.test.tsx).
