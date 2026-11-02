# List and ListItem

These React Web content atoms preserve native list semantics and let the composition choose ordered or unordered structure.

```tsx
<List listType="ordered" type="a" start={3} aria-label="Steps">
  <ListItem>Review the content.</ListItem>
  <ListItem>Publish the page.</ListItem>
</List>
```

`List` defaults to `listType="unordered"`; `listType="ordered"` renders `<ol>`. It retains native ordered-list attributes such as marker `type`, `start`, and `reversed`; `ListItem` forwards native item attributes such as `value`. Both components forward applicable ARIA/data attributes. `ListItem` always renders `<li>`. No roles or markers are inserted. `className` and `style` apply to the selected list and list item respectively.

The list uses a CSS grid row gap from `numa-spacing-pebbles-s` and start padding from `numa-spacing-bricks-s`; native markers and ordering are retained. Use `Stack` for other reusable directional layouts, or let callers control showcase-specific layout and typography.

Limit: list items should be composed inside a `List`; React Web only. See [content showcase](../story.html), [semantic spacing](../../../docs/foundation/semantic-spacing-radius.md), and [List tests](List.test.tsx).
