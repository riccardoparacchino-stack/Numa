# Architecture

## Numa

Numa is a cross-platform design system whose initial intended consumers are React Web and React Native. Figma and Penpot are intended as design authoring and inspection environments. The repository is intended to be the authoritative, reviewable record of design decisions.

The repository currently contains token JSON and Node.js typography tooling only. There are no React or React Native packages, Figma or Penpot integrations, or platform application outputs in the checked-in implementation.

## Source of truth

Repository JSON files hold the token data. Figma and Penpot are intended to visualize and author design work, not to become separate authorities. Changes should be recorded and reviewed in Git. Generated files should remain distinguishable from maintained source data; see [tooling and workflow](tooling-and-workflow.md) for the current generator's outputs.

The primitive JSON files are directly maintained collections. Typography token files and the REM collection are written by the generator. The generator also writes copies of typography data under both `tokens/typography/` and `tokens/text/`; the repository does not establish which copy downstream consumers should prefer.

## Platform-independent architecture

The intended flow keeps canonical JSON independent of frontend frameworks:

```text
Canonical token JSON
        |
        v
Planned transformation layer
       / \
      v   v
 Web CSS   React Native TypeScript
```

The transformation layer and both platform outputs are planned. At present, `scripts/generate-typography.js` only derives REM and typography JSON artifacts and a rounding report. It does not generate CSS custom properties, TypeScript objects, or other platform-specific output. Style Dictionary is declared as a development dependency, but the current scripts do not import or invoke it.

## Current and planned components

| Area | Current repository state | Intended direction |
|---|---|---|
| Canonical data | JSON token files under `tokens/` | Remain the platform-independent source |
| Design tools | No integration code | Figma and Penpot as authoring/inspection environments |
| Typography generation | Node.js script; configuration is hard-coded in that script | Reproducible, clearly configurable transformation |
| Web | No web app or generated output | CSS custom properties |
| React Native | No app, bundled font assets, or generated output | TypeScript token objects and bundled platform fonts |
| Style Dictionary | Listed in `package.json`; unused by current scripts | Planned transformation layer |

These are architectural intentions, not implemented features. See [tokens](tokens.md), [typography](typography.md), and [tooling and workflow](tooling-and-workflow.md) for implementation details.
