# Molecules

Molecules compose existing atoms into reusable content patterns.

| Component | Documentation | Showcase coverage | Runtime tests |
|---|---|---|---|
| Text Compositor | [README](text-compositor/README.md) | [Alignment and gap examples](showcase.html#text-compositor-heading) | [Tests](text-compositor/TextCompositor.runtime.test.tsx) |
| Content Compositor | [README](content-compositor/README.md) | [Representative slot compositions](showcase.html#slots-heading) | [Tests](content-compositor/ContentCompositor.runtime.test.tsx) |
| Page | [README](page/README.md) | Used as the [showcase page shell](showcase.html) | [Tests](page/Page.runtime.test.tsx) |
| Container | [README](container/README.md) | [Sizing modes and composition](showcase.html#tile-heading) | [Tests](container/Container.runtime.test.tsx) |
| Card | [README](card/README.md) | [Nested Card composition](showcase.html#slots-heading) | [Tests](card/Card.runtime.test.tsx) |
| Tile | [README](tile/README.md) | [Static, link, and button examples](showcase.html#tile-heading) | [Tests](tile/Tile.runtime.test.tsx) |

The shared [Molecule showcase](showcase.html) is a React/Vite page that renders
the real components and Foundation tokens. It offers representative examples,
not a per-prop playground or an exhaustive API matrix. Run it with
`npm run story:molecules`; the [showcase index](../showcase.html) links all
standard pages. The [Tile parametric demo](../../demos/tile-parametric.html)
is a separate exploratory tool, not the standard component showcase.
