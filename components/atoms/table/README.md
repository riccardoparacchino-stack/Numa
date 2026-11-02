# Table

`Table` applies minimal document-table styling to a native HTML table. It is an Atom because it styles a native content primitive while leaving its section and cell structure to the caller.

```tsx
<Table>
  <caption>Token consumers</caption>
  <thead><tr><th scope="col">Token</th><th scope="col">Component</th></tr></thead>
  <tbody><tr><th scope="row">Typography</th><td><Code>Text</Code></td></tr></tbody>
</Table>
```

The caller supplies native `caption`, `thead`, `tbody`, `tr`, `th`, and `td` as appropriate; `Table` never simulates a grid or injects roles. Header relationships (`scope`, `headers`) remain under caller control. Native table, ARIA, and data attributes, `className`, and `style` are forwarded to `<table>`. Cells can contain React/Numa content.

The wrapper allows horizontal scrolling on narrow viewports. The table fills available width, collapses borders, aligns content at the start, and styles captions, header cells, and body cells with semantic surface/content/outline colors and spacing tokens. The wrapper itself is component-owned; `style` customizes the table.

Limit: no sorting, selection, pagination, or data-grid behavior. See [content showcase](../story.html), [Foundation semantic colors](../../../docs/foundation/semantic-colors.md), [spacing and radius](../../../docs/foundation/semantic-spacing-radius.md), and [Table tests](Table.test.tsx).
