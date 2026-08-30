# BasicSection

## Why it exists

Landing-page sections that want a consistent decorative frame — corner plus-marks and
border lines — have been reimplementing that chrome by hand per consumer, per section:
a local `<Box component="section">` wrapper plus five manually-positioned decorative SVG
elements (`FloatPlusIcon` × 2, `FloatLine` × 3), copy-pasted wherever it's needed. Any
change to the standard treatment (spacing, opacity, breakpoint) requires updating every
call site. `BasicSection` encodes that decision once.

## Why it belongs in giselle-mui

Any project built on `giselle-mui` that wants a consistent "framed section" look needs
this once, not per-project. The previous, consumer-local implementation
(`svg-elements.tsx` in the private consuming app) imported `varFade` — a proprietary
utility name from a commercial theme kit, and one of giselle-mui's own banned
identifiers (`AGENTS.md` §12). That's why it was never ported in as-is: this component
is a fresh, original implementation of the same *visual idea* (corner marks, border
lines), not a port of that code.

## Planned API

| Prop        | Type              | Default | Description                                    |
| ----------- | ----------------- | ------- | ------------------------------------------------ |
| `children`  | `React.ReactNode` | —       | Required. Section content.                       |
| `decorated` | `boolean`         | `true`  | Renders the corner plus-marks and border lines.  |
| `sx`        | `SxProps<Theme>`  | —       | Forwarded to the root `<section>`.               |

## Design decisions

- **Decoration is all-or-nothing (`decorated: boolean`), not per-mark toggles.** The
  original pattern always rendered the same fixed set (2 corner marks, 2 horizontal
  lines, 1 vertical line); per-mark visibility props would be speculative flexibility
  for a need that hasn't shown up yet.
- **The corner-mark and border-line pieces are not separately exported.** They're small,
  single-purpose, non-reusable-elsewhere SVGs — internal to `basic-section.tsx`, not a
  multi-component feature.
- **Original implementation, not a port.** No `varFade`, no Minimals-derived naming or
  styling values — this is a new design achieving the same visual effect.
- **Composes with, does not replace, `SectionContainer`.** `SectionContainer` is a
  spacing-only shell ("no background colour, no border, no decoration" per its own
  README) — content-width and vertical rhythm. `BasicSection` is the decorative outer
  frame. A section typically nests a `SectionContainer` (or its own `Container`) inside
  a `BasicSection`, the same way the private consuming app's `home-view.tsx` wraps
  `FeatureFlowSection` (which renders its own internal `Container`) in a local
  decorative `<section>` today.

## Phase

Phase: `planned` | Priority tier: `T1`

## File structure

_Filled in when implementation begins._
