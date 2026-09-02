# Component Compliance Report

> **Public source of truth** for library component **hygiene** status — does each component folder have a README, JSDoc, story JSDoc, and a roadmap, and is that roadmap's work finished.
> This file deliberately tracks _file presence_, not quality scores. Per-component DoD and best-practices scores live in [`component-inventory.md`](./component-inventory.md) and in each component's own JSDoc `Quality status` line.
> The inventory **migration matrix** (G C P M N U D) lives in the **private wiki only** — not in this repo.

_Last full regen: **2026-09-02** — regenerated from disk across all 146 component folders (giselle-mui#224). Every folder that owns a `README.md`, `types.ts`, `roadmap.md`, or a component `.tsx` gets a row._

## How each column is derived

| Column           | Means                                                                                                                                                            |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Component**    | Folder path under `src/components/` — used instead of the bare folder name because leaf names repeat across layers (`accordion`, `container`, `giselle`, `hero`) |
| **Layer**        | Top-level layer folder: `chart` · `lab` · `material` · `motion` · `section` · `theming`                                                                          |
| **Built**        | A component `.tsx` exists (excluding `.stories.tsx`, `.test.tsx`, `.defaults.tsx`)                                                                               |
| **README**       | `README.md` exists in the folder                                                                                                                                 |
| **JSDoc**        | A `/** */` block exists in the component `.tsx` or in `types.ts`                                                                                                 |
| **Story JSDoc**  | A `.stories.tsx` exists **and** carries a `/** */` block                                                                                                         |
| **Roadmap**      | `roadmap.md` exists in the folder                                                                                                                                |
| **Roadmap done** | The folder is built **and** its roadmap's _Open improvements_ section has no `⬜` / `🔄` rows                                                                    |
| **Timeline**     | One of the folder's exported component names appears in [`roadmap.md`](./roadmap.md)'s phase timeline                                                            |

## Totals

| Category                         | Count |
| -------------------------------- | ----- |
| Component folders tracked        | 146   |
| Built (component `.tsx` present) | 78    |
| Unbuilt scaffolds and index-only | 68    |

| Component                                                                   | Layer    | Built | README | JSDoc | Story JSDoc | Roadmap | Roadmap done | Timeline | Notes                          |
| --------------------------------------------------------------------------- | -------- | ----- | ------ | ----- | ----------- | ------- | ------------ | -------- | ------------------------------ |
| chart/area-line-chart-card                                                  | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/budget-vs-actual-card                                                 | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/chart-card-base                                                       | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/donut-chart-card                                                      | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/grouped-bar-chart-card                                                | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/horizontal-bar-chart-card                                             | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/projection-card                                                       | chart    | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/radar-chart-card                                                      | chart    | ❌    | ✅     | ❌    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| chart/radial-progress                                                       | chart    | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| chart/sparkline-bar                                                         | chart    | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| lab/timeline/compact                                                        | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/compact/chevron-down-icon                                      | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/compact/phase-accordion-row                                    | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/compact/task-details-modal                                     | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/compact/task-details-renderer                                  | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/item-details                                                   | lab      | ❌    | ✅     | ❌    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| lab/timeline/task-list                                                      | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/two-column                                                     | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/two-column/marker-row                                          | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/marker-row/marker-label                             | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/milestone-badge                                     | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/two-column/milestone-row                                       | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card                                          | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/two-column/phase-card/card-corner-alert-badge                  | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/card-decoration                          | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/card-detail-bullets                      | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/card-status-badge                        | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/card-status-badge/scenario-badge         | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/labeled-icon-strip                       | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-card/platform-strip                           | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-row                                           | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-row/timeline-column                           | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/phase-warning-popover                               | lab      | ✅    | ✅     | ✅    | ❌          | ✅      | ✅           | ❌       | no stories                     |
| lab/timeline/two-column/phase-warning-popover/mini-gantt-ruler              | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| lab/timeline/two-column/spine-connector                                     | lab      | ✅    | ✅     | ✅    | ❌          | ✅      | ✅           | ❌       | no stories                     |
| lab/timeline/two-column/timeline-dot                                        | lab      | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| lab/timeline/two-column/timeline-dot/dot-inner                              | lab      | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| material/data-display/activity-feed-list                                    | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/amortization-table                                    | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/animated-gradient                                     | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/data-display/avatar-row                                            | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/data-display/contacts-list                                         | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/data-table                                            | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/expense-category-group                                | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/expense-line-item                                     | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/icon/action-bar                                       | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/data-display/icon/giselle                                          | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/data-display/icon/tech-strip                                       | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/data-display/news-feed-list                                        | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/progress-stats-list                                   | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/related-items-list                                    | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/data-display/selectable-label                                      | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/data-display/status-label                                          | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/feedback/section-pending-loader                                    | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/input/option-with-blurb                                            | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/input/toggle-icon-button                                           | material | ✅    | ✅     | ✅    | ❌          | ✅      | ✅           | ❌       |                                |
| material/layout/app-shell                                                   | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/layout/auth-page-layout                                            | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/layout/basic-section                                               | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/layout/page-header                                                 | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/layout/section-container                                           | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/layout/section-title                                               | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/layout/section-title/section-caption                               | material | ✅    | ✅     | ✅    | ✅          | ❌      | ❌           | ✅       |                                |
| material/layout/showcase-row                                                | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/navigation/app-sidebar                                             | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/navigation/app-top-bar                                             | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/navigation/breadcrumbs                                             | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/navigation/floating-control-bar                                    | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/navigation/floating-sub-nav                                        | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/navigation/floating-sub-nav/nav-pill                               | material | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ✅       | shipped, no README; no stories |
| material/navigation/floating-sub-nav/sub-nav-button                         | material | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| material/surfaces/card/accordion                                            | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/surfaces/card/balance-summary                                      | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/budget-breakdown                                     | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/cost-classification                                  | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/credit-card-display                                  | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/featured-item                                        | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/hero-banner                                          | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/metric                                               | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/surfaces/card/metric/metric-card-decoration                        | material | ✅    | ✅     | ✅    | ✅          | ❌      | ❌           | ❌       |                                |
| material/surfaces/card/period-summary                                       | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/profile-summary                                      | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/surfaces/card/promo-invite                                         | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/quick-transfer                                       | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/quote                                                | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/surfaces/card/roi-comparison                                       | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/card/selectable                                           | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/surfaces/card/stat                                                 | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| material/surfaces/card/stat-row                                             | material | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| material/surfaces/card/stat/stat-card-shape                                 | material | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| material/surfaces/details-drawer                                            | material | ❌    | ✅     | ❌    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| material/surfaces/scenario-comparison                                       | material | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion                                                                      | motion   | ❌    | ✅     | ❌    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/animated-tab-panel                                                   | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/breakdown-carousel-view                                              | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/breakdown-expanding-view                                             | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/breakdown-stacked-view                                               | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/budget-summary-drawer                                                | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/container                                                            | motion   | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| motion/expanding-period-strip                                               | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/floating-icon-cloud                                                  | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/floating-side-nav                                                    | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/hero-background                                                      | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/horizontal-scroll-rail                                               | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/interactive-hero-logo                                                | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/period-detail-sheet                                                  | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/section-title-animated                                               | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/use-scroll-parallax                                                  | motion   | ❌    | ✅     | ✅    | ✅          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/variants                                                             | motion   | ❌    | ❌     | ❌    | ✅          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/variants/actions                                                     | motion   | ❌    | ❌     | ❌    | ✅          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| motion/variants/bounce                                                      | motion   | ❌    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/container                                                   | motion   | ❌    | ❌     | ❌    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/fade                                                        | motion   | ❌    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/flip                                                        | motion   | ❌    | ❌     | ❌    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/rotate                                                      | motion   | ❌    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/scale                                                       | motion   | ❌    | ❌     | ❌    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/slide                                                       | motion   | ❌    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/variants/zoom                                                        | motion   | ❌    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| motion/viewport                                                             | motion   | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| motion/weekly-breakdown-page                                                | motion   | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| section/error                                                               | section  | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| section/faq/accordion                                                       | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/faq/accordion/accordion-svg                                         | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/faq/accordion/bottom-lines                                          | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/faq/accordion/motion-viewport                                       | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/faq/accordion/top-lines                                             | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/feature-flow                                                        | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/feature-flow/description-column                                     | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/feature-flow/highlight-carousel                                     | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/feature-flow/image-column                                           | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/feature-flow/item-detail                                            | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/feature-flow/item-row                                               | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/hero                                                                | section  | ❌    | ❌     | ❌    | ❌          | ❌      | ❌           | ❌       | index/types only               |
| section/hero/buttons-row                                                    | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/hero/interactive-logo                                               | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/hero/interactive-logo/artistic-logo-layer                           | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/hero/interactive-logo/original-logo-layer                           | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/hero/interactive-logo/portrait-layer                                | section  | ✅    | ❌     | ✅    | ❌          | ❌      | ❌           | ❌       | shipped, no README; no stories |
| section/hero/scroll-parallax                                                | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ❌       |                                |
| section/hero/scroll-parallax/animated-hero-heading                          | section  | ✅    | ✅     | ✅    | ✅          | ❌      | ❌           | ❌       |                                |
| section/hero/section                                                        | section  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| section/pricing                                                             | section  | ❌    | ✅     | ✅    | ❌          | ✅      | ❌           | ❌       | unbuilt scaffold               |
| theming/settings-provider                                                   | theming  | ✅    | ✅     | ✅    | ❌          | ✅      | ✅           | ✅       | no stories                     |
| theming/settings-provider/theme-and-settings-provider                       | theming  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
| theming/settings-provider/theme-and-settings-provider/settings-theme-bridge | theming  | ✅    | ✅     | ✅    | ❌          | ❌      | ❌           | ✅       | no stories                     |
| theming/theme-provider/giselle                                              | theming  | ✅    | ✅     | ✅    | ✅          | ✅      | ✅           | ✅       |                                |
