# Testing and verification

Tests live beside the component or Foundation module they cover. Their names
identify the kind of check:

| Pattern | Purpose | Runner |
|---|---|---|
| `*.runtime.test.tsx` | React component behavior in the configured jsdom environment | `npm test` |
| `*.type-test.tsx` | Compile-time API assertions, including expected type errors | `npm run typecheck` |
| `*.algorithm.test.ts` | Foundation or component sizing/algorithm behavior | `npm test` |
| `*.foundation.test.ts` | Foundation token inventory, aliases, and resolver contracts | `npm test` |

Vitest uses the repository's `vitest.config.ts`; TypeScript uses strict mode
and includes component, demo, Foundation, and Vitest configuration sources.
There is no separate lint or production-build script configured.

## Commands

```bash
npm test
npm run typecheck
```

For visual inspection, start the Vite preview for the relevant page:

```bash
npm run story
npm run story:text
npm run story:button
npm run story:molecules
npm run demo:tile
```

`story` opens the [showcase index](../components/showcase.html). The `demo:tile`
command opens an explicitly experimental sizing exploration; it is not the
standard Tile page or a test.
