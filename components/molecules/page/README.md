# Page

Page is a generic React Web page-surface wrapper. It renders a `div`, accepts
arbitrary children, and applies the semantic
`numa-color-context-background-default` fill. It has no margin and applies
80px top, 20px inline, and 120px bottom padding from existing semantic spacing
tokens. The bottom padding composes the 80px and 40px tokens because the
Foundation spacing scale has no single 120px token. It does not impose radius
or child-component requirements.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Arbitrary page content. |
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
