---
name: numa-foundation
description: Use when working on Numa token data, typography generation, design-system architecture, or repository tooling; consults the current implementation and Foundation docs before proposing changes.
---

# Numa Foundation

## Purpose

Keep agent work aligned with Numa's actual token architecture and distinguish implemented behavior from planned platform work.

## When to use

Use this skill for changes or analysis involving Numa's tokens, primitives, typography, generation scripts, design-system decisions, or platform token strategy.

## Numa constraints

- Repository JSON is the source of truth; design tools are authoring and visualization environments, not independent authorities.
- Keep canonical token definitions platform-independent. Web and React Native transforms are planned, not currently implemented.
- Inspect the relevant implementation and generated outputs before recommending or changing behavior.
- Preserve existing namespaces, values, and categories. Do not invent token categories, semantic tokens, or component tokens.
- Do not add dependencies or modify generation behavior without a clear, requested need.
- Treat generated files as outputs; do not assume configuration snapshots are generator inputs.

## Workflow

1. Read the relevant [Foundation index](../../../docs/foundation/README.md), then the applicable [architecture](../../../docs/foundation/architecture.md), [token](../../../docs/foundation/tokens.md), [primitive](../../../docs/foundation/primitives.md), [typography](../../../docs/foundation/typography.md), or [tooling](../../../docs/foundation/tooling-and-workflow.md) document.
2. Inspect the relevant source JSON, script, package scripts, and generated files. Check whether a claimed capability exists in code rather than inferring it from a filename or plan.
3. Identify source files versus generator outputs and any discrepancy between documented intent and current behavior.
4. Keep requested changes within their stated scope. If an architectural choice is missing or ambiguous, document it as unresolved rather than silently deciding it.
5. For generation-related work, review the generated diff and rounding report; do not add primitives automatically to make calculated values exact.

## Validation

- Run the narrowest applicable existing validation. For the current typography workflow, `npm test` regenerates files before running the validator; review the resulting diff.
- Verify aliases resolve to existing primitives and that generated files match the current generator when generation behavior is in scope.
- For documentation edits, verify relative links and describe implemented and planned behavior separately.
- Do not claim CSS, TypeScript, React, React Native, Figma, Penpot, or Style Dictionary integration unless the inspected implementation demonstrates it.

## References

- [Foundation documentation](../../../docs/foundation/README.md)
- [Token sources](../../../docs/foundation/tokens.md)
- [Primitive collections](../../../docs/foundation/primitives.md)
- [Typography implementation](../../../docs/foundation/typography.md)
- [Generation workflow](../../../docs/foundation/tooling-and-workflow.md)
- [Primitive JSON](../../../tokens/primitive/)
- [Typography generator](../../../scripts/generate-typography.js)
