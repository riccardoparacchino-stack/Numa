# Callout

`Callout` is a neutral supporting-content surface for document notes. It is an Atom because it styles one content region without choosing its role or message meaning.

```tsx
<Callout aria-describedby="note-title">
  <Text variant="title" size="s" as="h2" id="note-title">Note</Text>
  <Text variant="body" size="m" as="p">Keep a backup before changing this setting.</Text>
</Callout>
```

It renders a `<div>` and forwards applicable native, ARIA, and data attributes. It adds no role, live-region behavior, icon, or status variant. If content conveys a warning or other status, state that in text; color and icons alone are not meaningful communication. `className` and `style` apply to the region.

The standard appearance uses context weak surface, strong content, default outline, `numa-radius-pebbles-s`, and `numa-spacing-pebbles-l`. Content and structure remain caller-owned. No new token is required.

Limit: one neutral style; no status semantics or React Native implementation. See [content showcase](../story.html), [Foundation semantic colors](../../../docs/foundation/semantic-colors.md), [spacing and radius](../../../docs/foundation/semantic-spacing-radius.md), and [Callout tests](Callout.test.tsx).
