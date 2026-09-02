---
sidebar_position: 4
sidebar_label: 'Component Inventory'
---

> **Keep in sync (required):** the DoD scale and every `n/12` / `n/22` score in this file come from the Scenario A / Scenario B Definition of Done checklists in [`components/cleanup-workflow.md`](./components/cleanup-workflow.md). When that playbook's checklist changes length, update this file's scale line and re-score the same day. This file is not a second playbook.
>
> **Private migration tracking:** the port/migration tick matrix lives in the **private wiki** only — not linked here.

# @littlebranches/giselle-mui — Complete Component Inventory

One canonical table, below, is the whole inventory: every **component** folder on disk, built or not, with its layer, location, phase/status, DoD score, best-practices score, and audit date. It replaces the four overlapping views this file used to carry (a shipped-exports table, a separate quality-status table, an ASCII target source tree, and a per-phase status table per phase) — those four disagreed with each other and with disk, which is what made the file untrustworthy.

Two kinds of folder are deliberately **not** listed, because neither DoD checklist applies to them and a score column would be noise: the framer-motion variant modules under `motion/variants/*` (`fade`, `slide`, `scale`, `zoom`, `bounce`, `rotate`, `flip`, `container`, `transition`, `actions` — plain functions returning animation config), and pure grouping folders that hold no files of their own (`section/hero/`, `material/surfaces/card/`, and similar). Both appear in [`component-compliance.md`](./component-compliance.md), which tracks every folder regardless of kind.

Where to look for what:

| Question                                                     | Source of truth                                                      |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| What exists, what phase it belongs to, what its DoD score is | **this file's table**                                                |
| Does a folder have a README / JSDoc / stories / roadmap      | [`component-compliance.md`](./component-compliance.md)               |
| What is planned next, per component                          | that component's own `roadmap.md`                                    |
| What is planned next, library-wide                           | [`roadmap.md`](./roadmap.md)                                         |
| How a component reaches "done"                               | [`components/cleanup-workflow.md`](./components/cleanup-workflow.md) |

