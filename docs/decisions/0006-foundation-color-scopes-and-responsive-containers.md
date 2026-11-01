# ADR 0006: Foundation Color Scopes and Responsive Containers

- **Date:** 2026-11-01
- **Status:** Accepted

## Context

The initial semantic color collection used text/border naming that did not
make scope explicit, included ordinal action terms, and defined state tokens
that supported no component. Reusable components also had no shared
container-query convention; responsive CSS was limited to viewport-based story
layouts.

## Decision

- Keep semantic color tokens in the source-only DTCG JSON collection and alias
  existing primitive colors or percentage values.
- Name color roles by scope: `background`, `surface`, `content`, and `outline`.
  Use `context` for environmental roles, `interactive` for control feedback,
  and `accent` for non-interactive decoration. Do not use `primary` or
  `secondary` in color token names.
- Use `action`, `strong`, `weak`, `subtle`, `default`, and status modifiers to
  communicate meaning. Keep interactive state tokens only for implemented
  action, subtle, and ghost feedback. Add selected-state roles only with a
  documented consumer.
- Add teal decorative accent content and success, warning, error, and info
  status content colors. Status color is not sufficient as the only signal.
- Keep light mappings and existing primitives; do not generate output, claim
  theme switching, or add component-specific tokens.
- Make Container a named inline-size query container (`numa-sizing`) and let
  ContentCompositor adapt against its own inline size (`numa-content`). Keep
  responsive component behavior in component styles, not viewport logic.

## Consequences

- Button variants are named `action`, `outlined`, `subtle`, and `ghost`, in
  alignment with the token roles.
- Container queries permit components to respond consistently when reused in
  regions narrower or wider than the viewport.
- The project remains React Web with source-token resolution. Native adapters,
  generated styles, dark mappings, and automatic themes are still unsupported.
- Semantic token tests enforce primitive aliases, explicit scopes, contrast,
  status coverage, and the reduced role vocabulary.

## Related documentation and implementation

- [Foundation Semantic Colors](../foundation/semantic-colors.md)
- [Container-query responsiveness](../foundation/container-queries.md)
- [`tokens/semantic/color.json`](../../tokens/semantic/color.json)
- [`foundation/colors/semantic-color-tokens.test.ts`](../../foundation/colors/semantic-color-tokens.test.ts)
