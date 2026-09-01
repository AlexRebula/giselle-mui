# FeatureFlowHighlightCarousel

## Why it exists

`FeatureFlowSection`'s expanded detail panel can show a set of `highlightCards` for
an item — proof points with a title, description, an optional link, and a supporting
image. A single item can have several; the carousel is how the panel shows them one
at a time without the whole panel growing to fit every card at once.

## Why it's split out

The carousel owns real internal state (`selectedIndex`, slide direction) and its own
crossfade/slide-in animation choreography — genuinely self-contained behaviour that
doesn't belong inline in `FeatureFlowSection`'s own render, and is independently
testable in isolation from the rest of the detail panel.

## Planned API

| Prop    | Type                                   | Default | Description                                       |
| ------- | --------------------------------------- | ------- | --------------------------------------------------- |
| `cards` | `readonly FeatureFlowHighlightCard[]`   | —       | The highlight cards to cycle through.               |
| `sx`    | `SxProps<Theme>`                        | —       | Merged with the carousel's own computed styles.     |

Plus every other native `Box` (`div`) attribute except `children` (driven by `cards`
instead).

## Design decisions

- **Images crossfade only; text slides.** The backdrop images never move — only their
  opacity changes on slide change, avoiding layout jank from differently-sized source
  images. The title/description/link block below slides in directionally
  (`highlightTextVariants`, keyed by `selectedIndex`) so a slide change reads as a
  clear transition, not just a flash.
- **Every image frame is permanently mounted**, matching `FeatureFlowImageColumn`'s
  own crossfade pattern — `crossfadeOpacitySx` (in the parent's
  `feature-flow-section.styles.ts`, shared by both) is the one place that opacity
  transition is defined, so the two crossfades can't silently drift apart.
- **Renders `null` when `cards` is empty**, rather than an empty shell — there's
  nothing meaningful to show, and an empty carousel with visible controls would be
  confusing.
- **Backdrop images are `aria-hidden`.** The title/description already convey the
  same content as real, announced text — a screen reader announcing the image too
  would be a duplicate.

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/highlight-carousel/
  feature-flow-highlight-carousel.tsx              : component
  feature-flow-highlight-carousel.test.ts           : unit tests
  feature-flow-highlight-carousel.styles.ts         : sx constants
  feature-flow-highlight-carousel.styles.test.ts    : style assertions
  feature-flow-highlight-carousel.animations.ts     : text-slide framer-motion variants
  feature-flow-highlight-carousel.stories.tsx       : Storybook stories
  types.ts                                          : FeatureFlowHighlightCarouselProps
  index.ts                                          : barrel export
  README.md                                         : this file
  roadmap.md                                        : open improvements and completed tasks
```
