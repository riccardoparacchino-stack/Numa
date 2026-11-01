# Semantic colors

Semantic color tokens describe purpose and interaction, not component names or
raw appearance. Values in
[`tokens/semantic/color.json`](../../tokens/semantic/color.json) alias existing
primitive colors or percentages.

See the [semantic color token structure diagram](semantic-token-structure.md)
for the collection/scope/role hierarchy and modifier naming.

## Naming and scope

Token names follow `numa-color-{collection}-{scope}-{role}-{modifier}` where
applicable. Use **context** for non-interactive content and structure,
**interactive** for control feedback, and **accent** for decorative emphasis.
Scopes are explicit:

- **`background`** — page/environment fills.
- **`surface`** — contained fills and interactive fills.
- **`content`** — text and icons.
- **`outline`** — borders and focus strokes.
- **`shadow`** — non-interactive depth tint.

Use semantic emphasis modifiers such as `strong`, `weak`, `subtle`, and
`default`. Interactive action roles use `action`; never encode component names
or ordinal action importance in Foundation tokens. Color token names do not use
`primary` or `secondary`. Keep this set small: add a token only when an
existing semantic role cannot express a distinct, required treatment.

## Context and accent

| Token | Primitive | Role |
| --- | --- | --- |
| `numa-color-context-background-default` | `slate-100` | Default page background |
| `numa-color-context-background-sunken` | `slate-300` | Recessed environment |
| `numa-color-context-surface-weak` | `white` | First contained surface |
| `numa-color-context-surface-strong` | `slate-200` | Nested contained surface |
| `numa-color-context-content-strong` | `slate-950` | High-emphasis text and icons |
| `numa-color-context-content-weak` | `slate-700` | Supporting text and icons |
| `numa-color-context-outline-subtle` | `slate-200` | Low-emphasis boundary |
| `numa-color-context-outline-default` | `slate-300` | Standard boundary |
| `numa-color-context-shadow-subtle` | `slate-500` | Subtle non-interactive shadow tint |
| `numa-color-accent-content-default` | `teal-800` | Non-interactive decorative icons, badges, and emphasis |

Page consumes `background-default` for its page fill. Container uses the
first contained surface (`surface-weak`) and outline (`outline-subtle`).
Standalone nested Tiles alternate `surface-weak` and `surface-strong`; inside
a Container, the middle Tile uses `surface-strong` and its inner Tile returns
to `surface-weak`. Card uses `surface-strong` with one nested child returning
to weak. The Page uses slate-100 while the first contained surface uses white,
matching their distinct roles and the white Container frame in the FigCraft
foundation.

The subtle and action surface examples map to
`interactive-surface-subtle-default` (slate-200) and
`interactive-surface-action-default` (indigo-600). The Ghost Tile border maps
to `context-outline-default` (slate-300). Existing Tile nesting and action
feedback remain independent of Page and Container.
Container shadow color uses `context-shadow-subtle`; it is separate from all
outline roles even though both can use neutral primitive colors.

Accent is non-interactive: it communicates decoration or identity and must not
be used to imply an action, success, warning, error, or informational state.
The current accent is teal.

## Interactive feedback

| Role | Default | Hover | Active | Disabled |
| --- | --- | --- | --- | --- |
| `surface.action` | `indigo-600` | `indigo-700` | `indigo-800` | Shared `gray-200` |
| `surface.subtle` | `slate-200` | `slate-300` | `slate-400` | Shared `gray-200` |
| `surface.ghost` | 0% overlay | 5% overlay | 10% overlay | Shared `gray-200` |

Ghost feedback uses one `neutral-950` color alias with existing percentage
primitives. Disabled mode suppresses visual hover/active feedback. Persistent
selected surfaces are not currently defined because no supported component
consumes them; add them only with a documented, tested selection use case.

| Scope and role | Primitive | Intended use |
| --- | --- | --- |
| `interactive-content-action` | `indigo-700` | Action text and icons on light context |
| `interactive-content-on-action` | `gray-50` | Content over enabled action surfaces |
| `interactive-content-subtle` | `slate-800` | Content over subtle surfaces |
| `interactive-content-disabled` | `gray-500` | Shared disabled content color |
| `interactive-content-status-success` | `green-800` | Success feedback |
| `interactive-content-status-warning` | `amber-800` | Warning feedback |
| `interactive-content-status-error` | `red-800` | Error feedback |
| `interactive-content-status-info` | `blue-800` | Informational feedback |

Status modifiers distinguish feedback meaning and are not action colors. These
status roles currently provide content color only; pair status with text or
another non-color cue rather than relying on color alone.

Action outlines use `indigo-600`; subtle outlines use `slate-500`. Disabled
outlines use shared `gray-300`, separate from disabled content, and are
decorative rather than a required contrast cue. Disabled backgrounds use
`gray-100`; every role within a scope maps to the shared disabled token for
that scope. Thus every background becomes gray-100, every surface gray-200,
every content color (including accent and status) gray-500, and every
non-focus outline gray-300. The four aliases are the only disabled color
tokens; do not add disabled variants for individual roles or surface families.

Focus is the exception to outline remapping. Focus on light and disabled
surfaces uses `indigo-700`. Action surfaces use a two-color focus ring:
`gray-50` inside and `slate-950` outside, so the ring remains distinct from
both the action fill and its light surroundings.

## Inherited disabled mode

When a Tile or another component establishes disabled mode, its descendants
inherit the shared semantic CSS-variable palette. Numa components with a
`disabled` API combine their own state with the inherited state; descendants
cannot opt back in. Buttons and button Tiles use native disabled behavior and
suppress activation.

Components without a disabled API inherit visual token overrides only; this
does not make arbitrary elements inert or inaccessible. Custom content must
consume semantic CSS variables to receive the mapped colors. Raw values and
inline literal colors cannot be overridden by this mode. Focus outlines are
preserved when a control can still receive focus.

## Accessibility and implementation limits

Tests check WCAG AA contrast of at least 4.5:1 for enabled content and 3:1 for
focus indicators against the documented light surfaces. Disabled content is
exempt from the normal-text threshold; disabled outlines are intentionally
subdued. Color cannot be the only signal for status.

Only light mappings exist. Semantic names remain theme-neutral, but dark
aliases, automatic theme switching, React Native output, and generated CSS are
not implemented. Components currently resolve source tokens in React Web;
there is no token generation pipeline.
