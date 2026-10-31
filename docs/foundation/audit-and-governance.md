# Foundation audit and governance

## Audit snapshot

This audit records the repository implementation after adding validation infrastructure. It describes current files and workflows, not the planned platform transform.

| Area | Status | Evidence and limitation |
|---|---|---|
| Primitive collections | Implemented | Color, integer, generated REM, and percentage JSON collections exist under [`tokens/primitive/`](../../tokens/primitive/). |
| Namespaces and token values | Implemented | Flat DTCG-style token objects use `$type` and `$value`; namespace/value conventions are checked by `validate-foundation.js`. No claim of full DTCG conformance is made. |
| Typography tokens | Implemented | Rubik, weights 100-900, style, decoration, transform, alignment, and generated dimension tokens are present. |
| Typography generation | Implemented | Node script calculates the scale, quantizes to existing integer primitives, emits aliases and a rounding report. The generated default values retain the established output. |
| Generic dimensional scales | Implemented | `scripts/dimensional-scale.js` generates paired integer/REM values; the gap scale is its first independent consumer. |
| Gap collection | Implemented with proposed defaults | Configurable base and multipliers produce separate matching integer and REM maps. The default sequence remains a proposal pending design review. |
| Scale configuration | Implemented with limitation | `tokens/typography/config.json` is now the generator input. The output mirror at `tokens/text/config.json` is generated. |
| Alias and primitive validation | Implemented | The validator checks structure, naming, types, value conventions, aliases, cycles, and generated artifacts. |
| Automated tests | Implemented | Node's built-in test runner covers scale positioning, custom parameters, quantization, alias errors, determinism, and source primitive integrity. |
| Platform output | Planned | No CSS custom properties, TypeScript outputs, React Web/Native integration, or platform transforms exist. |
| Style Dictionary | Planned/unused | Dependency remains declared but is not called by current scripts. |
| DTCG compliance | Unverified | Current flat format is DTCG-style; the project does not run the official format/schema compliance validation. |

### Risks and limitations

- The generator maintains two typography output locations. Validation ensures they remain equivalent, but the repository still does not declare which path future consumers should use.
- Quantization can collapse adjacent scale steps or create large rounding deltas. The report exposes these differences; it does not automatically add primitives.
- The Rubik token lists weights 100-900, while the stored Google Fonts URL requests 300-900. No platform font loading or bundled React Native assets exist.
- The local validator checks the conventions currently used by these flat token files. It is not a general-purpose DTCG validator.

## Lightweight governance

### Naming and new primitives

- Follow the existing namespace and value formats in [tokens](tokens.md) and [primitives](primitives.md).
- Add a primitive only when an explicit design need requires it. Confirm the value, naming, type, and impact on generated typography before changing the source JSON.
- Do not add semantic or component token categories as part of Foundation maintenance.

### Changes and impact

- Edit maintained source JSON, not generated outputs. For typography scale changes, edit `tokens/typography/config.json`.
- Run `npm test` and inspect the generated artifact diff and `tokens/typography/report.json`.
- Review effects on aliases, token consumers, output mirrors, and scale quantization. Preserve existing token names unless a reviewed migration requires a change.
- Record decisions in Git with a focused change and review the diff before merging.

### Deprecation and removal

- Do not delete a token merely because it is unused in the current repository; downstream consumers may exist outside it.
- When a token needs replacement, document the old name, replacement, reason, and migration impact in the change or release notes. Keep the old token available during an explicitly agreed migration period.
- Remove a deprecated token only after affected consumers have migrated and the removal is reviewed as a breaking change. The repository has no formal deprecation marker or release policy yet; decide one only when a consumer workflow requires it.

### Versioning and review

- Git history is the change record; token modifications should be reviewed through the repository's normal pull request process.
- Adding a new token without changing existing names or meanings is generally non-breaking, but may still affect output size and downstream assumptions.
- Changing or removing a name, value meaning, type, alias target, or generation behavior can be breaking. Describe the affected consumers and migration path in the pull request.
- No token package release/versioning scheme is configured. Do not imply SemVer guarantees until a published consumer contract exists.

## Readiness assessment

**Ready with documented limitations** for introducing a separately designed Semantic Token layer: the existing Foundation values and generated relationships now have automated checks, and changes have a lightweight review process. This does not certify DTCG compliance or establish platform outputs, token package versioning, or the long-term typography output location. Resolve those questions as they become relevant to integration; do not treat them as implemented capabilities.
