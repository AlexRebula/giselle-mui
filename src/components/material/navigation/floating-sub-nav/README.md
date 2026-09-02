# FloatingSubNav

## Why it exists

A floating pill of icon-only navigation buttons is a recurring pattern in portfolio and product
pages: a compact secondary nav that stays visible while the user scrolls through a long section.
Getting the positioning right — fixed-to-viewport vs. sticky-to-container, `height: 0` anchor
trick, `pointer-events` restoration — is non-trivial. `FloatingSubNav` encodes those decisions
once.

## Why it belongs here

Any project that uses section-based layouts needs a way to expose in-page navigation without
taking up layout space. The positioning logic (`translateY(-100%)` sticky anchor, fixed centring)
is reusable and would otherwise be rediscovered — incorrectly — in every consumer app.

## Design decisions

- **`sticky={false}` default → `position: fixed`** — the most common case is a global nav
  that stays at the bottom of the viewport regardless of where the user is on the page.
- **`sticky={true}` → `position: sticky` with zero-height anchor** — the outer Box has
  `height: 0; overflow: visible` so it occupies no layout space. The inner Box uses
  `translateY(-100%)` to float the pill above the anchor point. This is the only CSS technique
  that achieves sticky-to-container without a dedicated spacer element.
- **`activeId={null}` hides the nav** — the parent is the single source of truth for visibility.
  The component does not maintain its own show/hide state; it animates out via `AnimatePresence`.
- **Icon slot is `ReactNode`** — the component never imports an icon library. Consumers choose
  their own icon set and pass rendered nodes.
- **`framer-motion` subpath** — `FloatingSubNav` is exported from `src/motion-index.ts`
  (the `/motion` subpath entry) because it depends on `AnimatePresence`. It is not in the main
  bundle so consumers who don't use framer-motion do not pay for it.

## Touch target

Button sizes (`SUB_NAV_BUTTON_SIZE`) are exported as named constants and exceed the WCAG 2.2 AA
minimum touch target (24 px) at all breakpoints (xs: 36 px → lg: 44 px). Regression tests in
`sub-nav-button/sub-nav-button.styles.test.ts` verify this.

## Library safety

- Zero personal data. No proprietary imports.
- `framer-motion` is used only here — contained in the `/motion` subpath entry.
- Icon slot is `ReactNode` — no icon library bundled.

## File structure

```
floating-sub-nav/
  floating-sub-nav.tsx              — composition
  floating-sub-nav.styles.ts        — stickyWrapperSx, stickyInnerSx, fixedWrapperSx
  floating-sub-nav.styles.test.ts   — styles tests for the wrapper sx above
  floating-sub-nav.test.ts          — Vitest unit tests
  floating-sub-nav.stories.tsx      — Fixed, Sticky, Hidden, Responsive
  types.ts                          — FloatingSubNavProps, FloatingSubNavItem
  index.ts                          — barrel
  README.md                         — this file
  nav-pill/                         — internal NavPill sub-component (own subfolder)
  sub-nav-button/                   — internal SubNavButton sub-component (own subfolder)
```

## Breaking change — PR #67 (21 May 2026)

`FloatingSubNav` was moved from the main bundle (`src/index.ts`) to the `/motion` subpath
entry (`src/motion-index.ts`) to keep `framer-motion` opt-in for all consumers.

**Update your import:**

```ts
// Before (no longer works)
import { FloatingSubNav } from '@littlebranches/giselle-mui';

// After
import { FloatingSubNav } from '@littlebranches/giselle-mui/motion';
```

---

## Related

- `SectionContainer` — the outer shell used to constrain section content. `FloatingSubNav` can
  be rendered inside a `SectionContainer` with `sticky={true}` to pin the nav to that section.

## Quality status — 02 Sep 2026

| Dimension              | Score | Open items |
| ---------------------- | ----- | ---------- |
| DoD (Scenario B)       | 20/22 | SonarQube not verified (no SonarQube tooling in this repo) · no ...other spread on root |
| Best practices         | not re-audited | private 13-item rubric not available in this repo |
