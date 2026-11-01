# Card

`Card` is a cohesive content surface inside a page-level
[Container](../container/README.md). It can contain a composition, and one
nested `Card` may be used for a child item or subordinate group. Nested Cards
inherit the Container's size and receive the child-card radius and padding.

## API

`Card` uses the Tile interaction and native-attribute API, excluding `variant`.
The Container supplies the size. It supports static content, a native `href`
link, or one native `onClick` action; these interaction choices are mutually
exclusive. `className` and `style` are forwarded, and `style.padding` can
adjust role-specific spacing. Radius, width, and minimum width remain
token-controlled.

| Size inherited from Container | Card padding / radius | Card child padding / radius |
|---|---:|---:|
| `s` | 12px / 24px | 8px / 4px |
| `m` | 20px / 24px | 12px / 4px |
| `l` | 24px / 32px | 12px / 4px |

Cards alternate semantic surface levels: the Card inside a Container uses
`numa-color-context-surface-strong`; its nested Card child uses weak
`numa-color-context-surface-weak`. See the Foundation
[weak/strong surface rule](../../../docs/foundation/semantic-colors.md).

## Rules and rationale

- Place Cards inside a Container; a Card without a Container or Card parent
  is invalid.
- Use a Card for one cohesive, independently scannable group, not as the
  default wrapper for every child element.
- Use one nested Card for a subordinate child group. Deeper Card nesting is
  rejected; compose further detail inside the current Card instead.
- Keep fieldsets and page-level compositions directly in the Container when
  they are not themselves a card. Use native fieldset/legend semantics for
  form groups.
- Use a Card link for navigation and a Card button for one action. Do not put
  independent controls inside an interactive Card.
- The Container selects `s`, `m`, or `l`; every Card inherits that size.
  Nesting depth determines whether the Card is the middle or inner layer.
- Padding tapers with depth; radius follows
  `R_outer >= P_outer + R_inner` so nested corners remain visually aligned.

This separation makes page-level region, card grouping, and subordinate card
content explicit. It avoids inferring meaning from generic surfaces or
wrapping semantic form structures in cards unnecessarily.

`Card` is a React Web component. See the [live molecule previews](../story.html)
for all size progressions and examples.
