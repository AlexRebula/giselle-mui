# FeatureFlowSection — Roadmap

> Last updated: 28 Aug 2026

## Status

`beta`

Implemented with full behavioral parity against its private reference component's acceptance criteria; ships with the deliberate scope reductions listed under Known gaps.

## Open improvements

| Task                                                                     | Priority | Status |
| ------------------------------------------------------------------------ | -------- | ------ |
| Opt-in scroll-linked entrance blur/scale transform on the image column   | Low      | ⬜     |
| `ref` forwarding to the root element                                      | Low      | ⬜     |
| Responsive Storybook story (xs/sm/md/lg)                                  | Medium   | ⬜     |

## Known gaps

- The image column's scroll-linked entrance blur/scale transform (present in the reference component) was dropped in favour of a plain opacity crossfade.
- Auto-scroll-into-view-on-expand (with a loading indicator) from the reference component was dropped — this component only toggles the panel; a consumer that wants scroll-into-view can call `element.scrollIntoView()` itself from an effect keyed on the expanded item id.
- No `ref` forwarding — not required by the current spec.
- Crossfade/expand-collapse transitions do not check `prefers-reduced-motion` (a repo-wide gap shared with `FaqSection`'s `MotionAccordion`, not unique to this component).

## Completed

| Task                                                                                                              | Completed   |
| ------------------------------------------------------------------------------------------------------------------ | ----------- |
| Scaffold folder structure and `it.todo` stubs (Phase 1)                                                            | 28 Aug 2026 |
| Full types: `FeatureFlowSectionProps`, `FeatureFlowItem`, `FeatureFlowImage`, `FeatureFlowMetric`, `FeatureFlowTechnology`, `FeatureFlowHighlightCard` | 28 Aug 2026 |
| Sticky, hover/scroll-reactive crossfading image column                                                              | 28 Aug 2026 |
| Click-to-expand detail panel: metrics grid, technology chips (via the item's own `{ name, icon }` pairs), highlight-card carousel | 28 Aug 2026 |
| Floating sub-nav integration (reusing the existing `FloatingSubNav` component)                                     | 28 Aug 2026 |
| Always-on image preload (SSR hint) and client-side idle-time prewarm                                                | 28 Aug 2026 |
| Full test suite, Storybook stories, and this documentation                                                          | 28 Aug 2026 |
