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
  phase-card.styles.ts            — sx constants/factories for PhaseCard and its flat sub-components
  phase-card.styles.test.ts       — mock-theme assertions for every exported sx factory
  phase-card.const.ts             — size, font-size, and touch-target constants
  types.ts                        — Props types for PhaseCard and its internal sub-components
  utils.ts                        — pure logic (expansion resolution, corner-badge alignment, platform mapping)
  index.ts                        — barrel: re-exports PhaseCard, its sub-components, types, const, utils
  index.test.ts                   — logic tests for PhaseCard helper functions
  card-decoration.tsx             — decorative corner shape + icon (internal, flat)
  card-status-badge.tsx           — "New"/"Now"/scenario status badge (internal, flat)
  card-detail-bullets.tsx         — collapsible sub-task bullet list (internal, flat)
  scenario-badge.tsx              — scenario pill badge (internal, flat)
  card-corner-alert-badge.tsx     — overdue/date-overlap corner badge + tooltip (internal, flat)
  platform-strip.tsx              — tech-stack icon strip items (internal, flat)
  labeled-icon-strip.tsx          — overline label + icon/logo strip wrapper (internal, flat)
  README.md                       — this file
  roadmap.md                      — planned work, known gaps, completed work
```

`card-corner-alert-badge.tsx`, `platform-strip.tsx`, and `labeled-icon-strip.tsx` are flat
sub-components (not yet nested in their own subfolder — pending #162). Following the
established convention in this folder (`card-decoration.tsx`, `card-status-badge.tsx`, etc.
already do the same), their `sx` styles live in the parent's `phase-card.styles.ts` rather than
a separate per-file styles module, since each is a single-caller internal detail of `PhaseCard`.
They have no own `README.md`/`roadmap.md`; their file-structure entry and roadmap history are
tracked here instead.

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
