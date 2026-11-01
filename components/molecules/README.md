# Molecules

Molecules compose existing atoms into reusable content patterns.

- [Text Compositor](text-compositor/README.md) combines a title and optional
  description with logical alignment and token-based spacing.
- [Content Compositor](content-compositor/README.md) composes leading, main,
  trailing, and footer content inside one Tile content slot.
- [Page](page/README.md) applies the semantic page background without imposing
  layout or child-component requirements.
- [Container](container/README.md) is the first semantic surface and
  inline-size query boundary in a Page composition, with inherited sizing.
- [Card](card/README.md) groups cohesive content, with one optional nested
  Card for child content.
- [Tile](tile/README.md) is a single-slot surface for static content or one
  native link/button action, with independent semantic surface and parametric
  sizing behavior.

Open the [live molecule previews](story.html) with
`npm run story:molecules`. The page exercises the supported component options
using the actual implementations.
The [Tile parametric sizing demo](../../demos/tile-parametric.html) includes
interactive sizing controls.
