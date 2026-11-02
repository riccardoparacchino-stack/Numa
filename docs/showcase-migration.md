# Showcase migration

The component previews use `showcase.tsx`, `showcase.css`, and
`showcase.html` beside each component. `components/showcase.html` is the live
index linking to the component previews.

The Text and Button stories now use `Page` for the shared page surface and
font context. Their palette aliases and token resolver copies were removed;
the CSS consumes the semantic variables provided by Page. Repeated showcase
spacing resolves through the shared local
[showcase Foundation helper](../components/showcase-foundation.ts).
Reusable specimens use `Card`, `Link`, `Code`, `CodeBlock`, `Callout`, and
`Table` where their semantics and supported APIs fit. Native `header`, `nav`,
`main`, `section`, `form`, headings, table sections/cells, and `aside` remain
the document structure.

The Molecules showcase renders Page, Container, Stack, Card, Tile,
TextCompositor, and ContentCompositor. It includes five TextCompositor
examples with different typography, alignment, and semantic wrappers, plus
examples of List, Callout, Link, CodeBlock, and Table. Some specimen groups
keep plain page-local grid layout because wrapping them in Card would change
the Tile nesting or Card-depth context they are meant to demonstrate.

The showcase uses Stack for shared directional layouts and page-local CSS grids
for specimen collections. `TextCompositor.titleTextProps` retains the Text
component's documented type constraints; the showcase keeps semantic heading
wrappers independent of typography without broadening that public API.
