# MetricCardDecoration

## Why it exists

`MetricCardDecoration` is `MetricCard`'s default background decoration: a rotated gradient
rectangle, tinted to a palette colour, that sits behind the card's content and bleeds outside
the card's edges via negative offsets. It is exported as its own component — not inlined into
`MetricCard` — so consumers can swap it, omit it, compose several instances, or override it
entirely with `sx`.

## Why it belongs here

Stat/metric cards routinely want a soft background accent tied to the card's semantic colour.
Getting the CSS-variable channel access right (`theme.vars.palette[color].main`, not a hardcoded
hex or the non-CSS-vars `theme.palette[color].main`) is easy to get subtly wrong. This component
encodes the correct pattern once. It is barrel-exported from the package root
(`@littlebranches/giselle-mui`), so any consumer can reuse it outside `MetricCard` too.

## Design decisions

- **Colour tinting uses `theme.vars.palette[color].main`** with a plain `opacity` value — the
  standard MUI v7 CSS-variables approach. No proprietary colour utilities, no hardcoded hex.
- **Fixed default geometry** (140×140, 40° rotation, top-right offset) arrived at through visual
  iteration; every value is overridable per instance via `sx` (see `MetricCard`'s own README for
  worked examples: bottom-left placement, larger size, reduced rotation).
- **A separate, exported component rather than a boolean `showDecoration` prop on `MetricCard`** —
  keeps the visual choice fully composable: consumers can swap it, omit it, or render several
  instances side by side (see `MetricCard`'s README for a two-decoration example).
- **`BoxProps`-compatible API** — extends `BoxProps` directly, so `sx`, `component`, and every
  standard `Box` prop pass through with no bespoke prop-forwarding surface to maintain.

## Library safety

- No proprietary dependencies — only `@mui/material` `Box`.
- No hardcoded colours — all tinting via `theme.vars.palette[color].main`.
- Original implementation, not derived from any third-party asset. Safe to publish under MIT.

## File structure

```
metric-card-decoration/
  metric-card-decoration.tsx            — MetricCardDecoration component
  metric-card-decoration.styles.ts      — metricCardDecorationSx factory
  metric-card-decoration.const.ts       — METRIC_CARD_DECORATION_SIZE
  metric-card-decoration.styles.test.ts — mock-theme assertions for metricCardDecorationSx
  metric-card-decoration.test.ts        — Vitest unit tests (render, ref, sx merge, passthrough)
  metric-card-decoration.stories.tsx    — standalone colour-variant showcase
  types.ts                              — MetricCardDecorationProps
  index.ts                              — barrel: re-exports all
  README.md                             — this file
```

## Related

- [`MetricCard`](../README.md) — the parent card component; see its README for full composition
  examples (custom `sx`, multiple decorations, a fully custom decoration).
