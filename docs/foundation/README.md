# Numa Foundation

This documentation describes the repository's token foundations, current tooling, and established design-system constraints. It records the implementation as it exists today and labels future architecture separately.

## Documents

- [Architecture](architecture.md) — source of truth, platform direction, and current versus planned data flow.
- [Principles](principles.md) — design-system and maintenance constraints.
- [Tokens](tokens.md) — token structure, names, references, and extension rules.
- [Primitives](primitives.md) — actual color, integer, REM, and percentage collections.
- [Typography](typography.md) — typography tokens, scale generation, quantization, and platform considerations.
- [Tooling and workflow](tooling-and-workflow.md) — dependencies, scripts, generated files, and limitations.
- [Audit and governance](audit-and-governance.md) — current readiness, known risks, and lightweight change governance.
- [Dimensional scale generator](scale-generator.md) — reusable scale API and integer/REM conversion rules.
- [Gap primitives](gap.md) — gap configuration, proposed multiplier sequence, outputs, and workflow.

## Implementation status

The repository currently contains DTCG-style JSON primitive and typography tokens, a configurable Node.js typography generator, and Foundation validation tests. It does not contain React or React Native implementations, platform-specific token outputs, or an active Style Dictionary transformation pipeline. The platform architecture described here is therefore a direction, not a claim about shipped functionality.

Treat primitive JSON plus the independent typography and gap configuration files as source data, and consult the [tooling guide](tooling-and-workflow.md) before regenerating outputs: generation rewrites tracked artifacts.
