# BasicSection: Component Roadmap

## Status

`beta`

Implemented: renders children inside a `position: relative; overflowX: clip` section,
with an optional (`decorated`, default `true`) frame of two corner plus-marks and three
border lines, visible only at >=1440px viewport width.

## Open improvements

| Task                                                                                                        | Priority | Status |
| ----------------------------------------------------------------------------------------------------------- | -------- | ------ |
| Migrate `alexrebula`'s `home-view.tsx` from its local `FloatPlusIcon`/`FloatLine` wrapper to `BasicSection` | Medium   | ⬜     |

## Known gaps

- No entrance animation on the decorative marks (the original consumer-local
  implementation animated them in via framer-motion `variants`). Kept out for v1 —
  add if a real need shows up, rather than porting the original's animation values.

## Completed tasks

| Task                                                                                                          | Completed   |
| ------------------------------------------------------------------------------------------------------------- | ----------- |
| Scaffold folder structure and `it.todo` stubs (Phase 1)                                                       | 31 Aug 2026 |
| `BasicSectionProps`: `children`, `decorated`, `sx`, root passthrough                                          | 31 Aug 2026 |
| Corner plus-mark and border-line decoration (original design, not carried over from any prior implementation) | 31 Aug 2026 |
| Full test suite (component + styles) and Storybook stories                                                    | 31 Aug 2026 |
