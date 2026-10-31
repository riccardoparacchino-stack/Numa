# Molecules

Molecules compose existing atoms into reusable content patterns.

- [Text Compositor](text-compositor/README.md) combines a title and optional
  description with logical alignment and token-based spacing.
- [Content Compositor](content-compositor/README.md) composes leading, main,
  trailing, and footer content inside one Tile content slot.
- [Container](container/README.md) is the page-level first surface layer and
  can hold fieldsets and other compositions.
- [Card](card/README.md) groups cohesive content inside a Container, with one
  optional nested Card for child content.
- [Tile](tile/README.md) is a single-slot surface for static content or one
  native link/button action, with `s`, `m`, and `l` size variants. Prefer
  Container and Card when those semantic surface roles apply.

Open the [live molecule previews](story.html) with
`npm run story:molecules`. The page exercises the supported component options
using the actual implementations.
