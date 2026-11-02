# Exploratory demos

Files in `demos/` are experiments for exploring parameters or compositions.
They are not the standard component showcase, do not define additional
component API, and may expose combinations intended for visual investigation.

## Tile parametric sizing

Run `npm run demo:tile` from the repository root to start Vite and open
[tile-parametric.html](tile-parametric.html). **Do not open this HTML directly
as a `file://` URL**: the page imports TSX modules and requires Vite to
transform and serve them. The same applies to the component showcase HTML pages;
use `npm run story`, `npm run story:text`, `npm run story:button`, or
`npm run story:molecules` to open those through Vite.

This experiment varies Container sizing mode, base padding,
harmonic ratio, radius multiplier, and maximum width while rendering the real
Container and Tile components. The chosen values illustrate how the sizing
algorithm responds; they do not establish supported product presets beyond the
component contract in the [Tile README](../components/molecules/tile/README.md).

The standard representative Tile examples are in the
[Molecule showcase](../components/molecules/showcase.html#tile-heading).
