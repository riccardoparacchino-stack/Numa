# Container

Container is a React Web layout element that establishes a named inline-size
query boundary, applies the first Tile surface, and occupies the outermost
step in the shared harmonic sizing progression. It renders a `div` and accepts
arbitrary children.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Arbitrary children. |
| `mode` | `"compact" \| "relaxed" \| "spacious"` | Automatic | Selects the Container's own dimensions and the descendant sizing environment. When omitted, the Container observes its inline size. |
| `basePadding` | `number` | `8` | Positive base padding in CSS pixels for the generated scale. |
| `harmonicRatio` | `number` | `1.2` | Positive scale multiplier, independent of mode. |
| `radiusMultiplier` | `number` | `2` | Positive multiplier used by the shared sizing scale. |
| HTML attributes | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the Container element. |
| `className`, `style` | React Web values | — | Adds classes or controls layout; explicit style values override generated styles. |

Container applies generated padding and radius from the shared scale and uses
the weak semantic surface with the subtle context outline. Its shadow uses the
`context-shadow-subtle` semantic color, semantic spacing values for its
geometry, and the existing 20% primitive percentage. It takes the
former outer Tile's step 4 and surface level 1. Its Tile nesting context
starts at the middle role. The first nested Tile uses step 2 and
`surface-strong`; its inner Tile uses step 0 and `surface-weak`. Modes offset
this progression by steps 0, 1, and 2. The Container also exposes the
generated dimensions to descendants as CSS custom properties. The inner Tile
is the final Tile level inside a Container; nested Tiles beneath it are
rejected.

The query container is named `numa-sizing`. In automatic mode, a
`ResizeObserver` selects the progression mode from the Container's inline
size and updates its own dimensions and the selected-step variables inherited
by descendant Tiles. Widths below 480px use compact, widths from 480px use
relaxed, and widths from 800px use spacious. Explicit modes are unaffected by
width. CSS container queries remain as a fallback for descendant Tiles when
`ResizeObserver` is unavailable. Nested Containers establish independent
sizing boundaries and start a fresh Tile composition.

```tsx
<Page>
  <Container mode="spacious">
    <Tile>
      Middle content
      <Tile>Innermost content</Tile>
    </Tile>
  </Container>
</Page>
```

See the [Page documentation](../page/README.md), [Tile sizing
documentation](../tile/README.md), and
[experimental parametric sizing demo](../../../demos/tile-parametric.html).
The [molecule showcase](../showcase.html#tile-heading) includes representative
Container compositions; [runtime tests](Container.runtime.test.tsx) cover its
mode and sizing behavior.
