# SectionCaption

## Why it exists

`SectionCaption` renders the small overline label — `overline` typography, `text.disabled`
colour — that `SectionTitle` places above its heading. It is exported as its own component,
not inlined into `SectionTitle`, so a consumer can reuse just the label without the rest of
the heading group (e.g. next to a `<Typography variant="h3">` that isn't part of a full
`SectionTitle`).

## Why it belongs here

Any project built on `giselle-mui` occasionally needs a standalone overline label — a small
KPI grouping, a card section header, a form group label — without pulling in `SectionTitle`'s
full heading/description composition. `SectionCaption` is barrel-exported from the package root
(`@littlebranches/giselle-mui`) precisely for this reuse case.

## Design decisions

- **Renders as `component="span"`** — an overline label is inline content, not a block-level
  heading; a `<span>` keeps it composable inside a `<Typography>` or another inline layout
  without introducing block-level line breaks.
- **`Omit<BoxProps, 'title'>`** — extends `BoxProps` directly (so `sx`, `component`, and every
  standard `Box` prop pass through), but omits the native HTML `title` attribute so the prop
  name can be repurposed for the caption's own text content, matching `SectionTitle`'s own
  `title` prop naming.
- **No `color` prop** — matches `SectionTitle`'s own "purely structural/typographic, override
  via `sx`" convention rather than adding a second, redundant colour API.

## Library safety

- Zero personal data. All placeholder content in stories is generic.
- Theme access uses only static `sx` values — no `theme.vars` callback, no proprietary
  identifier names.

## File structure

```
section-caption/
  section-caption.tsx            — SectionCaption component
  section-caption.styles.ts      — sectionCaptionSx (overline typography treatment)
  section-caption.styles.test.ts — assertions for sectionCaptionSx
  section-caption.test.ts        — Vitest unit tests (render, ref, sx merge, passthrough)
  section-caption.stories.tsx    — standalone usage showcase
  types.ts                       — SectionCaptionProps
  index.ts                       — barrel: re-exports all
  README.md                      — this file
```

## Related

- [`SectionTitle`](../README.md) — the parent heading-group component; renders `SectionCaption`
  internally as its `caption` slot.
