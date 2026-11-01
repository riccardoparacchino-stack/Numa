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

<Button size="m" variant="primary" onClick={() => alert("Saved")}>Save</Button>
```

| Prop | Type | Behavior |
|---|---|---|
| `size` | `"s" \| "m" \| "l" \| "xl"` | Sets height, padding, icon size, and typography. |
| `variant` | `"primary" \| "secondary" \| "subtle" \| "ghost"` | Sets the semantic visual treatment. |
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
Enabled buttons use the primary and subtle interaction surface tokens for hover
and active feedback. Ghost buttons compose the Foundation ghost color and
opacity token pairs into a transparent overlay; disabled buttons suppress
hover and active styling. Disabled text uses the low-contrast disabled text
role, and outlined disabled buttons use a separate, subtler gray outline role
on the gray disabled surface.
