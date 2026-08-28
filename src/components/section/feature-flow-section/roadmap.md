# FeatureFlowSection: Component Roadmap

## Status

Implemented. Full test suite green; behavioural parity with the private reference
component it was extracted from, minus the deliberate scope reductions below.

## Open improvements

- The image column's scroll-linked entrance blur/scale/opacity transform (present in
  the reference component) was dropped in favour of a plain fade — a scroll-linked
  transform could be added back as an opt-in prop if a consumer needs it.
- The auto-scroll-into-view-on-expand behaviour (with a loading indicator) from the
  reference component was dropped — this component only toggles the panel; a consumer
  that wants scroll-into-view can call `element.scrollIntoView()` itself from an effect
  keyed on the expanded item id.
- No `ref` forwarding — not required by the current spec. Could be added later if a
  consumer needs to measure or scroll to the root element directly.

## Completed tasks

- Scaffold folder structure and `it.todo` stubs (Phase 1).
- Full types: `FeatureFlowSectionProps`, `FeatureFlowItem`, `FeatureFlowImage`,
  `FeatureFlowMetric`, `FeatureFlowTechnology`, `FeatureFlowHighlightCard`.
- Sticky, hover/scroll-reactive crossfading image column.
- Click-to-expand detail panel: metrics grid, technology chips (via the item's own
  `{ name, icon }` pairs — no app-specific lookup map), highlight-card carousel.
- Floating sub-nav integration (reusing the existing `FloatingSubNav` component).
- Always-on image preload (SSR hint) and client-side idle-time prewarm.
- Full test suite, Storybook stories, and this documentation.
