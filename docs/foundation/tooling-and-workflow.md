# Tooling and workflow

## Dependencies and runtime

The package is CommonJS and defines four npm scripts. Node.js with the built-in test runner is required to run them.

| Dependency or tool | Purpose and current use |
|---|---|
| Node.js | Executes the repository's generation and validation scripts |
| `style-dictionary` (`^4.4.0`) | Declared as a development dependency; not imported or invoked by the current scripts |
| npm | Runs the package scripts and installs declared dependencies |

No Tailwind, React, React Native, or font download is part of the current token generation path.

## Commands

| Command | Behavior |
|---|---|
| `npm run generate:tokens` | Runs `scripts/generate-typography.js` |
| `npm run generate:gap` | Runs `scripts/generate-gap.js` using `tokens/gap/config.json` |
| `npm run validate:tokens` | Validates token collections, aliases, and generated outputs without writing files |
| `npm test` | Runs Foundation validation followed by the built-in Node test suite |

The validator checks JSON integrity, duplicate object keys and token names, collection naming and value conventions, token types, required typography attributes, alias targets and type compatibility, circular references, and generated output freshness, including the paired gap outputs. It is not a full DTCG conformance or platform-output validator.

## Generation workflow

1. Treat color, integer, percentage, and the independent typography and gap configuration files as source data.
2. The generator reads the integer collection and calculates a REM token for every integer primitive.
3. It calculates typography size, line-height, and letter-spacing values from `tokens/typography/config.json`, resolves each to the nearest integer primitive, and writes aliases to the corresponding REM tokens.
4. It writes typography tokens, a configuration mirror, the rounding report, and a generated README.
5. Inspect the generated diff and `tokens/typography/report.json`, then review and commit intended changes through Git.

The generator writes these paths:

- `tokens/primitive/rem.json`
- `tokens/typography/tokens.json`
- `tokens/typography/report.json`
- `tokens/typography/README.md`
- `tokens/text/config.json`
- `tokens/text/typography.json`

`tokens/typography/config.json` is maintained input; `tokens/text/config.json` is a generated snapshot. The two typography token files are generated copies. The repository does not document why both output layouts are retained or which should be consumed by future tooling.

The gap generator separately reads `tokens/gap/config.json` and writes `tokens/gap/integer.json` and `tokens/gap/rem.json`; see [the gap guide](gap.md).

## Build and generated output

There is no application build or platform token build command. `npm test` validates committed outputs and runs tests without regenerating the working tree. `npm run generate:tokens` is the explicit generation command and rewrites generated artifacts under `tokens/`. `build/` and `node_modules/` are ignored by [`.gitignore`](../../.gitignore).

No Git branching, review, or release automation is defined in the repository beyond ordinary source control. Keep changes traceable in Git and distinguish maintained JSON primitives from generated files. The planned Style Dictionary transform and CSS/TypeScript outputs are not part of this workflow.

## Limitations to keep in view

- The typography input config is specific to the generator; `tokens/text/config.json` is a snapshot, not an input.
- The generator produces duplicated typography files in two locations.
- The validator covers repository-specific conventions, not the complete DTCG specification.
- No CSS, TypeScript, React Web, or React Native output is generated.
- The `style-dictionary` dependency is present but unused by existing scripts.
