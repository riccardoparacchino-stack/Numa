# Tile

Tile is a low-level React Web surface with one `children` slot. It can render
static content, a native navigation link, or one native button action. Use
`ContentCompositor` for common content arrangements; Tile itself has no
content-layout API.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | Arbitrary content. Nested Tiles are supported up to three levels. |
| `href` | `string` | — | Renders a native anchor. Mutually exclusive with `onClick`. |
| `onClick` | Button click handler | — | Renders a native button. Mutually exclusive with `href`. |
| `disabled` | `boolean` | `false` | On a button, applies native disabled behavior. On a static Tile, establishes disabled mode for descendant Numa controls and semantic colors. Links do not accept this prop. |
| `surfaceLevel` | `"level-1" \| "level-2"` | Alternates from parent; otherwise `"level-1"` | Selects the weak or strong semantic surface. |
| Native/ARIA/data attributes | Element attributes | — | Forwarded to the rendered `div`, `a`, or `button`. |
| `className`, `style` | React Web values | — | Adds a class or style override. Padding may be overridden; radius, width, and minimum width remain controlled. |

Tile fills its parent's available width; parent layout controls placement and
height. When no sizing Container is present, it uses the default compact
configuration: 8px base padding, a 1.2 Minor Third ratio, and a 2× radius
multiplier.

## Parametric sizing

Tile reads generated padding and radius values from inherited CSS custom
properties. The scale generator in
[`foundation/parametric-sizing.ts`](../../../foundation/parametric-sizing.ts)
is generic and independently tested; Tile maps nested roles to scale steps in
[`tile-sizing.ts`](./tile-sizing.ts). Container takes the former outer Tile
step and weak surface. Inside a Container, the first Tile starts at the
middle role and uses the strong surface; its nested Tile is the final inner
role and returns to the weak surface.

For base padding `b`, harmonic ratio `r`, and scale step `n`, padding is
`roundToMultipleOf4(b × rⁿ)`. The default base is 8px. Compact, relaxed, and
spacious start at steps 0, 1, and 2. Nested roles advance by two scale steps:
inner uses the mode's initial step, middle uses two additional steps, and
outer uses four. This tapers the nested surfaces without separate size
variants or per-mode token lists. Padding and radius always round to the
nearest 4px. Radii start from the shared `paddingToRadius` function; the scale
generator raises each radius as needed to preserve the Foundation contour
guideline `R_outer >= P_outer + R_inner` between steps two apart, matching
Tile's two-step nesting-role intervals.

The harmonic ratio is independent of mode and can be any positive finite
number. Named presets are Minor Second (1.067), Major Second (1.125), Minor
Third (1.2), Major Third (1.25), Perfect Fourth (1.333), and Perfect Fifth
(1.5). The default radius multiplier is 2 and can also be configured on
Container.

Container density can be selected explicitly, or left automatic. Automatic
mode uses compact below 480px, relaxed from 480px, and spacious from 800px,
measured against the Container's inline size. Container uses a ResizeObserver
for its own step and updates the inherited Tile sizing variables; CSS
container queries remain a fallback. Explicit modes are stable at every width.

```tsx
<Container mode="relaxed">
  <Tile>
    Middle content
    <Tile>Innermost content</Tile>
  </Tile>
</Container>
```

The [Tile molecule showcase](../showcase.html#tile-heading) demonstrates
representative static, link, and button usage. The separate
[experimental parametric sizing demo](../../../demos/tile-parametric.html)
explores scale parameters and is not an API reference.

## Composition and interaction

- Use a static Tile for grouped content, a native link for navigation, and a
  native button for one action. Never put independent interactive controls
  inside a link or button Tile.
- Static Tiles are not focusable. Interactive Tiles use native keyboard
  activation and a visible focus outline.
- Nested Tiles outside a Container receive outer, middle, and inner structural
  roles. Inside a Container, Tile children receive middle then inner roles;
  the inner role is the last Tile level and a nested Tile beneath it throws.
- Disabled mode on a static Tile propagates through descendants. It does not
  make arbitrary custom content inert or accessible as disabled.
- Button-Tile children must be valid phrasing content; use a static Tile for
  block-level content or nested containers.
- Selection and disclosure are not Tile variants. Use native controls.

Tile uses Numa semantic color variables for surfaces, text, borders, hover,
active, focus, and disabled states. React Native, generated CSS tokens, and a
minimum target-size policy are not implemented.

## Tests

[Runtime tests](Tile.runtime.test.tsx) cover native rendering, nesting,
interaction, disabled inheritance, and attribute forwarding.
[Sizing algorithm tests](tile-sizing.algorithm.test.ts) cover role-to-step
mapping and nested contour constraints.
