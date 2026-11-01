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
- [Architecture decision records](../decisions/README.md) — current and
  superseded rationale for Foundation definitions and their integrations.

## Related automated checks

- [Typography runtime checks](../../components/atoms/text/Text.runtime.test.tsx)
  cover the Text integration and tracking resolver.
- [Semantic color checks](../../foundation/colors/semantic-color-tokens.foundation.test.ts)
  validate aliases, scopes, contrast, and disabled mappings.
- [Spacing/radius token checks](../../foundation/semantic-spacing-radius-tokens.foundation.test.ts)
  validate the documented aliases; [dimension resolver checks](../../foundation/semantic-dimensions.foundation.test.ts)
  verify the React Web pixel adapter.
- [Parametric sizing algorithm checks](../../foundation/parametric-sizing.algorithm.test.ts)
  exercise the shared harmonic scale.

## Current scope

The repository contains primitive color/numeric/percentage data and shared
typography, semantic color, spacing, and radius collections. Text's typography
scale consumes Foundation values; its Button-label utility is component-local.
Page consumes the semantic page background; Tile consumes generated
dimensions and contained surfaces in React Web; Text Compositor uses semantic
spacing. Container provides sizing only. Tokens remain
source-only without generated outputs.
React Native token outputs and component support remain out of scope and are
not claimed.
