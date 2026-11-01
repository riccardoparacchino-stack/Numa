# Foundation

Foundation documentation describes the repository's shared design definitions
and their consumers.

## Documents

- [Typography](typography.md) — Foundation typography token values, Text
  integration, and known platform limits.
- [Semantic colors](semantic-colors.md) — semantic color roles, primitive
  aliases, interactive states, contrast decisions, and implementation limits.
- [Semantic color token structure](semantic-token-structure.md) — a diagram of
  collections, scopes, roles, modifiers, and naming rules.
- [Semantic spacing and radius](semantic-spacing-radius.md) — semantic scales,
  primitive aliases, nested-surface guidance, and platform limitations.
- [Container-query responsiveness](container-queries.md) — shared React Web
  query containers and component-local responsive behavior.
- [Surface hierarchy](surface-hierarchy.md) — generic sizing boundaries,
  nested Tile roles, and Cards as content groups.
- [Color token reference](color-tokens.html) — searchable HTML catalog with
  semantic colors first, primitive palettes second, and usage rules.
- [Architecture decisions](../decisions/0001-foundation-text-typography.md) —
  rationale for the initial typography collection and Text integration.
- [Semantic color decisions](../decisions/0002-foundation-semantic-colors.md) —
  record of the initial semantic color architecture.
- [Foundation color scopes and responsive containers](../decisions/0006-foundation-color-scopes-and-responsive-containers.md) —
  rationale for current color roles and container-query behavior.
- [Inherited disabled mode](../decisions/0007-inherited-disabled-mode.md) —
  rationale for shared disabled color scopes and parent-to-child propagation.
- [Parametric Tile sizing](../decisions/0008-parametric-tile-sizing.md) —
  rationale for harmonic sizing and generic responsive Containers.
- [Semantic spacing and radius decision](../decisions/0003-foundation-semantic-spacing-radius.md) —
  rationale and trade-offs for the semantic spacing and radius sources.
- [React Web dimension adapter](../decisions/0004-react-web-dimension-adapter.md) —
  rationale for resolving unitless semantic dimensions as CSS pixels.
- [Surface hierarchy](../decisions/0005-foundation-surface-hierarchy.md) —
  rationale for explicit page, card, and card-child surface roles.

## Current scope

The repository contains primitive color/numeric/percentage data and shared
typography, semantic color, spacing, and radius collections. The Text Atom
consumes typography; Page consumes the semantic page background; Tile consumes
generated dimensions and contained surfaces in React Web; Text Compositor
uses semantic spacing. Container provides sizing only. Tokens remain
source-only without generated outputs.
React Native token outputs and component support remain out of scope and are
not claimed.
