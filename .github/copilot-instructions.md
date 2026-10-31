# Repository instructions

- Inspect existing component implementations and repository conventions before
  introducing a new pattern.
- Components must consume existing Foundation definitions rather than
  duplicating token values or silently changing foundational data.
- Visual variants must not automatically determine semantic HTML elements,
  heading levels, or accessibility roles.
- Treat accessibility as part of the component API: preserve native semantics
  and forward applicable accessibility attributes.
- New component implementations must include relevant component documentation
  and tests.
- Keep component-specific API and behavior in component documentation; update
  Foundation documentation only for Foundation definitions or their actual
  integration.
- Distinguish implemented behavior from proposals and planned platform support.
  Follow the repository's existing conventions for folders, tooling, styling,
  exports, and tests.
- See the [Numa Components skill](skills/numa-components/SKILL.md) for the
  component-development workflow.
