# Text Compositor

`TextCompositor` arranges a required title with an optional description. It
only owns text composition, alignment, and the gap between the two text
elements. It does not own surfaces, positioning, interactions, or parent
layout. It is a React Web component and adds no keyboard focus stop.

## API

```tsx
<TextCompositor title="Account" description="Manage profile and security" />
```

| Prop | Type | Default | Behavior |
|---|---|---|---|
| `title` | `ReactNode` | required | Primary content rendered by Numa `Text`. |
| `description` | `ReactNode` | — | Optional supporting content; absent values render no description node or gap. |
| `align` | `"start" \| "center" \| "end"` | `"start"` | Logical text alignment; does not position the component or change parent direction. |
| `gap` | Pebbles `xs`, `s`, `m`, or `l` token name | `numa-spacing-pebbles-xs` | Semantic gap used only when a description is rendered. |
| `titleTypography` | `TextVariantSize` | `title/s` | Selects a valid Numa Text typography pair. |
| `descriptionTypography` | `TextVariantSize` | `body/m` | Selects a valid Numa Text typography pair. |
| `titleTextProps`, `descriptionTextProps` | Text props except `children`, `variant`, `size` | — | Pass through semantics, ARIA, color, weight, and other existing Text customization. |
| `style` | React CSS properties excluding layout, width, alignment, and gap | — | Customizes non-layout wrapper properties. |
| Other span attributes | `HTMLAttributes<HTMLSpanElement>` | — | Forwarded to the wrapper. |

Both Text elements inherit the selected text alignment and wrap naturally. The
component wrapper is a `span` rendered as a flex container, fills the parent's
available width, has content-driven height, does
not truncate, and allows long words to wrap. `start` and `end` are logical CSS
values and follow writing direction. Typography variant and size remain
separate from HTML semantics; choose semantic elements through the existing
Text props when needed.

## Examples

Independent use:

```tsx
<TextCompositor
  title="Your workspace"
  description="Invite teammates and organize projects"
  align="center"
  gap="numa-spacing-pebbles-s"
  titleTypography={{ variant: "headline", size: "s" }}
/>
```

Inside a page Container and Card link:

```tsx
<Container size="m">
  <Card href="/settings">
    <ContentCompositor
      as="span"
      leading={<WorkspaceIcon aria-hidden="true" />}
      trailing={<ChevronRight aria-hidden="true" />}
    >
      <TextCompositor title="Workspace" description="Open workspace settings" />
    </ContentCompositor>
  </Card>
</Container>
```

The gap maps semantic tokens to CSS pixels through the shared Foundation
dimension adapter. See the [semantic spacing and radius documentation](../../../docs/foundation/semantic-spacing-radius.md)
for the unit decision and supported tokens. TextCompositor is independent of
Tile and can be used in other layouts. See the [live molecule previews](../story.html)
for all alignment/gap combinations and title-only behavior.
