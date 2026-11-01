# Container-query responsiveness

Reusable React Web components should adapt to the inline size they receive,
not assume that the viewport determines their layout. Container queries let
the same component work in a narrow card, a page container, or a full-width
region without viewport-specific coupling.

## Shared query containers

- `Container` establishes the named inline-size query container `numa-sizing`.
- `ContentCompositor` establishes `numa-content` and stacks a horizontal
  leading/main/trailing row when it is at most `28rem` wide.
- An explicitly vertical `ContentCompositor` remains vertical at every size.

Use the nearest component-owned query container for local layout changes. Use
`numa-sizing` for descendants whose behavior is intentionally relative to
that region's width. Tile uses this boundary to select compact, relaxed, or
spacious sizing only when Container's `mode` is omitted. An explicit mode is
not overridden by width. Container itself cannot be selected by a query on
its own inline size, so a `ResizeObserver` selects the automatic progression
mode and updates Container and descendant Tile dimensions together. CSS
container queries remain a fallback for Tile dimensions when
`ResizeObserver` is unavailable. Container starts the Tile nesting context at
the middle role, with the nested inner Tile as the final level.

## Scope and limits

This is the React Web implementation. The repository does not include a React
Native adapter or generated styles.
The story pages are standalone demonstrations and may use viewport media
queries for their own page framing; reusable component behavior belongs in
component styles and should use container queries.
