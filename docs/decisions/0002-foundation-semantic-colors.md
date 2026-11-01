# ADR 0002: Foundation Semantic Colors

- **Date:** 2026-10-31
- **Status:** Accepted

## Context

The repository has DTCG-style primitive color and percentage collections but
no semantic color tokens, color build configuration, or generated color
outputs. The semantic color proposal initially called its non-interactive
collection `inherit`, alongside `interactive`, and requires semantic values to alias existing primitives. It
leaves theme strategy, selected/disabled behavior, focus, ghost opacity, state
precedence, and primitive mappings unresolved.

The repository's color tokens are flat `numa-sys-col-*` keys. Percentage
primitives are unitless numbers, and no existing token transform composes a
color with an opacity reference. The palette also has no pure black or white.

## Decision

Add a DTCG-style semantic color source at `tokens/semantic/color.json`, using
flat `numa-color-context-*` and `numa-color-interactive-*` names and aliases to
the current primitive collections. Rename the proposal's `inherit` collection
to `context`: the new name denotes non-interactive environmental colors
without suggesting CSS inheritance. Do not add a component-specific category,
modify the primitive palette, or generate output files.

Ship light mappings only. Keep semantic names theme-neutral so future theme
mappings can use the same roles, but do not claim a dark theme or theme
switching.

Use persistent selected treatments that differ from default, even where they
reuse another state's color: primary selected uses `indigo-700`, subtle
selected uses `slate-300`, and ghost selected uses a 5% overlay. While a
selected control is pressed, active temporarily overrides its selected
treatment and selection returns on release. Disabled uses dedicated neutral
treatments and takes precedence over hover, active, and selected.

Model ghost feedback as a near-black (`neutral-950`) color alias paired with
opacity aliases to existing percentage primitives: 0% default, 5% hover, 10%
active, 5% selected, and 0% disabled. This avoids unsupported composite color
syntax and literal RGBA values; token consumers must combine the pair.

Keep focus visible when a disabled control can receive focus. Contrast testing
shows one focus color cannot remain visible against both an enabled indigo
primary surface and its light surroundings. Use `indigo-700` on light/disabled
surfaces and a two-color enabled-primary ring: `gray-50` inside and `slate-950`
outside.

Map the context environment to the existing slate ramp: sunken `slate-300`,
default `slate-50`, level 1 `slate-100`, and level 2 `slate-200`. The available
light shades make surface differences subtle; border roles reinforce the
hierarchy, and shadows are not the only cue. Context text uses `slate-950`,
`slate-700`, and `slate-600`. Interactive colors use the indigo and slate
ramps documented in [Semantic colors](../foundation/semantic-colors.md).

Use WCAG AA normal-text contrast of 4.5:1 and non-text focus contrast of 3:1
as validation thresholds. Disabled text is exempt from the normal-text
threshold. Use gray-200 for disabled surfaces, gray-500 for disabled text, and
the subtler gray-300 for disabled outlines. Disabled outlines are decorative,
not a required non-text contrast cue. Add tests for primitive alias validity,
ghost opacity aliases, and the documented enabled text/focus combinations.

## Alternatives considered

1. **Generate color files immediately.** There is no configured token build or
   generated-output convention, and ghost color/opacity composition is not
   supported; generating output would imply an unverified consumer contract.
   Keep the DTCG source only.
2. **Encode ghost states as literal RGBA colors.** This would break the
   primitive alias rule and hardcode opacity; rejected in favor of a paired
   color and percentage alias.
3. **Implement both themes now.** No theme infrastructure or consumer exists
   to validate dark mappings; rejected in favor of theme-neutral semantic
   names with light values only.
4. **Use one focus color for every surface.** A color visible on an indigo
   primary surface cannot also remain visible against its light surroundings;
   use a two-color ring there and a single indigo focus color on light surfaces.
5. **Add new primitive colors to make the neutral ramp more granular.** The
   user chose to keep the current palette and accept subtle surface fills,
   reinforced with borders; no primitive changes are included.

## Consequences

- Semantic color roles are centralized and consistently reference existing
  primitive color or percentage tokens.
- The source documents color intent and supported state behavior but has no
  runtime integration yet. A later token pipeline must define percentage
  conversion and color/opacity composition before component use.
- A future component must apply disabled precedence, preserve focus where
  focusability permits, and use the focus color appropriate to the rendered
  surface.
- Enabled light mappings meet the tested text/focus thresholds. Disabled text
  uses gray-500 and disabled outlines gray-300 on gray-200 disabled surfaces;
  disabled text is exempt from text contrast requirements and outlines are
  intentionally subdued. Visual validation in component compositions remains
  necessary. The current light surface steps are intentionally subtle.
- No dark theme, React Native output, generated CSS, or automatic theme
  switching is implemented.

## Related documentation and implementation

- [Foundation Semantic Colors](../foundation/semantic-colors.md)
- [`tokens/semantic/color.json`](../../tokens/semantic/color.json)
- [`foundation/colors/semantic-color-tokens.test.ts`](../../foundation/colors/semantic-color-tokens.test.ts)
