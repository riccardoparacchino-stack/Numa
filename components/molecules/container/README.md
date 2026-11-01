# Container

`Container` is the first surface layer on a page background. Place it directly
in the page composition, then compose fieldsets, forms, sections, Cards, and
other page content inside its single `children` slot.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Page-level composition; may include fieldsets and Cards. |
| `size` | `"s" \| "m" \| "l"` | `"m"` | Selects inherited size and the Container's outer radius. Descendant Cards inherit it. |
| Native/ARIA/data attributes | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the Container surface. |
| `className`, `style` | React Web values | — | Customize styling; `style.padding` can override the default. Radius, width, and minimum width are token-controlled. |

| Size | Default padding | Outer radius |
|---|---:|---:|
| `s` | 24px | 48px |
| `m` | 40px | 72px |
| `l` | 64px | 96px |

Container uses the weak `numa-color-context-surface-weak` surface against
the page background. Its first Card uses the strong surface; a Card child
alternates back to weak. This follows the Foundation
[weak/strong surface rule](../../../docs/foundation/semantic-colors.md).

Container is also a named inline-size query container (`numa-page`). Descendant
components can respond to the width they receive from this surface rather than
the viewport; see [container-query guidance](../../../docs/foundation/container-queries.md).

## Hierarchy and rationale

Use the surface hierarchy `page background → Container → Card → Card child`.
The Container is the one broad first-layer surface that groups a page region;
its content is not assumed to be a card. Fieldsets, forms, toolbars, and
multi-section compositions belong directly inside it when that matches their
semantics. Cards identify cohesive, independently scannable content within
that region. A Card nested in another Card is a child-card surface, not another
page container.

This distinction keeps page structure and content grouping explicit instead
of assigning meaning by counting generic Tile elements. It also avoids
wrapping form fieldsets or arbitrary compositions in card styling merely
because they happen to be grouped together. Containers cannot nest, and a
fourth surface level is rejected. A Container must be a direct page-level
surface; use normal layout elements to position multiple sibling Containers.

The outer Container chooses `s`, `m`, or `l`; Cards inherit that size and
radius progression. Padding tapers by role to keep the surface contours
balanced:

| Size | Container / Card / Card child padding | Container / Card / Card child radius |
|---|---|---|
| `s` | 24 / 12 / 8px | 48 / 24 / 4px |
| `m` | 40 / 20 / 12px | 72 / 24 / 4px |
| `l` | 64 / 24 / 12px | 96 / 32 / 4px |

At each nested boundary, follow the practical radius guidance
`R_outer >= P_outer + R_inner`; for example, `96 >= 64 + 32` and
`32 >= 24 + 4` for size `l`. Values resolve through existing semantic spacing
and radius tokens, including `numa-radius-walls-xl` for the 96px radius.

## Example

```tsx
<Container size="l">
  <fieldset>
    <legend>Account settings</legend>
    <Card>
      <TextCompositor title="Profile" description="Name and contact details" />
      <Card>
        <TextCompositor title="Contact details" description="Email and phone" />
      </Card>
    </Card>
  </fieldset>
</Container>
```

`Container` is a React Web component. It renders a non-interactive `div`;
choose native semantics in its children. See [Card](../card/README.md) for
card-level composition and the [live molecule previews](../story.html).
