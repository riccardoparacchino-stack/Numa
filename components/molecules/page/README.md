# Page

Page is a generic React Web page-surface wrapper. It renders a `div`, accepts
arbitrary children, and applies the semantic
`numa-color-context-background-default` fill. It has no margin and applies
mode-specific gap and padding tokens. In automatic mode, a `ResizeObserver`
selects compact below 680px, relaxed from 680px, and spacious from 1280px. It
does not impose radius or child-component requirements.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Arbitrary page content. |
| `mode` | `"compact" \| "relaxed" \| "spacious"` | Automatic | Selects Page gap and padding. Automatic mode follows the Page's inline width. |
| HTML attributes | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the Page element. |
| `className`, `style` | React Web values | — | Adds a class or overrides the page surface and layout. |

Page is independent from Container's responsive sizing boundary and Tile's
contained surface roles. Choose document semantics such as `main` in the
surrounding application; Page does not add a role or select an HTML landmark.

```tsx
<Page>
  <Container>
    <Tile>Page content</Tile>
  </Container>
</Page>
```

See the [semantic color roles](../../../docs/foundation/semantic-colors.md)
and [surface hierarchy](../../../docs/foundation/surface-hierarchy.md).
The component is used as the page shell in the
[molecule showcase](../showcase.html). Its behavior is covered by
[runtime tests](Page.runtime.test.tsx).
