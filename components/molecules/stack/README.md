# Stack

Stack is a React Web styling-only layout primitive. It arranges repeated
children in a single flex flow without imposing semantic roles, landmarks, or
list behavior on the UI that composes it.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Arbitrary child content. |
| `direction` | `"vertical" \| "horizontal" \| "wrap-column" \| "wrap-row"` | `"vertical"` | Chooses the flex axis and wrapping behavior. |
| `mode` | `"compact" \| "relaxed" \| "spacious"` | Inherited from a parent `Container`, otherwise `"compact"` | Chooses the stack spacing scale without creating a second mode system. |
| `className`, `style` | React Web values | — | Adds classes or local layout overrides while preserving the default Stack contract. |
| HTML attributes | `HTMLAttributes<HTMLDivElement>` | — | Forwarded to the rendered `div`. |

The component renders a plain `div` and deliberately does not set `role`,
`aria-label`, list semantics, or implicit accessibility behavior. The caller
still decides how children are marked up semantically.

## Layout behavior

| Direction | `flex-direction` | `flex-wrap` | Gap behavior |
|---|---|---|---|
| `vertical` | `column` | `nowrap` | Vertical gap uses the stack vertical token; horizontal gap stays unset. |
| `horizontal` | `row` | `nowrap` | Horizontal gap uses the stack horizontal token; vertical gap stays unset. |
| `wrap-column` | `column` | `wrap` | Vertical gap uses the stack vertical token and horizontal gap follows the horizontal token for wrapped columns. |
| `wrap-row` | `row` | `wrap` | Vertical gap uses the stack vertical token and horizontal gap follows the horizontal token for wrapped rows. |

`Stack` follows the nearest ancestor `Container` mode when available. Outside of
`Container`, it defaults to `compact`, which matches the default sizing
environment already used by Tile.

## Gap and tokens

Stack consumes the shared semantic spacing scale by mode and axis. The tokens
for the current Foundation contract are:

- `numa-spacing-stack-compact-vertical` = `8`
- `numa-spacing-stack-compact-horizontal` = `12`
- `numa-spacing-stack-relaxed-vertical` = `12`
- `numa-spacing-stack-relaxed-horizontal` = `16`
- `numa-spacing-stack-spacious-vertical` = `16`
- `numa-spacing-stack-spacious-horizontal` = `24`

These are resolved through the same semantic spacing adapter used elsewhere in
Foundation, so the component does not duplicate mode mapping logic.

```tsx
<Container mode="relaxed">
  <Stack direction="horizontal" style={{ alignItems: "center" }}>
    <span>One</span>
    <span>Two</span>
    <span>Three</span>
  </Stack>
</Container>
```

```tsx
<nav aria-label="Primary navigation">
  <Stack direction="wrap-row" style={{ alignItems: "center" }}>
    <a href="#overview">Overview</a>
    <a href="#details">Details</a>
    <a href="#settings">Settings</a>
  </Stack>
</nav>
```

The first example keeps the layout purely visual; the second example shows that
`Stack` remains layout-only while the composition chooses the semantic wrapper.

See [Container documentation](../container/README.md), [molecule showcase](../showcase.html), and [runtime tests](Stack.runtime.test.tsx).
