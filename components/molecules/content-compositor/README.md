# Content Compositor

`ContentCompositor` arranges optional leading, main, trailing, and footer
content. Use its `children` for a `TextCompositor` or custom content. Tile
remains a single-slot surface and does not own these layout regions.

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `leading` | `ReactNode` | — | Optional leading icon or content. |
| `children` | `ReactNode` | — | Flexible main content, commonly `TextCompositor`. |
| `trailing` | `ReactNode` | — | Optional trailing indicator or content. |
| `footer` | `ReactNode` | — | Optional full-width region below the main composition. |
| `as` | `"div" \| "span"` | `"div"` | Use `"span"` for phrasing wrappers when composing inside a native button. |
| `layout` | `"horizontal" \| "vertical"` | `"horizontal"` | Arranges the leading, main, and trailing regions. |
| `gap` | Pebbles `xs`, `s`, `m`, or `l` token name | `numa-spacing-pebbles-m` | Semantic gap between occupied regions and footer. |

Omitted, `null`, `false`, and empty-string regions do not render. The main
content flexes and wraps; leading and trailing content keep intrinsic size.
This React Web component uses the Foundation dimension adapter to interpret
the semantic spacing tokens as CSS pixels. A horizontal composition switches
to a stacked layout at 28rem of its own available inline size; an explicit
vertical layout remains vertical at every width.

The compositor is an inline-size query container. Its own content adapts to
that width, so it remains responsive when reused in a narrow Card or a wide
page. A parent Container also exposes the named `numa-page` query context to
other descendants.

```tsx
<Container size="m">
  <ContentCompositor
    leading={<Icon aria-hidden="true" />}
    trailing={<Chevron aria-hidden="true" />}
    footer={<Status />}
  >
    <TextCompositor title="Account" description="Profile and security" />
  </ContentCompositor>
</Container>
```

Use `as="span"` when the composition is inside a button Tile or Card; the
action must still contain only phrasing content and no independent
interactive controls. Prefer Container and Card for semantic page surfaces.

Use [Text Compositor](../text-compositor/README.md) for title/description
content and [Container](../container/README.md) or
[Card](../card/README.md) for semantic page surfaces. The low-level
[Tile](../tile/README.md) remains available when those roles do not apply. The
[live molecule preview](../story.html) exercises composition and surface roles.
