# Surface hierarchy

Numa's reusable surface roles distinguish Tile nesting from layout boundaries:

`Page → Container (first surface and sizing boundary) → middle Tile → inner Tile`

## Roles

- **Page** applies the semantic page background. It does not impose layout or
  require a Container or Tile child.
- **Container** is the first surface and named inline-size query boundary. It
  uses the first Tile surface and outermost dimensions, and provides an
  explicit or width-selected density mode. Its Tile children continue with
  middle and inner surface roles.
- **Tile** is a low-level surface for grouped content, navigation, or one
  action. Outside a Container composition it may contain up to two nested
  Tiles; standalone nested surfaces alternate weak and strong semantic fills.
- **Card** names a cohesive content group, with one optional child Card. Its
  Tile nesting role determines its generated padding and radius.

## Parametric dimensions

Container and Tile padding use the shared harmonic scale generator:

`P(n) = roundToMultipleOf4(basePadding × harmonicRatioⁿ)`

The default base is 8px and the default ratio is Minor Third (1.2). Density
starts at step 0, 1, or 2 for compact, relaxed, or spacious. Container uses
the former outer Tile step; its middle and inner Tile children use the former
middle and inner Tile steps. Radius is derived from padding by
`paddingToRadius`, with a configurable multiplier. No per-mode semantic
tokens are created.

## Why roles are explicit

Container defines the outer surface role and the Tile nesting context within
that composition. Card remains an explicit cohesive content group, while
Tile remains available for standalone and other nested surface compositions.

The React Web `Page`, `Container`, `Tile`, and `Card` components implement these rules.
See
[Container](../../components/molecules/container/README.md),
[Card](../../components/molecules/card/README.md), and the
[live molecule previews](../../components/molecules/story.html). This rule
does not claim React Native behavior or generated style output.
