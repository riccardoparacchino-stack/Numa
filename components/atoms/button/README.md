# Button Atom

`Button` is the React Web action component for the Numa design system. It uses
semantic native buttons, shared Foundations tokens, and the existing `Text` atom
for its label typography.

## Preview

Open the interactive preview at [story.html](./story.html) or run:

```bash
npm run story:button
```

## API

```tsx
import { Button } from "./components/atoms/button";

<Button size="m" variant="action" onClick={() => alert("Saved")}>Save</Button>
```

| Prop | Type | Behavior |
|---|---|---|
| `size` | `"s" \| "m" \| "l" \| "xl"` | Sets height, padding, icon size, and typography. |
| `variant` | `"action" \| "outlined" \| "subtle" \| "ghost"` | Sets the semantic visual treatment. |
| `disabled` | `boolean` | Prevents activation and applies disabled semantic colors. |
| `loading` | `boolean` | Adds a spinner and blocks duplicate activation. |
| `fullWidth` | `boolean` | Expands the button to the available width of its container. |
| `leadingIcon` / `trailingIcon` | React node | Renders a compatible icon before or after the label. |
| `iconOnly` | `boolean` | Uses an icon-only layout and requires an accessible name. |
| `label` / `children` | React node | Provides the button content. |
| `onClick` | event handler | Native click handler for enabled buttons. |

The component renders a native `button` and accepts standard button attributes.
TypeScript and the existing design-system semantics keep it aligned with the
Foundation token model instead of exposing arbitrary custom colors or sizing.
The `action` variant uses the interactive action surface and its light-on-action
content; its focus ring uses contrasting inner and outer outlines. `outlined`
uses the weak context surface and action outline. Enabled buttons use semantic
hover and active surfaces; ghost buttons compose the Foundation ghost color
with its state opacity. Disabled buttons suppress hover and active styling.
Disabled content and outlines use separate subdued roles.

A disabled mode inherited from a parent is combined with the Button's own
`disabled` and `loading` states. The native button is disabled if any of these
states is active; a child cannot re-enable itself inside a disabled subtree.
