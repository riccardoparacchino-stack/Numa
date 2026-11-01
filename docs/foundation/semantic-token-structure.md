# Semantic color token structure

Use this map to find a semantic color by **collection**, **scope**, and
**role/modifier**. The canonical definitions and primitive mappings are in
[`tokens/semantic/color.json`](../../tokens/semantic/color.json).

```text
numa-color-{collection}-{scope}-{role}-{modifier}
│           │            │       │       └─ optional state, status, or detail
│           │            │       └──────── semantic purpose
│           │            └──────────────── what the color applies to
│           └───────────────────────────── meaning family
└───────────────────────────────────────── token namespace

numa-color-
├── context                         non-interactive environment
│   ├── background
│   │   ├── default
│   │   └── sunken
│   ├── surface
│   │   ├── weak
│   │   └── strong
│   ├── content
│   │   ├── strong
│   │   └── weak
│   └── outline
│       ├── subtle
│       └── default
│
├── accent                          non-interactive decoration
│   └── content
│       └── default
│
└── interactive                     control feedback and focus
    ├── background
    │   └── disabled                 shared inherited-mode color
    ├── surface
    │   ├── disabled                 shared by every surface family
    │   ├── action
    │   │   ├── default
    │   │   ├── hover
    │   │   ├── active
    │   ├── subtle
    │   │   ├── default
    │   │   ├── hover
    │   │   └── active
    │   └── ghost
    │       ├── color
    │       └── opacity-{default|hover|active}
    ├── content
    │   ├── action
    │   ├── on-action
    │   ├── subtle
    │   ├── disabled
    │   └── status-{success|warning|error|info}
    └── outline
        ├── action
        ├── subtle
        ├── disabled
        ├── focus
        └── focus-on-action-{inner|outer}
```

For example:

```text
numa-color-interactive-surface-action-hover
└──────────┘ └─────────┘ └──────┘ └────┘ └────┘
 namespace   collection   scope    role   modifier
```

## Collections

| Collection | Meaning | Available scopes |
| --- | --- | --- |
| `context` | Non-interactive environment and structure | `background`, `surface`, `content`, `outline` |
| `accent` | Non-interactive decorative emphasis | `content` |
| `interactive` | Control surfaces, content, and focus/boundary strokes | `surface`, `content`, `outline` |

## Scope and modifiers

| Part | Values in use | Meaning |
| --- | --- | --- |
| `background` | `default`, `sunken` | Page or environmental fill |
| `surface` | `weak`, `strong`, `action`, `subtle`, `ghost`, `disabled` | Contained or interactive fill family |
| `content` | `strong`, `weak`, `default`, `action`, `on-action`, `subtle`, `disabled`, `status-*` | Text and icon role |
| `outline` | `subtle`, `default`, `action`, `disabled`, `focus`, `focus-on-action-*` | Boundary or focus stroke |
| state modifier | `default`, `hover`, `active` | Interactive surface state |
| inherited disabled mode | `{scope}-disabled` for `background`, `surface`, `content`, and `outline` | One gray alias per scope; overrides every role in that scope |
| emphasis modifier | `strong`, `weak`, `subtle` | Relative emphasis, not interaction state |
| status modifier | `success`, `warning`, `error`, `info` | Meaningful status content; never the only status cue |
| detail modifier | `on-action`, `focus-on-action-inner`, `focus-on-action-outer`, `ghost-color`, `ghost-opacity-*` | Relationship or implementation distinction within a role |

The collection comes immediately after `numa-color-`; the scope follows the
collection. Not every collection has every scope: accent currently has only
`content`. A scope can omit a role where the role is already explicit, as in
`interactive-content-status-error`. Hyphens separate name parts; braces and
pipe-separated alternatives in the tree are explanatory shorthand, not
literal token characters.

Use `action` for interactive affordances and `accent` only for non-interactive
decoration. Use `strong`/`weak` for context emphasis or surface hierarchy.
State modifiers belong only where a state-specific token exists. There are no
persistent selected tokens until an implemented component needs them.

Disabled is a subtree mode, not a per-role/per-family matrix. Its only color
tokens are `numa-color-interactive-background-disabled`,
`numa-color-interactive-surface-disabled`,
`numa-color-interactive-content-disabled`, and
`numa-color-interactive-outline-disabled`. Components resolve semantic CSS
variables from these shared aliases when disabled mode is active; focus
outlines are preserved for accessibility.

## Naming rules

- Start with `numa-color-`, then choose `context`, `accent`, or `interactive`.
- Name the affected scope: `background`, `surface`, `content`, or `outline`.
- Choose the role before adding a modifier.
- Use semantic names, not component names, raw colors, or ordinal action
  importance. Color token names do not use `primary` or `secondary`.
- Add only a required, distinct role; do not make a new token for every
  component or combination of states.
