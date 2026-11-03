# Atoms

Atoms are the smallest reusable UI components in Numa. Component implementations
and their APIs belong in the corresponding component folder; this index links to
the component documentation.

| Component | Purpose | Showcase | Runtime tests |
|---|---|---|---|
| [Icon](icon/README.md) | Feather SVG icon with semantic context content color. | — | — |
| [Text](text/README.md) | React Web typography with independent visual and HTML semantics; five Foundation-backed variants plus a Button-label scale. | [Text showcase](text/showcase.html), `npm run story:text` | [Tests](text/Text.runtime.test.tsx) |
| [Button](button/README.md) | Native React Web action button styled with semantic Foundation tokens. | [Button showcase](button/showcase.html), `npm run story:button` | [Tests](button/Button.runtime.test.tsx) |

[Text](text/README.md) is the React Web typography atom. It applies the
`label`, `body`, `title`, `headline`, and `display` visual variants with
variant-constrained sizes, while leaving HTML semantics to the caller. Its
typography values come from [Foundation Typography](../../docs/foundation/typography.md);
the component maps token names to each supported variant/size pair. Open the
[interactive Text showcase](text/showcase.html) with `npm run story:text` to
preview variants and the scale using the actual component and Foundation tokens.

## Button

[Button](button/README.md) is the design-system action atom. It renders a native
`button`, applies Numa semantic colors and spacing, and supports size, variant,
icon, loading, disabled, and full-width behavior without introducing custom
styles or duplicate design tokens. Open the
[interactive Button showcase](button/showcase.html) with `npm run story:button`
to preview the actual component.

## Document content

The [content atoms showcase](story.html) demonstrates document links, lists,
code, callouts, and semantic tables using the React Web components. Run it with
`npm run story:content`.

- [Link](link/README.md) renders a native anchor with semantic link and focus styling.
- [List and ListItem](list/README.md) render native ordered/unordered lists and items.
- [Code and CodeBlock](code/README.md) render inline and preformatted code.
- [Callout](callout/README.md) provides one neutral supporting-content surface.
- [Table](table/README.md) styles a native table and keeps its wrapper scrollable.

See the [showcase index](../showcase.html) for the available component pages.
Text's shared typography definitions are documented in
[Foundation Typography](../../docs/foundation/typography.md); component APIs
remain in their local READMEs.
