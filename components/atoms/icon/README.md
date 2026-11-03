# Icon

`Icon` renders an icon from the Feather SVG set as an inline SVG. The default
stroke uses the semantic `numa-color-context-content-strong` token and follows
`currentColor`. Pass `style={{ color: ... }}` to override it.

## API

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `name` | `IconName` | — | A valid Feather icon name, checked against the installed icon set. |
| `size` | `number` | `24` | Width and height in CSS pixels. |
| `title` | `string` | — | Adds an accessible SVG title. |
| `aria-label` | `string` | — | Accessible name for the icon. |
| SVG attributes | `SVGProps<SVGSVGElement>` | — | Forwarded to the root SVG. |
| `style` | `CSSProperties` | — | Adds inline styles; a supplied color overrides the default semantic color. |

Icons without a title or `aria-label` are decorative and hidden from assistive
technology by default.

```tsx
import { Icon } from "./icon";

<Icon name="search" />
<Icon name="arrow-right" size={20} title="Continue" />
```