_Last full regen: **2026-09-02** (giselle-mui#224) — table generated from disk; every built component re-audited against the current Scenario A/B checklists._

---

## Shipped-component count

Counting **distinct, non-deprecated, capitalised component exports** per entry point — excluding hooks, utilities, `SCREAMING_SNAKE` constants, and type-only exports:

| Entry point                            | Subpath   | Components |
| -------------------------------------- | --------- | ---------- |
| `src/index.ts`                         | main      | 25         |
| `src/charts-index.ts`                  | `/charts` | 1          |
| `src/motion-index.ts`                  | `/motion` | 8          |
| `src/lab-index.ts`                     | `/lab`    | 7          |
| `src/utils-index.ts`                   | `/utils`  | 0          |
| **Total distinct components exported** |           | **41**     |

**25 (main) + 1 (`/charts`) + 8 (`/motion`) + 7 (`/lab`) + 0 (`/utils`) = 41 components shipped.**

Two things the number deliberately does not do:

- It does not count the deprecated alias `FaqAccordion` (an alias of `FaqSection`). Counting named exports rather than distinct components gives 42.
- It does not count the **36 internal sub-components** that ship inside those 41 but are not exported from any entry point. They are still listed in the table below, marked `Shipped · internal`, because they carry their own DoD score.

`/utils` exports zero components by design — it is the server-safe subpath and contains only pure functions and types.

---

## How to read the DoD and best-practices columns

**DoD scale:** Scenario B (standalone component) = `n/22` · Scenario A (sub-component) = `n/12`. Both checklists live in [`components/cleanup-workflow.md`](./components/cleanup-workflow.md).

**SonarQube is scored as not-verified, uniformly.** Both checklists contain a "SonarQube: zero violations" item. No SonarQube scanner, config, or npm script exists in this repo, so that item cannot be verified here and is **excluded from every numerator** in this table. A component with nothing else outstanding therefore reads **`21/22`** (Scenario B) or **`11/12`** (Scenario A), never a clean 22/22 or 12/12. This is applied to every row so the scores are comparable; it is not a statement that any component fails the check. Restoring SonarQube to the toolchain is the only way to close that item — until then, treat `21/22` and `11/12` as the practical ceiling.

**Best practices** maps to a 13-item rubric tracked in private planning docs, not in this repository. It therefore **cannot be re-audited here**. Existing scores are carried forward from the audit that set them; rows that never had one read `not re-audited` rather than an invented number.

Each component's own JSDoc carries the same score as a `**Quality status (DD Mon YYYY):**` line, with the specific open items spelled out. That line, not this table, is the place to look for _why_ a score is short.

---

## Component inventory

| Component                                                    | Layer    | Location (`src/components/…`)                                                  | Phase / Status                        | DoD score | Best practices | Last audited | Notes                                                                               |
| ------------------------------------------------------------ | -------- | ------------------------------------------------------------------------------ | ------------------------------------- | --------- | -------------- | ------------ | ----------------------------------------------------------------------------------- |
| `AreaLineChartCard`                                          | chart    | `chart/area-line-chart-card/`                                                  | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `BudgetVsActualCard`                                         | chart    | `chart/budget-vs-actual-card/`                                                 | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `ChartCardBase`                                              | chart    | `chart/chart-card-base/`                                                       | Scaffold · Phase H G2                 | —         | —              | —            | not built; planned: ChartCardBase (shared chart card shell)                         |
| `DonutChartCard`                                             | chart    | `chart/donut-chart-card/`                                                      | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `GroupedBarChartCard`                                        | chart    | `chart/grouped-bar-chart-card/`                                                | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `HorizontalBarChartCard`                                     | chart    | `chart/horizontal-bar-chart-card/`                                             | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `ProjectionCard`                                             | chart    | `chart/projection-card/`                                                       | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `RadarChartCard`                                             | chart    | `chart/radar-chart-card/`                                                      | Scaffold · Phase H G2                 | —         | —              | —            | not built                                                                           |
| `RadialProgressCard`                                         | chart    | `chart/radial-progress/`                                                       | Shipped · `/charts` · Phase E         | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `SparklineBarChart`                                          | chart    | `chart/sparkline-bar/`                                                         | Shipped · internal · Phase H G2       | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `TimelineCompact`                                            | lab      | `lab/timeline/compact/`                                                        | Shipped · `/lab`                      | 20/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `ChevronDownIcon`                                            | lab      | `lab/timeline/compact/chevron-down-icon/`                                      | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `PhaseAccordionRow`                                          | lab      | `lab/timeline/compact/phase-accordion-row/`                                    | Shipped · internal                    | 9/12      | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `TaskDetailsModal`                                           | lab      | `lab/timeline/compact/task-details-modal/`                                     | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `TaskDetailsRenderer`                                        | lab      | `lab/timeline/compact/task-details-renderer/`                                  | Shipped · `/lab`                      | 17/22     | 13/13          | 02 Sep 2026  | no README; no stories                                                               |
| `TimelineItemDetails`                                        | lab      | `lab/timeline/item-details/`                                                   | Scaffold · Phase G                    | —         | —              | —            | not built                                                                           |
| `TaskList`                                                   | lab      | `lab/timeline/task-list/`                                                      | Shipped · `/lab` · Phase E            | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `TimelineTwoColumn`                                          | lab      | `lab/timeline/two-column/`                                                     | Shipped · `/lab`                      | 19/22     | 13/13          | 02 Sep 2026  | required by a private consuming app                                                                       |
| `MarkerRow`                                                  | lab      | `lab/timeline/two-column/marker-row/`                                          | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `MarkerLabel`                                                | lab      | `lab/timeline/two-column/marker-row/marker-label/`                             | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `MilestoneBadge`                                             | lab      | `lab/timeline/two-column/milestone-badge/`                                     | Shipped · `/lab`                      | 19/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `MilestoneRow`                                               | lab      | `lab/timeline/two-column/milestone-row/`                                       | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `PhaseCard`                                                  | lab      | `lab/timeline/two-column/phase-card/`                                          | Shipped · `/lab`                      | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `CardCornerAlertBadge`                                       | lab      | `lab/timeline/two-column/phase-card/card-corner-alert-badge/`                  | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `CardDecoration`                                             | lab      | `lab/timeline/two-column/phase-card/card-decoration/`                          | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `CardDetailBullets`                                          | lab      | `lab/timeline/two-column/phase-card/card-detail-bullets/`                      | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `CardStatusBadge`                                            | lab      | `lab/timeline/two-column/phase-card/card-status-badge/`                        | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `ScenarioBadge`                                              | lab      | `lab/timeline/two-column/phase-card/card-status-badge/scenario-badge/`         | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `LabeledIconStrip`                                           | lab      | `lab/timeline/two-column/phase-card/labeled-icon-strip/`                       | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `buildPlatformStripItems`                                    | lab      | `lab/timeline/two-column/phase-card/platform-strip/`                           | Shipped · hook / non-component module | n/a       | n/a            | —            | exports a JSX-returning helper, not a component — neither DoD checklist applies     |
| `PhaseRow`                                                   | lab      | `lab/timeline/two-column/phase-row/`                                           | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `TimelineColumn`                                             | lab      | `lab/timeline/two-column/phase-row/timeline-column/`                           | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `PhaseWarningPopover`                                        | lab      | `lab/timeline/two-column/phase-warning-popover/`                               | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no stories                                        |
| `MiniGanttRuler`                                             | lab      | `lab/timeline/two-column/phase-warning-popover/mini-gantt-ruler/`              | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `SpineConnector`                                             | lab      | `lab/timeline/two-column/spine-connector/`                                     | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no stories                                        |
| `TimelineDot`                                                | lab      | `lab/timeline/two-column/timeline-dot/`                                        | Shipped · `/lab`                      | 17/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `DotInner`                                                   | lab      | `lab/timeline/two-column/timeline-dot/dot-inner/`                              | Shipped · internal                    | 10/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `ActivityFeedList`                                           | material | `material/data-display/activity-feed-list/`                                    | Scaffold · Phase H G3                 | —         | —              | —            | not built                                                                           |
| `AmortizationTable`                                          | material | `material/data-display/amortization-table/`                                    | Scaffold · Phase H G7                 | —         | —              | —            | not built                                                                           |
| `AnimatedGradientText`                                       | material | `material/data-display/animated-gradient/`                                     | Shipped · main · Phase E              | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `AvatarRow`                                                  | material | `material/data-display/avatar-row/`                                            | Shipped · internal · Phase J T2       | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `ContactsList`                                               | material | `material/data-display/contacts-list/`                                         | Scaffold · Phase H G4                 | —         | —              | —            | not built                                                                           |
| `DataTable`                                                  | material | `material/data-display/data-table/`                                            | Scaffold · Phase H G3              | —         | —              | —            | not built; planned: DataTable (task table in a private consuming app)                                     |
| `ExpenseCategoryGroup`                                       | material | `material/data-display/expense-category-group/`                                | Scaffold · Phase I A                  | —         | —              | —            | not built                                                                           |
| `ExpenseLineItem`                                            | material | `material/data-display/expense-line-item/`                                     | Scaffold · Phase I A                  | —         | —              | —            | not built                                                                           |
| `IconActionBar`                                              | material | `material/data-display/icon/action-bar/`                                       | Shipped · main                        | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `GiselleIcon`                                                | material | `material/data-display/icon/giselle/`                                          | Shipped · main                        | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `TechIconStrip`                                              | material | `material/data-display/icon/tech-strip/`                                       | Shipped · main                        | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `NewsFeedList`                                               | material | `material/data-display/news-feed-list/`                                        | Scaffold · Phase H G3                 | —         | —              | —            | not built                                                                           |
| `ProgressStatsList`                                          | material | `material/data-display/progress-stats-list/`                                   | Scaffold · Phase H G4                 | —         | —              | —            | not built                                                                           |
| `RelatedItemsList`                                           | material | `material/data-display/related-items-list/`                                    | Scaffold · Phase H G3                 | —         | —              | —            | not built                                                                           |
| `SelectableLabel`                                            | material | `material/data-display/selectable-label/`                                      | Shipped · main                        | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `StatusLabel`                                                | material | `material/data-display/status-label/`                                          | Shipped · main                        | 19/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `SectionPendingLoader`                                       | material | `material/feedback/section-pending-loader/`                                    | Scaffold · Phase E                    | —         | —              | —            | not built                                                                           |
| `OptionWithBlurb`                                            | material | `material/input/option-with-blurb/`                                            | Scaffold · Phase E                    | —         | —              | —            | not built                                                                           |
| `ToggleIconButton`                                           | material | `material/input/toggle-icon-button/`                                           | Shipped · main · Phase E              | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `AppShell`                                                   | material | `material/layout/app-shell/`                                                   | Scaffold · Phase J T1                 | —         | —              | —            | not built; planned: AppShell (slot-based shell; sidebar optional for landing pages) |
| `AuthPageLayout`                                             | material | `material/layout/auth-page-layout/`                                            | Scaffold · Phase J T1                 | —         | —              | —            | not built; planned: AuthPageLayout (card on gradient background)                    |
| `BasicSection`                                               | material | `material/layout/basic-section/`                                               | Shipped · main                        | 19/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `PageHeader`                                                 | material | `material/layout/page-header/`                                                 | Scaffold · Phase J T2                 | —         | —              | —            | not built; planned: PageHeader (title + breadcrumb + action row)                    |
| `SectionContainer`                                           | material | `material/layout/section-container/`                                           | Shipped · main · Phase E              | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `SectionTitle`                                               | material | `material/layout/section-title/`                                               | Shipped · main · Phase I-2            | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `SectionCaption`                                             | material | `material/layout/section-title/section-caption/`                               | Shipped · main                        | 20/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `TwoColumnShowcaseRow`                                       | material | `material/layout/showcase-row/`                                                | Shipped · main · Phase E              | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `AppSidebar`                                                 | material | `material/navigation/app-sidebar/`                                             | Scaffold · Phase J T1                 | —         | —              | —            | not built; planned: AppSidebar (collapsible + mini icon-only variant)               |
| `AppTopBar`                                                  | material | `material/navigation/app-top-bar/`                                             | Scaffold · Phase J T1                 | —         | —              | —            | not built; planned: AppTopBar (dashboard top nav with user menu slot)               |
| `Breadcrumbs`                                                | material | `material/navigation/breadcrumbs/`                                             | Scaffold · Phase J T2                 | —         | —              | —            | not built                                                                           |
| `FloatingControlBar`                                         | material | `material/navigation/floating-control-bar/`                                    | Scaffold · Phase E                    | —         | —              | —            | not built                                                                           |
| `FloatingSubNav`                                             | material | `material/navigation/floating-sub-nav/`                                        | Shipped · `/motion` · Phase H G6      | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `NavPill`                                                    | material | `material/navigation/floating-sub-nav/nav-pill/`                               | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `SubNavButton`                                               | material | `material/navigation/floating-sub-nav/sub-nav-button/`                         | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `Accordion`                                                  | material | `material/surfaces/card/accordion/`                                            | Shipped · main · Phase E              | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `BalanceSummaryCard`                                         | material | `material/surfaces/card/balance-summary/`                                      | Scaffold · Phase H G1                 | —         | —              | —            | not built                                                                           |
| `BudgetBreakdownCard`                                        | material | `material/surfaces/card/budget-breakdown/`                                     | Scaffold · Phase H G4                 | —         | —              | —            | not built                                                                           |
| `CostClassificationCard`                                     | material | `material/surfaces/card/cost-classification/`                                  | Scaffold · Phase H G7                 | —         | —              | —            | not built                                                                           |
| `CreditCardDisplay`                                          | material | `material/surfaces/card/credit-card-display/`                                  | Scaffold · Phase H G1                 | —         | —              | —            | not built                                                                           |
| `FeaturedItemCard`                                           | material | `material/surfaces/card/featured-item/`                                        | Scaffold · Phase H G5                 | —         | —              | —            | not built                                                                           |
| `HeroBannerCard`                                             | material | `material/surfaces/card/hero-banner/`                                          | Scaffold · Phase H G5                 | —         | —              | —            | not built                                                                           |
| `MetricCard`                                                 | material | `material/surfaces/card/metric/`                                               | Shipped · main                        | 20/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `MetricCardDecoration`                                       | material | `material/surfaces/card/metric/metric-card-decoration/`                        | Shipped · main                        | 19/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `PeriodSummaryCard`                                          | material | `material/surfaces/card/period-summary/`                                       | Scaffold · Phase I B                  | —         | —              | —            | not built                                                                           |
| `ProfileSummaryCard`                                         | material | `material/surfaces/card/profile-summary/`                                      | Shipped · main · Phase J T2           | 19/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `PromoInviteCard`                                            | material | `material/surfaces/card/promo-invite/`                                         | Scaffold · Phase H G5                 | —         | —              | —            | not built                                                                           |
| `QuickTransferCard`                                          | material | `material/surfaces/card/quick-transfer/`                                       | Scaffold · Phase H G4                 | —         | —              | —            | not built                                                                           |
| `QuoteCard`                                                  | material | `material/surfaces/card/quote/`                                                | Shipped · main                        | 20/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `ROIComparisonCard`                                          | material | `material/surfaces/card/roi-comparison/`                                       | Scaffold                              | —         | —              | —            | not built                                                                           |
| `SelectableCard`                                             | material | `material/surfaces/card/selectable/`                                           | Shipped · main                        | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `StatCard`                                                   | material | `material/surfaces/card/stat/`                                                 | Shipped · main                        | 20/22     | 13/13          | 02 Sep 2026  | required by a private consuming app                                                                       |
| `StatCardRow`                                                | material | `material/surfaces/card/stat-row/`                                             | Shipped · main                        | 21/22     | not re-audited | 02 Sep 2026  | required by a private consuming app                                                                       |
| `StatCardShape`                                              | material | `material/surfaces/card/stat/stat-card-shape/`                                 | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `DetailsDrawer`                                              | material | `material/surfaces/details-drawer/`                                            | Scaffold · Phase F                    | —         | —              | —            | not built                                                                           |
| `ScenarioComparison`                                         | material | `material/surfaces/scenario-comparison/`                                       | Scaffold · Phase H G7                 | —         | —              | —            | not built                                                                           |
| `Motion`                                                     | motion   | `motion/`                                                                      | Scaffold                              | —         | —              | —            | not built                                                                           |
| `AnimatedTabPanel`                                           | motion   | `motion/animated-tab-panel/`                                                   | Scaffold · Phase H G6                 | —         | —              | —            | not built                                                                           |
| `BreakdownCarouselView`                                      | motion   | `motion/breakdown-carousel-view/`                                              | Scaffold · Phase I D                  | —         | —              | —            | not built                                                                           |
| `BreakdownExpandingView`                                     | motion   | `motion/breakdown-expanding-view/`                                             | Scaffold · Phase I D                  | —         | —              | —            | not built                                                                           |
| `BreakdownStackedView`                                       | motion   | `motion/breakdown-stacked-view/`                                               | Scaffold · Phase I D                  | —         | —              | —            | not built                                                                           |
| `BudgetSummaryDrawer`                                        | motion   | `motion/budget-summary-drawer/`                                                | Scaffold · Phase I C                  | —         | —              | —            | not built                                                                           |
| `MotionContainer`                                            | motion   | `motion/container/`                                                            | Shipped · `/motion`                   | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `ExpandingPeriodStrip`                                       | motion   | `motion/expanding-period-strip/`                                               | Scaffold · Phase I C                  | —         | —              | —            | not built                                                                           |
| `FloatingIconCloud`                                          | motion   | `motion/floating-icon-cloud/`                                                  | Scaffold · Phase I-6                  | —         | —              | —            | not built                                                                           |
| `FloatingSideNav`                                            | motion   | `motion/floating-side-nav/`                                                    | Scaffold · Phase I-3                  | —         | —              | —            | not built                                                                           |
| `HeroBackground`                                             | motion   | `motion/hero-background/`                                                      | Scaffold · Phase I-5                  | —         | —              | —            | not built                                                                           |
| `HorizontalScrollRail`                                       | motion   | `motion/horizontal-scroll-rail/`                                               | Scaffold · Phase I C                  | —         | —              | —            | not built                                                                           |
| `InteractiveHeroLogo`                                        | motion   | `motion/interactive-hero-logo/`                                                | Scaffold · Phase I-7                  | —         | —              | —            | not built                                                                           |
| `PeriodDetailSheet`                                          | motion   | `motion/period-detail-sheet/`                                                  | Scaffold · Phase I C                  | —         | —              | —            | not built                                                                           |
| `SectionTitleAnimated`                                       | motion   | `motion/section-title-animated/`                                               | Scaffold                              | —         | —              | —            | not built                                                                           |
| `useScrollParallax`                                          | motion   | `motion/use-scroll-parallax/`                                                  | Shipped · hook / non-component module | —         | —              | —            | no component `.tsx` — hook or variant module                                        |
| `Variants`                                                   | motion   | `motion/variants/`                                                             | Scaffold                              | —         | —              | —            | not built                                                                           |
| `Actions`                                                    | motion   | `motion/variants/actions/`                                                     | Shipped · hook / non-component module | —         | —              | —            | no component `.tsx` — hook or variant module                                        |
| `MotionViewport`                                             | motion   | `motion/viewport/`                                                             | Shipped · `/motion`                   | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `WeeklyBreakdownPage`                                        | motion   | `motion/weekly-breakdown-page/`                                                | Scaffold · Phase I D                  | —         | —              | —            | not built                                                                           |
| `ErrorSection`                                               | section  | `section/error/`                                                               | Scaffold · Phase J T1                 | —         | —              | —            | not built; planned: ErrorSection (404 + 500; T1 MUI Store requirement)              |
| `FaqSection`                                                 | section  | `section/faq/accordion/`                                                       | Shipped · `/motion`                   | 20/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `FaqFloatLine + FaqFloatPlusIcon + FaqFloatTriangleDownIcon` | section  | `section/faq/accordion/accordion-svg/`                                         | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `FaqBottomLines`                                             | section  | `section/faq/accordion/bottom-lines/`                                          | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `FaqMotionViewport`                                          | section  | `section/faq/accordion/motion-viewport/`                                       | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `FaqTopLines`                                                | section  | `section/faq/accordion/top-lines/`                                             | Shipped · internal                    | 11/12     | 13/13          | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `FeatureFlowSection`                                         | section  | `section/feature-flow/`                                                        | Shipped · main                        | 18/22     | 10/13          | 02 Sep 2026  | —                                                                                   |
| `FeatureFlowDescriptionColumn`                               | section  | `section/feature-flow/description-column/`                                     | Shipped · internal                    | 10/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `FeatureFlowHighlightCarousel`                               | section  | `section/feature-flow/highlight-carousel/`                                     | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `FeatureFlowImageColumn`                                     | section  | `section/feature-flow/image-column/`                                           | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `FeatureFlowItemDetail`                                      | section  | `section/feature-flow/item-detail/`                                            | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `FeatureFlowItemRow`                                         | section  | `section/feature-flow/item-row/`                                               | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint                                                    |
| `HeroButtonsRow`                                             | section  | `section/hero/buttons-row/`                                                    | Shipped · `/motion`                   | 21/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `InteractiveHeroLogo`                                        | section  | `section/hero/interactive-logo/`                                               | Shipped · `/motion` · Phase I-7       | 19/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `ArtisticLogoLayer`                                          | section  | `section/hero/interactive-logo/artistic-logo-layer/`                           | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `OriginalLogoLayer`                                          | section  | `section/hero/interactive-logo/original-logo-layer/`                           | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `PortraitLayer`                                              | section  | `section/hero/interactive-logo/portrait-layer/`                                | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no README; no stories                             |
| `ScrollParallaxHero`                                         | section  | `section/hero/scroll-parallax/`                                                | Shipped · `/motion`                   | 21/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `AnimatedHeroHeading`                                        | section  | `section/hero/scroll-parallax/animated-hero-heading/`                          | Shipped · `/motion`                   | 21/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `HeroSection`                                                | section  | `section/hero/section/`                                                        | Shipped · main · Phase E              | 21/22     | 13/13          | 02 Sep 2026  | —                                                                                   |
| `PricingSection`                                             | section  | `section/pricing/`                                                             | Scaffold · Phase J T3                 | —         | —              | —            | not built; planned: PricingSection (3-tier pricing cards)                           |
| `GiselleSettingsProvider`                                    | theming  | `theming/settings-provider/`                                                   | Shipped · main                        | 18/22     | not re-audited | 02 Sep 2026  | no stories                                                                          |
| `GiselleThemeAndSettingsProvider`                            | theming  | `theming/settings-provider/theme-and-settings-provider/`                       | Shipped · main                        | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |
| `SettingsThemeBridge`                                        | theming  | `theming/settings-provider/theme-and-settings-provider/settings-theme-bridge/` | Shipped · internal                    | 11/12     | not re-audited | 02 Sep 2026  | not exported from any entrypoint; no stories                                        |
| `GiselleThemeProvider`                                       | theming  | `theming/theme-provider/giselle/`                                              | Shipped · main                        | 20/22     | not re-audited | 02 Sep 2026  | —                                                                                   |

---

## Status key

| Symbol / label                                                      | Meaning                                                                                                                |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `Shipped · main` / `` `/charts` `` / `` `/motion` `` / `` `/lab` `` | Built and exported from that entry point                                                                               |
| `Shipped · internal`                                                | Built, carries its own DoD score, but intentionally not exported from any entry point                                  |
| `Shipped · hook / non-component module`                             | Built, but has no component `.tsx` — a hook or a variant/animation module, so DoD does not apply                       |
| `Scaffold`                                                          | Folder, `types.ts`, `roadmap.md`, README and a placeholder test exist; no implementation yet                           |
| `Phase X`                                                           | Phase this component belongs to; `G1`…`G7` are Phase H groups, `A`…`D` are Phase I groups, `T1`…`T3` are Phase J tiers |

---

## Roadmap — phases and remaining work

Per-component planned work lives in each folder's own `roadmap.md`; the library-level phase timeline lives in [`roadmap.md`](./roadmap.md). What follows is only the phase-level planning detail that has no other home — blockers, ordering constraints, and follow-ups that a status table cannot express.

### Phases C and D — theming and settings (done)

`GiselleThemeProvider` shipped 13 May 2026; `GiselleSettingsProvider`, `GiselleThemeAndSettingsProvider` and `useGiselleSettings` shipped 14 May 2026. Full architecture spec: [`components/settings/settings-provider-plan.md`](./components/settings/settings-provider-plan.md).

One Phase D item is still open and is not a component, so it has no row in the table above:

- ⬜ `detectGiselleSettings()` — SSR-safe cookie read helper for the Next.js App Router.

### Phase E — standalone UI primitives (partially done)

Remaining: `OptionWithBlurb`, `SectionPendingLoader`, `FloatingControlBar`. All three exist in a private consuming app and need porting rather than writing.

- `OptionWithBlurb` — small enough to extract as-is; no blocker.
- `SectionPendingLoader` — blocked on replacing `Iconify` with `GiselleIcon`.
- `FloatingControlBar` — blocked on replacing `Iconify` with `GiselleIcon`.

### Phases F and G — drawer and details (not started)

`DetailsDrawer` (Phase F) is a shell-only slide-in panel: responsive width, backdrop, header and footer slots, content supplied via slot. `TimelineItemDetails` (Phase G) is the read/edit panel rendered inside it, and is **blocked on Phase F**.

### Phase H — dashboard component suite

Full spec: [`components/dashboard-components-plan.md`](./components/dashboard-components-plan.md). Both subpath prerequisites are done — `/charts` and `/motion` were wired in tsup and `package.json` on 7 May 2026.

Group blockers worth knowing before picking one up:

- **G2 (chart cards)** — build `ChartCardBase` first; the other eight chart cards are meant to share its shell.
- **G5 `HeroBannerCard`** — blocked on Phase C being used properly: the gradient must come from `theme.vars.palette.*`, never a hardcoded hex.
- **G6 `FloatingSubNav`** — **already done.** This was tracked as a pending move from the main bundle to `/motion`; the move has landed and `FloatingSubNav` is now exported only from `src/motion-index.ts`. Its folder still sits under `material/navigation/` (the folder tree groups by MUI category, the entry point decides the bundle), which is why it can look unmoved. No re-export shim exists in the main bundle, so this was a breaking change for any consumer still importing it from the root.

### Phase I — home-section extraction and period breakdown (`/motion`)

Home-section extraction spec: [`components/home-components-extraction-plan.md`](./components/home-components-extraction-plan.md). All of it targets the `/motion` subpath.

Ordering constraints:

- The variant factories (`fade`, `scale`, `zoom`, …) are the root dependency — **shipped**, so the phases that waited on them are unblocked.
- `SectionTitle`'s animated variant (I-2), `FloatingSideNav` (I-3) and `HeroBackground` (I-5) all depended on those factories.
- `HeroBackground` (I-5) also depends on the internal SVG animation primitives (I-4: `FloatLine`, `FloatTriangle`, `FloatDot`, `CircleDot`, `PlusSign` — internal, never exported).
- `InteractiveHeroLogo` (I-7) has **shipped** as `section/hero/interactive-logo/`, exported from `/motion`. Its old placeholder folder `motion/interactive-hero-logo/` is still on disk and should be deleted.

The period-breakdown suite (Groups A–D) has no plan document in this repo: the `components/trip-planner-components-plan.md` that this file used to link to twice does not exist and there is no evidence it ever did. Its component list survives only as the `Scaffold · Phase I A`…`D` rows in the table above.

### Phase J — MUI Store tiers (not started)

`AppShell`, `AuthPageLayout`, `AppSidebar`, `AppTopBar` and `ErrorSection` are tier 1; `PageHeader`, `Breadcrumbs`, `AvatarRow` and `ProfileSummaryCard` are tier 2; `PricingSection` is tier 3. `AvatarRow` and `ProfileSummaryCard` have since been built ahead of their tier — see the table above.

### Private consuming-app coverage

A private consuming app needs `StatusLabel` (task status), `DataTable` (task list), `StatCard` + `StatCardRow` (earnings/payments), and `TimelineTwoColumn` (project task view), plus `StatCard` again for the Give/Save/Blow bucket split. All of these are main-bundle or `/lab` — no `/charts` or `/motion` import is required there. `DataTable` is the only one not yet built.

---

## Quality bar / npm publish blockers

> These are not new components — they are fixes to already-shipped components. All must be ✅ before Route B (npm publish).

### `TimelineTwoColumn` — branch finalization (`feature/giselle-mui-career-timeline-finalisation`)

#### `TimelineDot` fixes

| Item                                                                                                                                                                               | Status |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix pulse ring absent — `inset: -5` (unitless, invalid CSS) → `inset: '-5px'` in `timeline-dot.tsx` (`::after` sx)                                                                 | ⬜     |
| Fix pulse ring colour mismatch — active dot ring must match `PhaseCard`'s "Now" badge colour (warning/yellow). Verify `effectiveColor` resolves correctly once ring is visible     | ⬜     |
| Fix focus ring rectangular — replace `outline: '2px solid'` + `outlineOffset` with `outline: 'none'` + `box-shadow: '0 0 0 3px ...'` so ring follows `border-radius: 50%`          | ⬜     |
| Fix checklist mode icon state — clicking dot to mark done/undone must visually change the icon (muted/greyed when done, restored when undone); dot ring/background already changes | ⬜     |
| Increase phase dot size for visual hierarchy — `size='phase'` must be visibly larger than `size='milestone'`; active state must NOT change the size (ring communicates active)     | ⬜     |
| Regression test: `timeline-dot.styles.test.ts` — `::after` inset value is a string with a CSS unit (guard against bare number regression)                                          | ⬜     |
| Regression test: phase dot size constant > milestone dot size constant                                                                                                             | ⬜     |

#### `SpineConnector` / layout fixes

| Item                                                                                                                                                                                      | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix milestone dots missing spine connector — every dot (phase and milestone) must have a vertical line segment above and below it; currently milestone dots float with no connecting line | ⬜     |
| Fix card spacing breaks spine line — increasing `PhaseCard` gap breaks `SpineConnector` into segments; spine must remain continuous regardless of card height                             | ⬜     |
| Fix year label breathing room — year label must sit in the inter-card gap with clear space above and below (tied to spacing fix above)                                                    | ⬜     |

#### `PhaseCard` visual fixes

| Item                                                                                                                                                          | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix card hover elevation too low — shadow delta on hover is barely perceptible; increase it; expanded card retains hover-level elevation (does not snap back) | ⬜     |
| Fix expanded card sibling blur — blur must not apply to the expanded card itself; expanded card holds hover elevation; blur applies to siblings only          | ⬜     |
| WCAG: expanded bullet text — assess `text.secondary` at body size against paper background; fix if below AA (4.5:1)                                           | ⬜     |

#### Storybook

| Item                                                                                                                                                                                      | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Write `PhaseCard.stories.tsx` — three variants side-by-side (standard right / grey left / highlighted), all three status badges (active / overdue / scenario), with and without `details` | ⬜     |

### All shipped components

#### Code quality

| Item                                                                                                                                         | Status |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Fix `timeline-two-column.tsx:436` — `<Box onClick={stopCardPropagation}>` → `<div>`                                                          | ⬜     |
| Fix 4 `<Box key={width}>` in Responsive stories (MetricCard, QuoteCard, SelectableCard, TimelineTwoColumn) → `<div>`                         | ⬜     |
| Memoization audit — check every event handler passed as prop and every derived value; wrap in `useCallback`/`useMemo` as needed; not yet run | ⬜     |
| SonarQube zero-violations audit — `GiselleIcon`, `MetricCard`, `QuoteCard`, `SelectableCard`                                                 | ⬜     |
| SonarQube zero-violations audit — `TimelineTwoColumn`, `PhaseCard`, `MilestoneBadge`, `TimelineDot`                                          | ⬜     |
| SonarQube zero-violations audit — `createIconRegistrar`                                                                                      | ⬜     |

#### JSDoc

| Item                                                                                    | Status |
| --------------------------------------------------------------------------------------- | ------ |
| JSDoc on `MetricCardColor`, `MetricCardProps`, `MetricCardDecorationProps` own props    | ⬜     |
| JSDoc on `QuoteCardProps`, `SelectableCardProps` own props                              | ⬜     |
| JSDoc on `MilestoneBadgeProps`, `PhaseCardProps`, `TimelineDotComponentProps` own props | ⬜     |

#### Quality gate expansion

| Item                                                                                                                                                    | Status |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Add bare-`<Box>` grep to `npm run check:verify` gate                                                                                                    | ⬜     |
| Storybook component readiness gate — CI step that fails if any export in `src/index.ts` is missing at least one story file, one test file, and a README | ⬜     |
| Document SonarQube workflow in `giselle-mui/docs/local-development.md` — what it checks, how to run it, what the cognitive complexity limit is          | ⬜     |
| GitHub Actions CI wired (`.github/workflows/ci.yml`)                                                                                                    | ⬜     |

#### Release

| Item                                                   | Status |
| ------------------------------------------------------ | ------ |
| Storybook deployed to public URL (Chromatic or Vercel) | ⬜     |
| `CHANGELOG.md` first version entry                     | ⬜     |
| `package.json` version bumped to `0.1.0`               | ⬜     |

#### Deferred (post-launch)

| Item                                                                                                                                                                    | Status |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Extract `CardStatusBadge` — "Now" pulsing badge + "Overdue" chip + scenario label from `PhaseCard`; deferred until proprietary identifier cleanup is confirmed complete | ⬜     |

---

## Related docs

- [`roadmap.md`](./roadmap.md) — library-level phase timeline with milestone detail
- [`component-compliance.md`](./component-compliance.md) — per-folder README / JSDoc / story / roadmap presence
- [`standalone-gap-analysis.md`](./standalone-gap-analysis.md) — what still lives in the source apps and has not been ported here
- [`components/cleanup-workflow.md`](./components/cleanup-workflow.md) — the Scenario A / Scenario B definitions of done
- [`components/dashboard-components-plan.md`](./components/dashboard-components-plan.md) — full Phase H spec with build-order tiers
- [`components/home-components-extraction-plan.md`](./components/home-components-extraction-plan.md) — home section extraction phases 1–7
- [`components/settings/settings-provider-plan.md`](./components/settings/settings-provider-plan.md) — Phase D architecture spec
- [`naming-conventions.md`](./naming-conventions.md) — folder and component naming rules
