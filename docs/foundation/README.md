# Foundation

Foundation documentation describes the repository's shared design definitions
and their consumers.

## Documents

- [Typography](typography.md) — Foundation typography token values, Text
  integration, and known platform limits.
- [Semantic colors](semantic-colors.md) — semantic color roles, primitive
  aliases, interactive states, contrast decisions, and implementation limits.
- [Semantic spacing and radius](semantic-spacing-radius.md) — semantic scales,
  primitive aliases, nested-surface guidance, and platform limitations.
- [Surface hierarchy](surface-hierarchy.md) — page-level Containers, Cards,
  card children, and the rationale for explicit surface roles.
- [Color token reference](color-tokens.html) — searchable HTML catalog with
  semantic colors first, primitive palettes second, and usage rules.
- [Architecture decisions](../decisions/0001-foundation-text-typography.md) —
  rationale for the initial typography collection and Text integration.
- [Semantic color decisions](../decisions/0002-foundation-semantic-colors.md) —
  rationale and trade-offs for the semantic color architecture.
- [Semantic spacing and radius decision](../decisions/0003-foundation-semantic-spacing-radius.md) —
  rationale and trade-offs for the semantic spacing and radius sources.
- [React Web dimension adapter](../decisions/0004-react-web-dimension-adapter.md) —
  rationale for resolving unitless semantic dimensions as CSS pixels.
- [Surface hierarchy](../decisions/0005-foundation-surface-hierarchy.md) —
  rationale for explicit page, card, and card-child surface roles.

## Current scope

The repository contains primitive color/numeric/percentage data and shared
typography, semantic color, spacing, and radius collections. The Text Atom
consumes typography; Tile and Text Compositor consume semantic spacing and
radius in React Web. Semantic colors also feed Tile's surface and interaction
styles. Tokens remain source-only without generated outputs. React Native
token outputs and component support remain out of scope and are not claimed.
