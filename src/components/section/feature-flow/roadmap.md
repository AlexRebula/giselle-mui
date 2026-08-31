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
| Default Storybook story doesn't set `scrollImages`, so the scroll-direction image swap isn't demonstrable in Storybook | Low | ⬜ |
| `prefers-reduced-motion` handling for crossfade/expand-collapse transitions | Low    | ⬜     |

## Known gaps

- The image column's scroll-linked entrance blur/scale transform (present in the reference component) was dropped in favour of a plain opacity crossfade.
- No `ref` forwarding — not required by the current spec.
- Crossfade/expand-collapse transitions do not check `prefers-reduced-motion` (a repo-wide gap shared with `FaqSection`'s `MotionAccordion`, not unique to this component).
- `feature-flow-section.const.ts`'s timing constants are not re-exported from `index.ts` — intentional, since they are fixed internal implementation details, not configuration.

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
| Fixed: `ctaLabel`/`ctaHref` dropped (declared but never rendered — same defect class as the already-dropped `outcomes`/`highlights`) | 28 Aug 2026 |
| Fixed: image column `alt` text tracked the wrong frame after hover/scroll (was keyed to `ghostSrc`, now keyed to `activeSrc`) | 28 Aug 2026 |
| Consolidated `feature-flow-image-column.styles.ts`/`feature-flow-highlight-carousel.styles.ts` into the parent's `feature-flow-section.styles.ts`, per this repo's sub-component convention | 28 Aug 2026 |
| Recorded Quality status (DoD 19/20 · Best practices 10/13) in JSDoc and README | 28 Aug 2026 |
| Restructured `feature-flow-image-column.tsx`, `feature-flow-item-detail.tsx`, `feature-flow-highlight-carousel.tsx` from flat sibling files into their own named subfolders (`image-column/`, `item-detail/`, `highlight-carousel/`), each with its own `index.ts` and `types.ts` — resolves the sub-component nesting inconsistency flagged during PR #159 review; see giselle-mui#160/#161 for the policy fix and giselle-mui#162 for the broader codebase migration this is part of | 28 Aug 2026 |
| Restored auto-scroll-into-view-on-expand (with a `LinearProgress` pending indicator for the gap before the panel is mounted and scrollable) — closes the previously-dropped gap; added a `metrics[].sublabel` render test and a second, unmocked test file exercising the real `AnimatePresence` enter/exit transition | 28 Aug 2026 |
| Round 2 hardening: per-item entrance stagger (fade + slide-up), `m.div layout` height transition around the detail panel + sub-nav, `:active` and dark-mode `:hover`/`:active` shadow coverage for selected items, and `MetricCardDecoration` on each `MetricCard` — closes five behaviors dropped from the original `expertise-areas.tsx` that round 1 didn't cover (giselle-mui#177) | 29 Aug 2026 |
| Composes `BasicSection` as its own root instead of a local `Box`/`Container`, gaining the standard decorative frame for free (`decoration` prop, default `true`) — the private consuming app no longer needs a manual wrapper (#198/#200) | 31 Aug 2026 |
| Extracted `FeatureFlowDescriptionColumn` (title + row list, mirroring the existing `FeatureFlowImageColumn` split) out of the parent's inline JSX | 31 Aug 2026 |
| Added `renderRightPanel`: overrides the image column entirely with a render-prop `(activeItem, isActiveExpanded) => ReactNode`, for non-image right-column content (e.g. a skills-documentation heading/description pane) — `image`/`FeatureFlowImageColumn` remain the default when omitted | 31 Aug 2026 |
| Generalized `FeatureFlowHighlightCard`: `headline`/`detail`/`src` → `title`/`description`/`media`, plus a new optional `href` (rendered as a "Learn more" link in the carousel) — reusable for any documentation content, not just marketing highlights | 31 Aug 2026 |
| Folded the `m.div layout` > `AnimatePresence` > `FeatureFlowItemDetail` wrapper tree into `FeatureFlowItemDetail` itself (`item: FeatureFlowItem \| null`, `onNodeRef` replacing the external ref) | 31 Aug 2026 |
