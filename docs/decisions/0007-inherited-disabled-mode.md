# ADR 0007: Inherited Disabled Mode

- **Date:** 2026-11-01
- **Status:** Current

## Context

Disabled color treatment was previously duplicated across individual
interactive surface roles. This made a disabled parent unable to coordinate
the colors of nested controls or token-based custom content, and allowed
similar roles to drift.

## Decision

- Model disabled appearance with exactly one semantic color alias per scope:
  `interactive-background-disabled`, `interactive-surface-disabled`,
  `interactive-content-disabled`, and `interactive-outline-disabled`.
- Back those aliases with gray-100, gray-200, gray-500, and gray-300 primitive
  colors, respectively.
- Resolve each semantic color into a CSS custom property at a Numa component
  boundary. In disabled mode, map every token in a scope to its shared
  disabled alias. Preserve focus outline tokens.
- Propagate disabled mode through a React context. Component APIs with native
  disabled behavior combine their own, loading, and inherited states; an
  inherited state cannot be canceled by a child `disabled={false}`.
- Allow static Tiles to establish disabled mode for their subtree. Button Tiles
  continue to use native disabled behavior. Links do not receive a synthetic
  disabled API.
- Custom content inherits visual treatment only when it consumes semantic CSS
  variables; disabled mode does not make arbitrary elements inert or accessible
  as disabled controls.

## Consequences

- Role-specific disabled surface tokens are removed; the four shared aliases
  are the only disabled color tokens.
- Nested Numa Buttons inherit native disabled behavior from static disabled
  Tiles; token-based content inherits mapped scope colors.
- Focus remains discernible where focus is possible. Disabled outline color is
  intentionally subdued and is not used as the sole disabled cue.
- Consumers can still provide raw CSS colors. Such values are outside the
  semantic disabled-mode contract.

## Related documentation and implementation

- [Semantic colors](../foundation/semantic-colors.md)
- [Semantic token structure](../foundation/semantic-token-structure.md)
- [`foundation/colors/semantic-color-style.ts`](../../foundation/colors/semantic-color-style.ts)
- [`components/disabled-context.ts`](../../components/disabled-context.ts)
- [`tokens/semantic/color.json`](../../tokens/semantic/color.json)
