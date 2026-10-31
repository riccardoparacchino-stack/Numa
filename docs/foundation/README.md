# Numa Foundation

This documentation describes the repository's token foundations, current tooling, and established design-system constraints. It records the implementation as it exists today and labels future architecture separately.

## Documents

- [Architecture](architecture.md) — source of truth, platform direction, and current versus planned data flow.
- [Principles](principles.md) — design-system and maintenance constraints.
- [Tokens](tokens.md) — token structure, names, references, and extension rules.
- [Primitives](primitives.md) — actual color, integer, REM, and percentage collections.
- [Typography](typography.md) — typography tokens, scale generation, quantization, and platform considerations.
- [Tooling and workflow](tooling-and-workflow.md) — dependencies, scripts, generated files, and limitations.

## Implementation status

The repository currently contains DTCG-style JSON primitive and typography tokens, plus a Node.js script that derives REM and typography files from hard-coded configuration. It does not contain React or React Native implementations, platform-specific token outputs, or an active Style Dictionary transformation pipeline. The platform architecture described here is therefore a direction, not a claim about shipped functionality.

Treat JSON token files as the source data, and consult the [tooling guide](tooling-and-workflow.md) before regenerating outputs: the generator rewrites several tracked files.
