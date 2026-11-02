# ADR 0001: Foundation Typography for the Text Atom

- **Date:** 2026-10-31
- **Status:** Current

## Context

Numa's existing checkout had primitive color, numeric, and percentage
collections, but no typography definitions or React component conventions. The
Text Atom specification requires a Rubik fallback stack, default weights, and
13 explicit font-size/line-height combinations. Several requested dimensions
are absent from the existing numeric primitives. Silently copying values into
component code or changing unrelated primitives would make Foundation
ownership unclear.

The specification calls the combinations “12”, while its rows enumerate 13.
It also asks for React Web semantics and makes React Native support conditional
on existing platform capability; none existed in this checkout.

## Decision

Add a DTCG-style Foundation typography collection at
`tokens/typography/text.json`, with shared named font-family, font-weight,
font-size, and line-height values. Keep variant/size composition in the Text
component's `text.variants.ts`; those mappings reference Foundation token
names and do not define new component tokens.

Implement Text for React Web only. Support all 13 explicitly listed
variant/size rows, and do not infer HTML elements or accessibility roles from
visual variants. Keep font size and line height controlled by the combination.
Optional color accepts a CSS color because no semantic color API exists.
Expose letter-spacing presets through the named Text API values `compact`,
`relaxed`, and `spacious`; resolve them to Foundation tokens at
size-specific values in `tokens/typography/text.json`. Resolve by the selected
font-size token, not line height. Default omitted `letterSpacing` to `relaxed`.
Web applies the returned `em` value as CSS; native conversion is left for a
future platform adapter.

## Alternatives considered

1. **Duplicate proposed dimensions in the component.** This would make a
   component responsible for shared typography and make future consumers
   duplicate values; rejected.
2. **Change the existing numeric primitive collection to fill the missing
   dimensions.** The current primitives are raw numeric values without
   typography meaning or units; modifying them would conflate concerns and
   broaden this component change; rejected.
3. **Implement React Native simultaneously.** No native setup, components, or
   tests exist, and the request explicitly conditions native work on inspected
   support; rejected for this implementation.
4. **Reduce the specified matrix to 12 rows.** No row was identified as
   erroneous; removing one would contradict an explicit combination; rejected
   in favor of implementing all listed pairs.
5. **Infer semantic HTML tags from variants.** Typography does not establish
   document structure and this could create incorrect heading outlines;
   rejected.
6. **Accept arbitrary CSS letter-spacing values.** This bypasses shared named
   typography options and can make tracking inconsistent; the public Text API
   instead accepts three presets resolved from Foundation. The selected
   `em` values scale with font size.
7. **Reuse one global value per preset.** Font-size-specific values are needed
   by the proposal; a global value cannot provide the requested size-aware
   optical adjustments, so Foundation stores the full matrix.
8. **Set letter spacing to relaxed by default.** Keeping the former unset
   behavior avoids a visual change, but conflicts with the newly requested
   default; the explicit relaxed default is chosen and documented as a
   behavior change.

## Consequences

- Foundation typography values are reusable and centrally named; component
  variants only reference them.
- Values absent from the primitive collection exist as rem-based typography
  definitions, not as changes to primitive tokens.
- Consumers can choose semantics with `as`, and explicit native/ARIA
  attributes are forwarded.
- Text is web-only. React Native font resolution, token transforms, bundled
  fonts, and loading are future work and are not claimed.
- The public `color` and other customization types follow React CSS types
  where applicable. Color is not token-resolved; letter spacing is constrained
  to named Foundation presets and defaults to `relaxed`.
- Compact, relaxed, and spacious tracking are now size-specific Foundation
  tokens; the matrix is an initial Rubik-oriented proposal.
- Omitted tracking now resolves to the relaxed row, changing the former
  browser-default behavior.
- React Native is not implemented or validated. A future adapter must convert
  `em × effective font size` to the platform's absolute letter-spacing unit.
- Arbitrary manual letter-spacing overrides were not supported by the earlier
  named-only API and remain outside the API; no new override prop was added.
- The chosen 13-pair interpretation resolves the discrepancy in favor of the
  complete explicit table. If the intended count was truly 12, the design
  specification should be revised.

## Related documentation and implementation

- [Text Atom](../../components/atoms/text/README.md)
- [Foundation Typography](../foundation/typography.md)
- [`tokens/typography/text.json`](../../tokens/typography/text.json)
- [`components/atoms/text/text.variants.ts`](../../components/atoms/text/text.variants.ts)
- [`components/atoms/text/Text.tsx`](../../components/atoms/text/Text.tsx)
