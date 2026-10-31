# Atoms

Atoms are the smallest reusable UI components in Numa. Component implementations
and their APIs belong in the corresponding component folder; this index links to
the component documentation.

## Text

[Text](text/README.md) is the React Web typography atom. It applies the
`label`, `body`, `title`, `headline`, and `display` visual variants with
variant-constrained sizes, while leaving HTML semantics to the caller. Its
typography values come from [Foundation Typography](../../docs/foundation/typography.md);
the component maps token names to each supported variant/size pair. Open the
[interactive Text story](text/story.html) with `npm run story` to preview
variants and the scale using the actual component and Foundation tokens.
