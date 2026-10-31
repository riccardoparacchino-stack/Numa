# Tile

Tile is a low-level React Web surface that accepts one composition through
`children`. It supports static content, a native navigation link, or one
native button action. For page and card surfaces, prefer the semantic
[Container](../container/README.md) and [Card](../card/README.md) components.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `children` | `ReactNode` | — | The Tile's single content slot. Compose with `ContentCompositor` or nest Tiles directly. |
| `variant` | `"s" \| "m" \| "l"` | `"m"` | Selects token-based padding. Nested Tiles inherit the outer Tile's variant. |
| `href` | `string` | — | Renders a native anchor. Mutually exclusive with `onClick`. |
| `onClick` | Button click handler | — | Renders a native button. Mutually exclusive with `href`. |
| `disabled` | `boolean` | `false` | Native disabled action-button behavior. |
| Native/ARIA/data attributes | Element attributes | — | Forwarded to the rendered `div`, `a`, or `button`. |
| `className`, `style` | React Web values | — | Customizes styling; `style.padding` can adjust a Tile's padding independently of its size variant. Radius, width, and minimum width remain token-controlled. |

| Variant | Padding token | Padding |
|---|---|---|---|
| `s` | `numa-spacing-pebbles-s` | 8px |
| `m` | `numa-spacing-pebbles-l` | 16px |
| `l` | `numa-spacing-bricks-s` | 24px |

These are content-sized surfaces that fill their parent's available width.
Parent layouts control placement and equal heights. The semantic spacing
adapter interprets token numbers as CSS pixels for React Web.

## Composition

Use `ContentCompositor` to arrange leading, main, trailing, and footer
content. It may contain `TextCompositor` or custom children. Tile itself owns
no content layout API:

```tsx
<Tile variant="m">
  <ContentCompositor
    leading={<Icon aria-hidden="true" />}
    trailing={<Chevron aria-hidden="true" />}
    footer={<Status />}
  >
    <TextCompositor title="Account" description="Profile and security" />
  </ContentCompositor>
</Tile>
```

Tile size and nesting depth are independent. The outer Tile selects the shared
size (`s`, `m`, or `l`); every descendant inherits it. Nesting roles are
assigned structurally: outer, middle, then inner. A fourth nested Tile throws.
Do not set a conflicting `variant` on a nested Tile. The role selects the
radius while the inherited size selects default padding. A nested layout may
override padding per level with `style.padding`:

| Outer size | Outer / middle / inner padding | Outer / middle / inner radius | Radius checks (outer; middle) |
|---|---|---|---|
| `s` | 24 / 12 / 8px | 48 / 24 / 4px | `48 >= 24 + 24`; `24 >= 12 + 4` |
| `m` | 40 / 20 / 12px | 72 / 24 / 4px | `72 >= 40 + 24`; `24 >= 20 + 4` |
| `l` | 64 / 24 / 12px | 96 / 32 / 4px | `96 >= 64 + 32`; `32 >= 24 + 4` |

The preview uses this tapered spacing progression to avoid repeating the same
padding at every level. Radii use the nearest suitable semantic tokens that
satisfy `R_outer >= P_outer + R_inner` at each boundary. See the [live molecule
preview](../story.html).

Tile surface fills default to weak semantic level 1 and alternate weak/strong
when Tiles are nested. `surfaceLevel` may select either semantic context
surface explicitly. Semantic page/card compositions should use Container and
Card, which enforce the Foundation hierarchy.

## Interaction rules

- Use static Tile for grouped content, a native link for navigation, and a
  native button for one primary action.
- Never place another interactive element inside a link or button Tile.
  Use a static Tile for several independent actions.
- Static Tiles are not focusable. Interactive Tiles use native keyboard
  activation and a visible focus outline.
- Button-Tile children must be valid phrasing content; use a static Tile when
  the composition requires block-level content or nested containers.
- Selection and disclosure are not Tile variants. Use native controls for
  those patterns.

React Native, generated CSS tokens, and a minimum target-size policy are not
implemented in this repository.
