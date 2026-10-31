# Foundation

Foundation documentation describes the repository's shared design definitions
and their consumers.

## Documents

- [Typography](typography.md) — Foundation typography token values, Text
  integration, and known platform limits.
- [Semantic colors](semantic-colors.md) — semantic color roles, primitive
  aliases, interactive states, contrast decisions, and implementation limits.
- [Color token reference](color-tokens.html) — searchable HTML catalog with
  semantic colors first, primitive palettes second, and usage rules.
- [Architecture decisions](../decisions/0001-foundation-text-typography.md) —
  rationale for the initial typography collection and Text integration.
- [Semantic color decisions](../decisions/0002-foundation-semantic-colors.md) —
  rationale and trade-offs for the semantic color architecture.

## Current scope

The repository contains primitive color/numeric/percentage data and shared
typography and semantic color collections. The Text Atom consumes typography;
semantic colors do not yet have component consumers or generated outputs.
React Native token outputs and component support remain out of scope and are
not claimed.
