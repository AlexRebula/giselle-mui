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
is a fresh, original implementation of the same _visual idea_ (corner marks, border
lines), not a port of that code.

## Planned API

| Prop                    | Type                             | Default                       | Description                                                             |
| ----------------------- | -------------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `children`              | `React.ReactNode`                | —                               | Required. Wrapped in `SectionContainer` — see Design decisions.        |
| `decoration`             | `boolean \| DecorationElement[]` | `true`                          | `true`: the canonical frame. `false`: none. Array: a fully custom set.  |
| `containerMaxWidth`      | `ContainerProps['maxWidth']`     | `SectionContainer`'s own `'lg'` | Forwarded to the inner `SectionContainer`.                              |
| `containerPy`            | `SectionContainerProps['py']`    | `SectionContainer`'s own `{xs:8,md:12}` | Forwarded to the inner `SectionContainer`.                      |
| `containerSx`            | `SxProps<Theme>`                 | —                               | Forwarded to the inner `SectionContainer`.                              |
| `unconstrainedChildren`  | `React.ReactNode`                | —                               | Rendered as a sibling of `SectionContainer`, inside `<section>` but outside the width-constrained container — for content with its own internal `Container` (would double up on padding otherwise) or that needs the full section width. |
| `sx`                    | `SxProps<Theme>`                 | —                               | Forwarded to the root `<section>`.                                      |

`DecorationElement` is `{ kind, vertical?, sx? }`, where `kind` is one of
`'corner-plus' | 'corner-x' | 'border-line' | 'triangle-left' | 'triangle-down' | 'dot'`.
Every element positions itself entirely through its own `sx` — see "Design decisions"
below for why there's no built-in position enum.

## Design decisions

- **Decoration is `boolean | DecorationElement[]`, not a small named-variant enum.**
  The original assumption (`decorated: boolean`, all-or-nothing) held only as long as
  one pattern was checked. Auditing every real consumer of the prior consumer-local
  `svg-elements.tsx` primitives found six genuinely different decoration patterns
  across different sections, sharing no fixed offsets — inset corner marks here, flush
  or outset ones there, a fully data-driven array elsewhere. A closed enum of named
  presets couldn't cover that; a `boolean` shorthand for the one shared canonical
  pattern, backed by an open array of per-element `sx`, can.
- **Each `DecorationElement` positions itself via its own `sx`, not a preset position
  enum.** Same evidence: no two real consumers agree on an inset, so baking positions
  into the component would just move the inconsistency inside `BasicSection` instead
  of removing it. `kind` only decides which shape renders (a plus-mark vs a line vs a
  triangle); everything about *where* is the caller's `sx`.
- **The decoration renderer is not separately exported.** `Decoration` (the internal
  per-`kind` switch) stays inside `basic-section.tsx` — consumers describe decoration
  as data (`DecorationElement[]`), not by importing and placing individual SVG
  components themselves. `DecorationElement`/`DecorationKind` (the types) are exported;
  the rendering is not.
- **No entrance animation, still.** The original primitives animated in via
  framer-motion `variants` tied to `whileInView`. Wiring that through six kinds and a
  `MotionViewport` context is a second real feature, not a rename — kept out of this
  pass; see roadmap.
- **Original implementation, not a port.** No `varFade`, and no naming or styling values
  carried over from the prior consumer-local implementation or the commercial theme kit
  it was based on — this is a new design achieving the same visual effect for each
  shape.
- **Composes with, does not replace, `SectionContainer`.** `SectionContainer` is a
  spacing-only shell ("no background colour, no border, no decoration" per its own
  README) — content-width and vertical rhythm. `BasicSection` is the decorative outer
  frame. A section typically nests a `SectionContainer` (or its own `Container`) inside
  a `BasicSection` — `FeatureFlowSection` does exactly this internally, replacing its
  own `<section>` root with `BasicSection`'s.

## Phase

Phase: `implemented` | Priority tier: `T1`

## File structure

```
basic-section/
  basic-section.tsx            : BasicSection component + internal Decoration renderer
  basic-section.styles.ts      : style functions, CANONICAL_FRAME, layout constants
  basic-section.test.ts        : unit tests
  basic-section.styles.test.ts : style tests
  basic-section.stories.tsx    : Default, NotDecorated, one story per kind, composed reproductions
  types.ts                     : BasicSectionProps, DecorationElement, DecorationKind
  index.ts                     : barrel
  README.md                    : this file
  roadmap.md                   : open improvements and completed tasks
```

_Filled in when implementation begins._
