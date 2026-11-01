# Semantic colors

Semantic color tokens describe visual purpose and interaction, not component
names or raw appearance. Primitive colors remain the source of color values.
The semantic definitions are in
[`tokens/semantic/color.json`](../../tokens/semantic/color.json); every color
and opacity value aliases an existing primitive.

## Collections

The names use the repository's flat, `numa-`-prefixed token convention and
separate two independent collections:

- **`context`** describes non-interactive context: backgrounds, surfaces, text,
  and borders.
- **`interactive`** describes surfaces, text, and outlines for interaction.

No component-specific categories are defined. Components do not consume these
tokens through generated styles; the file remains a Foundation source rather
than a generated stylesheet. React Web Tile, Container, and Card resolve
context surface roles directly from the token source.

## Context colors

| Token | Primitive | Role |
| --- | --- | --- |
| `numa-color-context-background-sunken` | `slate-300` | Recessed environment |
| `numa-color-context-background-default` | `slate-50` | Light base environment |
| `numa-color-context-surface-level-1` | `slate-100` | First contained surface |
| `numa-color-context-surface-level-2` | `slate-200` | Nested contained surface |
| `numa-color-context-text-primary` | `slate-950` | Highest text emphasis |
| `numa-color-context-text-secondary` | `slate-700` | Supporting text |
| `numa-color-context-text-tertiary` | `slate-600` | Supplementary text |
| `numa-color-context-border-subtle` | `slate-200` | Low-emphasis boundary |
| `numa-color-context-border-default` | `slate-300` | Standard boundary |
| `numa-color-context-border-strong` | `slate-400` | High-emphasis boundary |

The available light neutral ramp yields deliberately subtle surface steps.
Border tokens reinforce their separation; shadows are not the only signal.

### Weak/strong surface alternation

Use `surface-level-1` (`slate-100`) as the weak surface and
`surface-level-2` (`slate-200`) as the strong surface. Alternate contained
layers rather than repeating one fill: a Container on the page background
uses the weak surface, its Card uses the strong surface, and a nested Card
child returns to the weak surface. A further contained layer returns to
strong. This provides a subtle but explicit hierarchy against the page
background; keep boundaries visible with the semantic border tokens rather
than relying on shadow alone.

The React Web `Container`, `Card`, and nested `Tile` implementations apply
this alternation. Interactive hover/active/disabled states remain governed by
the interactive surface tokens.

## Interactive colors

| Role | Default | Hover | Active | Selected | Disabled |
| --- | --- | --- | --- | --- | --- |
| `surface.primary` | `indigo-600` | `indigo-700` | `indigo-800` | `indigo-700` | `gray-200` |
| `surface.subtle` | `slate-200` | `slate-300` | `slate-400` | `slate-300` | `gray-200` |
| `surface.ghost` | transparent | near-black at 5% | near-black at 10% | near-black at 5% | no overlay |

The primary selected treatment reuses hover's color, and subtle selected
reuses active's color. Ghost selected reuses hover's 5% overlay. Each remains
visually distinct from its family default when the pointer is absent.

Ghost overlays are represented as a color alias and a separate opacity alias:
`neutral-950` supplies the near-black color and the existing percentage
primitives supply `0`, `5`, `10`, and `15`. This preserves primitive references
without inventing composite-color syntax or literal RGBA values. Consumers
must interpret the paired number as a percentage; the repository currently has
no token build or runtime composition pipeline.

| Interactive text role | Primitive | Intended use |
| --- | --- | --- |
| `text.primary` | `indigo-700` | Primary interactive treatment on light context |
| `text.on-primary` | `gray-50` | Text over enabled primary surfaces |
| `text.subtle` | `slate-800` | Text over subtle surfaces |
| `text.ghost` | `indigo-700` | Text over ghost surfaces |
| `text.disabled` | `gray-500` | Disabled interactive text |

Outline roles use `indigo-600` for primary, `slate-500` for subtle, `gray-300`
for disabled, and zero opacity for the ghost default. Disabled text uses
`gray-500`, separate from its deliberately subdued `gray-300` outline; disabled
surfaces use `gray-200`. The disabled outline is decorative and does not meet
the 3:1 non-text contrast threshold. Focus uses `indigo-700` on light surfaces.
Enabled indigo primary surfaces use a two-color focus ring:
`gray-50` on the inner edge and `slate-950` on the outer edge. One color alone
cannot remain visible against both the primary fill and its light surroundings.
A focusable disabled control uses the light-surface focus color because its
disabled fill is neutral.

## State precedence

Disabled has precedence over hover, active, and selected: disabled treatments
never show hover or pressed feedback, and a disabled control does not retain
its selected appearance. Focus remains visible when a disabled control can
receive focus (for example, an `aria-disabled` control). Focus can coexist
with selected and overlays the family treatment rather than changing it.

Selected is persistent and active is temporary. Hover never replaces a
selected treatment. While a selected control is pressed, active temporarily
overrides its selected treatment and selection returns on release. This
changes primary from `indigo-700` to `indigo-800`, subtle from `slate-300` to
`slate-400`, and ghost from 5% to 10%. Do not create a new token for every
state combination; compose the state treatments using this precedence.

## Accessibility and validation

Enabled text mappings are checked against the WCAG AA normal-text threshold of
4.5:1; focus indicators are checked against the 3:1 non-text contrast
threshold. Disabled controls are exempt from WCAG text contrast requirements.
The token tests verify the disabled text/outline distinction and treat the
subdued disabled outline as decorative rather than a required contrast cue.

The light-theme selection meets the tested text criteria. Indigo focus on light
surfaces and `gray-50` focus on enabled primary surfaces each exceed the
non-text threshold; the primary focus ring's outer `slate-950` also contrasts
with its light surroundings. Disabled focus uses indigo on its neutral
background.
These checks do not replace validation in actual component compositions,
particularly for ghost overlays on surfaces outside the documented light
environment.

## Theme and implementation limits

Only light mappings exist. The semantic names do not bake in a theme, so a
future theme can provide alternate aliases without changing consumer names;
dark tokens are not implemented or validated.

This repository has no token build configuration or generated color outputs.
The DTCG-style source is not integrated into a component or CSS variable
pipeline. React Web consumers, React Native output, automatic theme switching,
and automatic color/opacity composition are not claimed.
