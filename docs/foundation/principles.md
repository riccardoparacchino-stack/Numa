# Principles

## Source and traceability

- Keep repository JSON as the authoritative token record; design tools are not independent sources of truth.
- Record design changes in Git so they can be reviewed and traced.
- Keep maintained source files distinguishable from generated artifacts.
- Describe the implementation that exists; label plans and unresolved decisions instead of implying they have shipped.

## Design-system architecture

- Prefer primitive-first, reusable tokens that remain independent of React Web and React Native.
- Use references when one token is derived from another; avoid copying values that can be referenced.
- Keep platform-specific transforms and output separate from canonical token data.
- Do not add semantic or component token categories unless they already exist or are explicitly requested.

## Maintainability

- Prefer simple, explicit, reproducible workflows.
- Avoid manually maintaining duplicate generated values.
- Keep generation configuration separate from generated output. Typography configuration is maintained in `tokens/typography/config.json`; generated files include a mirror at `tokens/text/config.json`.
- Avoid new dependencies, frameworks, abstractions, and generation steps without a clear need.
- Preserve existing naming and values unless a requested, reviewed change authorizes otherwise.

For current behavior, consult [architecture](architecture.md), [tokens](tokens.md), and [tooling and workflow](tooling-and-workflow.md).
