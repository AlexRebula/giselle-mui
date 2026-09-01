# FeatureFlowImageColumn

## Why it exists

`FeatureFlowSection`'s sticky image column shows whichever image the currently
hovered/active/selected item resolves to, crossfading between sources with no
remount or flicker, and scroll-linked entrance transform as the column comes into
view. That's a real chunk of presentational logic — worth its own tested unit,
separate from the timing/scroll-position computation that drives it.

## Why it's split out

`FeatureFlowSection` owns all the *timing* (which src is active, hover-stack order,
scroll-direction bookkeeping) and passes the resolved result down as plain props.
This component only renders that result — it has no timing logic of its own,
matching `FeatureFlowDescriptionColumn`'s own sub-component split for the opposite
column.

## Planned API

| Prop          | Type                          | Default                                    | Description                                                                        |
| ------------- | ------------------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------ |
| `activeSrc`   | `string`                       | —                                           | The src that should be fully visible right now.                                    |
| `ghostSrc`    | `string`                       | —                                           | In-flow src used purely to give the sticky column its natural height.              |
| `allSrcs`     | `readonly string[]`            | —                                           | Every src this column may ever show — all permanently mounted, crossfaded via opacity. |
| `alt`         | `string`                       | —                                           | Alt text for the active frame.                                                     |
| `revealStyle` | `FeatureFlowImageRevealStyle`  | `{ opacity: 1, y: 0, scale: 1, filter: 'none' }` | Scroll-progress-driven entrance transform, computed by `FeatureFlowSection`.       |
| `sx`          | `SxProps<Theme>`               | —                                           | Styles the inner image card specifically — not the root sticky wrapper.            |

Plus every other native `Stack` attribute (`className`, `data-*`, `aria-*`, etc.) —
goes to the root `Stack`.

## Design decisions

- **Every `src` in `allSrcs` is permanently mounted; only `activeSrc` is opaque.**
  Crossfading via opacity between already-mounted images avoids the remount/flicker a
  key-based swap would cause on every hover change.
- **`ghostSrc` renders invisibly in-flow purely to give the sticky column its natural
  height** — `position: sticky` needs a properly-sized ancestor to have room to travel
  within; an all-`position: absolute` crossfade stack alone would collapse to zero height.
- **`sx` styles the inner image card, not the root sticky wrapper** — matching the
  one call site's established use. All other passthrough props go to the root `Stack`.
- **The reveal transform applies one level in from the card**, not on the card
  itself — the card owns its own `transform` (`translateX(-50%)`, for horizontal
  centering) via `imageColumnCardSx`; composing the scroll-linked reveal transform
  onto that same node would silently overwrite it. A separate inner wrapper
  (`imageColumnRevealWrapperSx`) keeps the two independent.

## Phase

Phase: `Section` | Priority tier: `T2`

## File structure

```
src/components/section/feature-flow/image-column/
  feature-flow-image-column.tsx           : component
  feature-flow-image-column.test.ts        : unit tests
  feature-flow-image-column.styles.ts      : sx constants
  feature-flow-image-column.styles.test.ts : style assertions
  feature-flow-image-column.stories.tsx    : Storybook stories
  types.ts                                 : FeatureFlowImageColumnProps
  index.ts                                 : barrel export
  README.md                                : this file
  roadmap.md                               : open improvements and completed tasks
```
