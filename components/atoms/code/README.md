# Code and CodeBlock

These React Web content atoms display literal source text without syntax highlighting, parsing, or copy controls.

```tsx
<p>Set <Code>aria-label</Code> when the visible text is insufficient.</p>
<CodeBlock aria-label="Example">{`const answer = 42;\nreturn answer;`}</CodeBlock>
```

`Code` renders native inline `<code>`. `CodeBlock` renders `<pre><code>…</code></pre>` and forwards applicable pre attributes, ARIA/data attributes, `className`, and `style` to `<pre>`. The content is passed through unchanged, preserving whitespace and literal characters. Avoid embedding block markup in `Code` or non-code content in `CodeBlock`.

Both use context strong content and surface strong colors, pebble radius, and semantic pebble/brick spacing. `CodeBlock` preserves whitespace and scrolls horizontally within its own maximum width, preventing long lines from widening the page. `className` and `style` customize the rendered code/pre node; wrappers remain component-owned.

Limit: no syntax highlighting, line numbering, copy button, or React Native support. See [content showcase](../story.html), [Foundation colors](../../../docs/foundation/semantic-colors.md), [spacing and radius](../../../docs/foundation/semantic-spacing-radius.md), and [Code tests](Code.test.tsx).
