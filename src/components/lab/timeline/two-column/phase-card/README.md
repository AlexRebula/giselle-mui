# PhaseCard

## Why it exists

Each row in a two-column timeline needs a card that can:

- Render a phase title, date, icon, and optional description without expanding.
- Expand on click to reveal a tech-stack strip, client logos, project logos, photos, a footer
  slot, and a collapsible checklist of sub-tasks.
- Signal overdue, date-overlap, and scenario states through corner badges without polluting the
  card body.
- Work in both controlled mode (parent owns expansion) and uncontrolled mode (card owns it).

Without a shared component, every project builds this boilerplate from scratch, diverging in
accessibility, badge placement, and three-level disclosure behaviour across teams.

## Why it belongs in giselle-mui

Phase cards appear in roadmap views, career history timelines, project portfolios, and feature
trackers. The component binds only to `TimelinePhase` data and MUI palette keys — the caller
decides what a "phase" represents. The corner-badge + popover integration (`PhaseWarningPopover`)
is opt-in via `onPhasesChange`; without it the badge is a read-only tooltip. Nothing in the
component is application-specific.

## Design decisions

**Controlled vs uncontrolled expansion.** When `onRequestExpand` is provided the card defers to
the parent (controlled mode); otherwise it manages `internalExpanded` state itself (uncontrolled).
`resolveCardExpansion` in `utils.ts` encodes this duality so the render function does not branch.

**Three-level title disclosure.** Matches `MilestoneBadge`: rest shows `shortTitle`, hover shows
full `title` + description preview, expansion shows all progressive-disclosure content (platforms,
clients, projects, footer, tasks).

**Corner alert badge.** `overdue` and `dateConflict` each push an entry to `cornerAlerts`. The
badge floats outside the `Paper` on the outer edge (`columnSide` controls which corner) so it
does not push the card body. In read-only mode it is a plain `Tooltip`; when `onPhasesChange` is
provided it opens `PhaseWarningPopover` for interactive date repair.

**Scenario variant.** `phase.variant === 'scenario'` switches the card to a planning/option
appearance: `h6` title, a `CardStatusBadge` scenario label, and no overdue logic.

**Viewed eye badge.** Floats below the card at the outer bottom edge — deliberately outside
`Paper` so it does not participate in click-to-expand. Mirrors corner badge placement.

**Decoration opt-out.** `phase.hideDecoration = true` suppresses the `CardDecoration` background
shape + corner icon. Used for highlighted and scenario variants that provide their own visual
language.

**Storybook:** `Lab/Timeline/Two Column/Phase Card`

## File structure

```
phase-card/
  phase-card.tsx                  — composition root (exported)
  phase-card.styles.ts            — sx constants/factories shared with PhaseCard's own composition
  phase-card.styles.test.ts       — mock-theme assertions for every exported sx factory
  phase-card.const.ts             — size, font-size, and touch-target constants (parent-scoped)
  types.ts                        — Props types for PhaseCard (sub-component Props live in their own folders)
  phase-card.utils.ts             — pure logic (expansion resolution, corner-badge alignment, platform mapping)
  index.ts                        — barrel: re-exports PhaseCard, its sub-components, types, const, utils
  index.test.ts                   — logic tests for PhaseCard helper functions
  README.md                       — this file
  roadmap.md                      — planned work, known gaps, completed work
  card-decoration/                — decorative corner shape + icon (own subfolder)
  card-status-badge/              — "New"/"Now"/scenario status badge (own subfolder)
    scenario-badge/                — scenario pill badge, nested — used only by CardStatusBadge
  card-detail-bullets/            — collapsible sub-task bullet list (own subfolder)
  card-corner-alert-badge/        — overdue/date-overlap corner badge + tooltip (own subfolder)
  platform-strip/                 — tech-stack icon strip item builder (own subfolder; util, not a component)
  labeled-icon-strip/             — overline label + icon/logo strip wrapper (own subfolder)
```

Every sub-component listed above now lives in its own named subfolder (giselle-mui#222, group 3
of 3), each with its own `index.ts` barrel, `types.ts` (where it has Props), `*.styles.ts` for
anything genuinely exclusive to it, and co-located tests. `scenario-badge/` nests one level
deeper inside `card-status-badge/` because `ScenarioBadge` is rendered only by `CardStatusBadge`
— the same nesting pattern as `marker-label/` under `marker-row/`. Styles or utils still shared
with `PhaseCard`'s own composition (or with more than one sibling) remain in this folder's
`phase-card.styles.ts` / `phase-card.utils.ts` / `phase-card.const.ts`.

## Related

- [MilestoneBadge](../milestone-badge/README.md) — companion badge rendered below each phase
  for discrete delivery events
- [PhaseWarningPopover](../phase-warning-popover/README.md) — interactive date-overlap repair
  popover; opened by the corner badge
- [TimelineDot](../timeline-dot/README.md) — the spine dot aligned with each phase card
- [SpineConnector](../spine-connector/README.md) — the vertical line between phase rows
- [MUI Paper](https://mui.com/material-ui/react-paper/) — root element

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
