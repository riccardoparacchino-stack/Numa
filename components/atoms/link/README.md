# Link

`Link` is the single React Web presentation for document navigation and inline links. It belongs to Atoms because it decorates one native anchor without imposing a page composition.

```tsx
<Link href="/docs" target="_blank" rel="noreferrer">Documentation</Link>
```

It renders `<a>` and forwards native anchor, `aria-*`, and `data-*` attributes, including `href`, `target`, `rel`, and `download`. No `href` is required, preserving native placeholder-anchor behavior. It does not turn internal navigation into a button or infer roles. `className` and `style` are forwarded to the anchor; inline style values override defaults.

The default and only presentation uses the semantic interactive action content color, persistent underline, thicker underline on hover, and a visible focus outline using the Foundation focus token. No visited semantic token exists, so the browser's visited state is not specially styled. Text inherits from its composition. Foundation colors are resolved through `semantic-color-style.ts`; underline radius uses `numa-radius-pebbles-xs`.

Limit: React Web only. See the [content showcase](../story.html), [Foundation semantic colors](../../../docs/foundation/semantic-colors.md), and [Link tests](Link.test.tsx).
