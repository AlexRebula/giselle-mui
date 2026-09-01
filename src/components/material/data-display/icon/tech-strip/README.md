# TechIconStrip

## Why it exists

Listing the technologies behind a project is a standard portfolio and landing page pattern. Done naively it is a bulleted list of names — which wastes the visual weight that icons carry. Done poorly it is a row of SVGs with no labels — which breaks accessibility and is unreadable to anyone who doesn't recognise every icon by shape.

This component solves the non-obvious parts:

- Icons are wrapped in an `aria-hidden` container so screen readers skip the decoration and read only the label `<Typography>`.
- `<svg>` children are normalised to a fixed size via the `& svg` selector — you don't need to pass a matching `width`/`height` to every icon individually.
- Items wrap automatically when the container is narrower than the strip, with a configurable `centeredWrap` option for layouts that need centred wrapping.

## Why it belongs here

Any page that documents a technology stack needs this pattern. It is independent of any specific data model or domain — the consumer provides an array of `{ icon, label }` pairs.

## Design decisions

### `aria-hidden` on the icon wrapper

The icon is decorative — the label carries the meaning. Marking the icon slot `aria-hidden` prevents screen readers from announcing Iconify's SVG title text ("Code"), which would be read in addition to the label ("Frontend"), doubling the content.

### Fixed size via `& svg` selector

Forcing `width` and `height` on `& svg` means the consumer can pass any `ReactNode` — a `GiselleIcon`, a raw `<img>`, a custom SVG — without needing to know the target size. The slot normalises them all to `TECH_ICON_STRIP_ICON_SIZE` (32 px). If a consumer needs a different size, they override via `sx`.

### `TECH_ICON_STRIP_ICON_SIZE = 32`

32 px is the minimum standalone decorative icon size from the library's readable-size table. Smaller icons are hard to read at a glance, especially when the label is also small (`0.75 rem`). A regression test guards this minimum.

### `centeredWrap` not `align`

A full alignment API (`'left' | 'center' | 'right'`) adds complexity for a pattern that is almost always either left or centred. `centeredWrap: boolean` keeps the prop surface minimal while covering the real use cases.

## File structure

```
tech-icon-strip/
  tech-icon-strip.tsx        — component
  tech-icon-strip.const.ts   — TECH_ICON_STRIP_ICON_SIZE, TECH_ICON_STRIP_LABEL_FONT_SIZE
  tech-icon-strip.styles.ts  — titleSx, stripWrapperSx, itemSx, iconSlotSx, itemLabelSx
  tech-icon-strip.styles.test.ts
  tech-icon-strip.test.ts
  tech-icon-strip.stories.tsx
  types.ts                   — TechIconItem, TechIconStripProps
  index.ts                   — barrel
  README.md                  — this file
```

## Related

- `GiselleIcon` — the intended icon provider for the `icon` slot
- `StatCard` — often appears alongside a tech strip in a project summary layout
- `HeroSection` — natural parent for a technology strip in a hero context
