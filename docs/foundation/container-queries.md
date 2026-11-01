# Container-query responsiveness

Reusable React Web components should adapt to the inline size they receive,
not assume that the viewport determines their layout. Container queries let
the same component work in a narrow card, a page container, or a full-width
region without viewport-specific coupling.

## Shared query containers

- `Container` establishes the named inline-size query container `numa-page`.
- `ContentCompositor` establishes `numa-content` and stacks a horizontal
  leading/main/trailing row when it is at most `28rem` wide.
- An explicitly vertical `ContentCompositor` remains vertical at every size.

Use the nearest component-owned query container for local layout changes. Use
`numa-page` only for descendants whose behavior is intentionally relative to
the page-surface width. Keep structural layout in the component stylesheet;
do not use JavaScript viewport measurements or duplicate breakpoints.

## Scope and limits

This is the React Web implementation. Container sizes are evaluated by CSS;
the repository does not include a React Native adapter or generated styles.
The story pages are standalone demonstrations and may use viewport media
queries for their own page framing; reusable component behavior belongs in
component styles and should use container queries.
