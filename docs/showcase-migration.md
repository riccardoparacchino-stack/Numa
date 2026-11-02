# Showcase migration

The requested `components/atoms/{text,button}/showcase.tsx` and
`components/molecules/showcase.tsx` files do not exist in this checkout. Their
live equivalents are `story.tsx` and `story.css` beside each component. The
global `components/showcase.html` is also absent; `components/README.md` is the
current static index and remains static because it only links to existing
pages and has no shared React entry point.

The Text and Button stories now use `Page` for the shared page surface and
font context. Their palette aliases and token resolver copies were removed;
the CSS consumes the semantic variables provided by Page. Repeated showcase
spacing resolves through the shared local
[showcase Foundation helper](../components/showcase-foundation.ts).
Reusable specimens use `Card`, `Link`, `Code`, `CodeBlock`, `Callout`, and
`Table` where their semantics and supported APIs fit. Native `header`, `nav`,
`main`, `section`, `form`, headings, table sections/cells, and `aside` remain
the document structure.

The Molecules story continues to render Page, Container, Card, Tile,
TextCompositor, and ContentCompositor. It now includes five TextCompositor
examples with different typography, alignment, and semantic wrappers, plus
examples of List, Callout, Link, CodeBlock, and Table. Some specimen groups
keep plain page-local grid layout because wrapping them in Card would change
the Tile nesting or Card-depth context they are meant to demonstrate.

Two repository gaps remain. There is no `Stack` component, so showcase grids
remain CSS page layout and use Foundation spacing values. Also,
`TextCompositor.titleTextProps` currently inherits the default `span` generic
from Text and TypeScript rejects non-span `as` values. The showcase demonstrates
semantic independence with native heading/region wrappers; no component API
was added in this migration.
