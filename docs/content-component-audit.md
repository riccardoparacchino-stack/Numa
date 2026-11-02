# Content pattern audit

This audit records the live examples present before the content atoms were
added. `components/showcase.html` and `docs/README.md` were referenced in the
implementation brief but did not exist in the repository.

| Page or file | Observed pattern | Current HTML or styling | Existing Numa component or token | Real gap | Proposed coverage |
|---|---|---|---|---|---|
| `components/atoms/text/story.tsx` | In-page navigation, inline code, callout | `<a>` via `Text as="a"`; local `Code` wrapper; local `<aside className="callout">` | `Text`; semantic action/content/focus colors | Reusable link behavior and code/callout styling are story-local | `Link`, `Code`, `Callout` |
| `components/atoms/button/story.tsx` | Navigation to sections and inline API references | Native anchors, code-like text | `Text`, `Button` | Anchors have no reusable link focus/color treatment; no code atom | `Link`, `Code` |
| `components/molecules/story.tsx` | Usage guidance and grouped content | Native `<ul>/<li>`; story CSS | `Text`, `Stack` is not present; spacing tokens are available | List semantics are correct, but document-list rhythm is repeated and local | `List`, `ListItem` |
| `docs/foundation/color-tokens.html` | Token reference catalog | Native `<table>`, headings, code labels | Semantic color tokens | Native table structure is correct; reusable table readability/responsive behavior is absent | `Table`, `Code` |
| `docs/foundation/*.md` | Token inventories and definitions | Markdown tables, inline and fenced code, headings/lists | Foundation Typography, semantic color/spacing/radius | Static Markdown remains appropriate; React content primitives can express equivalent live showcases | `Table`, `Code`, `CodeBlock`, `List` |
| `demos/tile-parametric.tsx` | Form instructions and explanatory prose | Native `<form>`, `<label>`, `<select>`, `<p>` | `Page`, `Container`, `Tile`; no `Stack` component | Form and page structure are appropriately native; no repeated document-specific visual primitive found | No new component required for form structure |
| `components/showcase.html` | Expected global showcase index | Missing | `components/README.md` is the existing catalog | No HTML showcase landing page exists | Add a small links-only landing page |
| `docs/README.md` | Expected docs index | Missing | `docs/foundation/README.md` indexes Foundation | General docs entry point is absent | Add docs index including this audit |

## Decision

The repeated patterns support five Atom-level APIs: a single native `Link`; a
native `List` with an explicit `ul`/`ol` type plus `ListItem`; inline `Code`
and preformatted `CodeBlock`; one neutral `Callout`; and a responsive wrapper
around caller-authored native table sections and cells. `main`, `section`,
`nav`, headings, forms, and table row/header/cell elements remain the
composition's structural choices. No new Foundation token is needed: existing
semantic content, surface, outline, focus, spacing, and radius definitions
cover these uses.
