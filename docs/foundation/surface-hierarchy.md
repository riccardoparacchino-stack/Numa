# Surface hierarchy

Numa page surfaces follow an explicit hierarchy:

`page background → Container → Card → optional Card child`

## Roles

- **Container** is the first surface layer directly in a page composition. It
  establishes a bounded region on the page background and may contain
  fieldsets, forms, toolbars, sections, Cards, or other compositions.
- **Card** groups one cohesive, independently scannable unit inside a
  Container. Use a Card for the unit, not as the automatic wrapper for every
  element.
- **Card child** is one optional Card nested inside a Card for a subordinate
  child group. Use it sparingly; deeper nesting obscures rather than clarifies
  hierarchy.

Containers do not nest. A Card requires a Container or Card parent, and a
Card may contain at most one nested Card level. Use sibling Containers for
separate page regions and normal layout composition to position them.
Fieldsets and other structures that are not cards belong directly in the
Container; preserve their native semantics instead of styling them as Cards.

## Size, padding, and radius

The Container chooses the shared `s`, `m`, or `l` size. Cards inherit this
size, while each hierarchy role has its own padding and radius:

| Size | Container / Card / Card child padding | Container / Card / Card child radius |
|---|---|---|
| `s` | 24 / 12 / 8px | 48 / 24 / 4px |
| `m` | 40 / 20 / 12px | 72 / 24 / 4px |
| `l` | 64 / 24 / 12px | 96 / 32 / 4px |

Surface fills alternate weak and strong using the semantic context tokens:
Container uses `surface-weak`, Card uses `surface-strong`, and Card child
returns to `surface-weak`. Each additional contained layer
continues that alternation.

Use the practical contour guideline at each nested boundary:

`R_outer >= P_outer + R_inner`

For example, the `l` progression satisfies `96 >= 64 + 32` at the
Container/Card boundary and `32 >= 24 + 4` at the Card/Card-child boundary.
Padding tapers inward so content has room at the page level without making
each nested Card feel equally heavy. Radii use the nearest available semantic
tokens that satisfy the guideline. This is a visual aid, not a universal
geometric law; dimensions, clipping, asymmetry, and optical tuning can warrant
adjustments.

## Why roles are explicit

Using one generic Tile for all three layers makes the component's purpose
depend on nesting depth. That is ambiguous when a page surface contains
fieldsets, forms, or custom compositions that are not cards. Distinct
Container and Card components make the page-level surface and content
grouping visible in code, permit role-specific composition rules, and prevent
accidental over-nesting. A nested Card communicates subordinate content, not
a second page region.

The React Web `Container` and `Card` components implement these rules using
the existing semantic spacing/radius tokens and dimension adapter. See
[Container](../../components/molecules/container/README.md),
[Card](../../components/molecules/card/README.md), and the
[live molecule previews](../../components/molecules/story.html). This rule
does not claim React Native behavior or generated style output.
