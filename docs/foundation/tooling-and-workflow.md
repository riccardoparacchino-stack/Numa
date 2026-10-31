# Tooling and workflow

## Dependencies and runtime

The package is CommonJS and defines two npm scripts. Node.js is required to run them.

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
| `npm test` | Runs the generator and then `scripts/validate-typography.js` |

The validator checks selected REM examples, representative typography attributes, the base-size and line-height aliases, default letter spacing, and the font URL. It is not a full DTCG conformance, schema, complete collection, or platform-output validator.

## Generation workflow

1. Treat the color, integer, and percentage JSON collections as source data.
2. The generator reads the integer collection and calculates a REM token for every integer primitive.
3. It calculates typography size, line-height, and letter-spacing values from constants in the script, resolves each to the nearest integer primitive, and writes aliases to the corresponding REM tokens.
4. It writes typography tokens, configuration snapshots, the rounding report, and a generated README.
5. Inspect the generated diff and `tokens/typography/report.json`, then review and commit intended changes through Git.

The generator writes these paths:

- `tokens/primitive/rem.json`
- `tokens/typography/config.json`
- `tokens/typography/tokens.json`
- `tokens/typography/report.json`
- `tokens/typography/README.md`
- `tokens/text/config.json`
- `tokens/text/typography.json`

The two `config.json` files and two typography token files are generated copies. The repository does not document why both directory layouts are retained or which should be consumed by future tooling.

## Build and generated output

There is no application build or platform token build command. The only configured test command also runs generation first, so it rewrites generated files before validation. `build/` and `node_modules/` are ignored by [`.gitignore`](../../.gitignore); current token outputs are written under `tokens/`, not `build/`.

No Git branching, review, or release automation is defined in the repository beyond ordinary source control. Keep changes traceable in Git and distinguish maintained JSON primitives from generated files. The planned Style Dictionary transform and CSS/TypeScript outputs are not part of this workflow.

## Limitations to keep in view

- Generator configuration is hard-coded; generated JSON configuration files are snapshots, not inputs.
- The generator produces duplicated typography files in two locations.
- The current validator covers examples rather than the full token set or design-token specification.
- No CSS, TypeScript, React Web, or React Native output is generated.
- The `style-dictionary` dependency is present but unused by existing scripts.
