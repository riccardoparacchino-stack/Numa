---
name: numa-components
description: Use when implementing or changing Numa UI components; inspect the repository architecture and Foundation definitions before choosing patterns.
---

# Numa Components

## Purpose

Keep UI component work consistent with Numa's actual repository architecture.
Treat documentation and tests as part of each component change, and distinguish
implemented behavior from proposals.

## Before changing a component

1. Inspect the repository tree, package scripts, existing components, tests,
   styling approach, and relevant Foundation source and generated outputs.
   Read the component's README and the [Atoms index](../../../components/atoms/README.md)
   when working on an Atom.
2. Reuse an existing implementation pattern when one exists. Do not introduce
   a new framework, styling system, folder layout, or cross-platform abstraction
   based only on the design-system direction or a proposed API.
3. Verify what platforms and integrations the code actually supports. Do not
   claim React Web, React Native, generated styles, or font loading unless the
   implementation demonstrates it.

## Architecture and folders

- Keep reusable UI components under `components/` and organize them according
  to the existing component hierarchy. Atoms belong under `components/atoms/`;
  use a component-named folder for its implementation and local documentation.
- Follow established file names, exports, styling, prop-forwarding, and test
  conventions. Add only the files needed by the component.
- Always use existing components and Foundation tokens in application UI,
  documentation pages, demos, stories, and examples when they can be used in
  that context. Do not recreate their behavior with raw elements or copied
  values. If an artifact must remain standalone and cannot render the component
  or reference tokens directly, keep its values synchronized with Foundation
  and clearly identify it as a static illustration rather than a live
  component rendering.
- Keep shared design definitions in Foundation and component-specific behavior
  in the component. Do not add Semantic Tokens or Component Tokens unless the
  repository architecture and task explicitly call for them.

## Foundation and typography

- Consume existing Foundation token definitions and generated outputs instead
  of copying values into component styles.
- Inspect token source, generation workflow, and output before changing values.
  Treat generated artifacts as generated only when the repository workflow
  confirms that status.
- If a needed Foundation definition is missing or conflicts with a component
  proposal, document the gap and alternatives. Do not silently add or adjust
  tokens.
- For Text work, consult [Foundation Typography](../../../docs/foundation/typography.md)
  and the [Text Atom specification](../../../components/atoms/text/README.md).
  Keep typography variant/size mapping separate from semantic elements.
- Prefer the named Foundation letter-spacing presets for Text; do not add
  unrestricted tracking values to the component API without revising its
  documented token contract.
- Resolve Text letter spacing in Foundation from the selected font-size token;
  do not copy size/preset matrices into component implementations. Keep
  platform conversion in a platform adapter and validate each platform before
  claiming support.
- Centralize variant and size configuration in the existing local pattern.
  Make valid combinations explicit, prevent invalid combinations in types
  where practical, and test every supported combination.

## Presentation, semantics, and accessibility

- Visual variants must not implicitly choose HTML elements, heading levels, or
  accessibility roles. Select semantics from content and document structure.
- Design accessibility into the public component API: preserve native
  semantics, forward applicable native and ARIA attributes, and use explicit
  roles only when needed. Do not add redundant or misleading roles.
- Keep font properties and semantic props distinct. For Text, variant and size
  control font size and line height; do not add independent overrides unless
  the documented API is intentionally revised.
- Do not claim cross-platform behavior without platform-specific implementation
  and validation.

## Documentation and tests

- Update the component README with purpose, API, variants, sizes, Foundation
  relationship, semantics, accessibility, examples, and known limitations.
- Update the appropriate component index so the component is discoverable.
  Update Foundation documentation only when its definitions or consumption
  relationship changes; do not move component-specific API details into
  Foundation.
- Keep standard Vite previews beside their component as `showcase.html`,
  `showcase.tsx`, and `showcase.css`; link them from component and category
  indexes. Render the real component and consume Foundation values rather than
  making a parallel HTML/CSS illustration. Keep parameter experiments in
  `demos/`, visibly labeled as exploratory.
- Use `docs/README.md` for documentation navigation and `docs/testing.md` for
  test naming and verification commands. Add links to relevant local tests;
  do not duplicate test cases in documentation.
- Record rationale, alternatives, trade-offs, impact, and status for meaningful
  decisions. Use an ADR for long-lived system architecture decisions; keep
  component-level decisions in the component README when that is sufficient.
- Add or update tests alongside the implementation. Cover supported variants
  and sizes, customization, prop forwarding, accessibility, semantic
  independence, and invalid combinations as applicable.
- Run the narrowest relevant tests and repository checks. Verify documentation
  links and ensure no document describes unimplemented functionality as
  available.
