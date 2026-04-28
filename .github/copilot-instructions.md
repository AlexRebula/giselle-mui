# @alexrebula/giselle-mui — Copilot Instructions

This is an open-source React component library built on top of `@mui/material` v7.
It is authored by Alex Rebula and licensed MIT.

## What this library is

A set of small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions so consumers don't have to rediscover them. Every component
in this library exists because it solves a recurring problem that is either:

- easy to get wrong (e.g. `Paper onClick` vs `ButtonBase` for keyboard accessibility), or
- non-trivial to implement correctly with MUI alone (e.g. icon baseline gaps, CSS-var color tinting)

## Stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*` not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — the only allowed icon peer dependency)
- Vitest + jsdom for unit tests
- Storybook for visual development and autodoc

## Component rules (non-negotiable)

1. **Zero proprietary dependencies.** Only `react`, `react-dom`, `@mui/material`,
   `@emotion/react`, `@emotion/styled`, and `@iconify/react` are allowed as
   peer/direct dependencies.

2. **`sx` array spread on root element.** Always:
   `sx={[baseStyles, ...(Array.isArray(sx) ? sx : [sx])]}`.

3. **`...other` spread on root element.** Enables `data-*`, `aria-*`, `id`,
   `className` without prop drilling.

4. **Only own props get JSDoc.** Never redeclare or document props inherited from
   MUI interfaces. TypeScript inheritance carries MUI's own descriptions into
   Storybook autodoc automatically.

5. **ReactNode slots for icons and decoration.** Components never import an icon
   library internally. Accept `icon?: ReactNode` and let the consumer fill it.

6. **`color` prop follows MUI palette key convention.**
   `'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error'`
   with `@default 'primary'`.

7. **Decorative elements carry `aria-hidden`.** Quote marks, separator dots,
   background shapes.

8. **No hardcoded hex or rgba literals.** Use `theme.vars.palette[color].mainChannel`
   for tints.

## File structure per component

```
src/components/<name>/
  <name>.tsx     — component + exported Props interface
  index.ts       — barrel: re-exports component and types
  README.md      — why it exists, why it belongs here, design decisions, library safety
  <name>.test.ts — Vitest unit tests
```

## Test conventions

- File extension must be `.test.ts` (not `.tsx`) — vitest config uses `include: ['src/**/*.test.ts']`
- Add `// @vitest-environment jsdom` at top of every test file
- Use `React.createElement` (not JSX) — avoids JSX transform requirement in `.ts` files
- Use `renderToStaticMarkup` for structure/ARIA tests
- Use `ReactDOM.createRoot` + `act` for interaction/click tests
- Mock all MUI components that have `theme.vars` in sx callbacks (MUI v7 CSS vars
  require `CssVarsProvider` which is not available in tests without the full theme setup)

## What Copilot should help build

- New components following all rules above
- Unit tests using the established Vitest patterns
- Storybook Stories with `argTypes: { control: false }` for `ReactNode` and `SxProps` slots
- README files: Why it exists → Why it belongs here → Design decisions → Library safety → File structure → Related
- Barrel index updates when new components are added

When asked to add a component, always verify: does this encode a non-obvious decision
that saves every consumer from rediscovering it? If not, it should not be in this library.

## Tone rule for docs and comments

Do not over-mention Minimals in this package's docs. `giselle-mui` has already credited
Minimals where appropriate. Repeating it in every doc dilutes the identity of this
library as its own thing. When updating or writing docs:

- Do not name-drop Minimals unless directly explaining a credit, a hard constraint,
  or a copyright boundary.
- Do not frame utilities or patterns as "what Minimals does" — describe what the
  utility does, independently.
- The one-liner `varAlpha` helper is a standard MUI v7 pattern; it does not need
  to be attributed to any theme kit every time it appears.

## Session bootstrap: where Copilot should look first

At the start of every new Copilot session in this package, read these files:

| File | Purpose |
|------|---------|
| [`docs/theming-roadmap.md`](../docs/theming-roadmap.md) | Phase A (theme utilities), Phase B (base theme), Phase C (ThemeProvider) — next planned work |
| [`docs/timeline-component-plan.md`](../docs/timeline-component-plan.md) | Full plan for `RoadmapTimeline` — next component to build |
| [`docs/theming-nextjs.md`](../docs/theming-nextjs.md) | How to wire this library into a Next.js app |

### Current components (shipped)

| Component | File | Status |
|-----------|------|--------|
| `GiselleIcon` | `src/components/giselle-icon/` | ✅ Shipped + tested |
| `MetricCard` + `MetricCardDecoration` | `src/components/metric-card/` | ✅ Shipped + tested |
| `QuoteCard` | `src/components/quote-card/` | ✅ Shipped — two-column layout refactor pending |
| `SelectableCard` | `src/components/selectable-card/` | ✅ Shipped + tested |
| `createIconRegistrar` | `src/utils/create-icon-registrar.ts` | ✅ Shipped + tested |

### Next planned work (priority order)

1. **QuoteCard two-column layout** — structural JSX fix, no new props. `src/components/quote-card/quote-card.tsx`.
2. **Storybook stories** — `MetricCard.stories.tsx`, `GiselleIcon.stories.tsx`, `SelectableCard.stories.tsx`, `QuoteCard.stories.tsx`. Use `argTypes: { control: false }` for `ReactNode`/`SxProps` slots.
3. **Phase A theme utilities** — `varAlpha`, `createPaletteChannel`, `pxToRem` / `remToPx` in `src/utils/`. See `docs/theming-roadmap.md` Phase A table.
4. **RoadmapTimeline component** — requires Phase A first. Full plan in `docs/timeline-component-plan.md`. Uses `@mui/lab` Timeline primitives (acceptable peer dep).
5. **Phase C ThemeProvider** — `GiselleThemeProvider` wrapping `CssVarsProvider`. See `docs/theming-roadmap.md` Phase C.

### Additional allowed peer dependencies

- `@mui/lab` — needed for Timeline primitives (`Timeline`, `TimelineItem`, `TimelineSeparator`, etc.). Acceptable under the zero-proprietary-dependencies rule.

---

## Code quality standards (enforce proactively — do not wait to be asked)

### Cognitive complexity

SonarQube enforces a limit of **15** per function. Any callback inside `.map()` or `.forEach()` that has conditional logic, nested branches, or derived values is at risk.

**When to run `sonarqube_analyze_file`:**

- When a session opens on a component file that has open tasks — run it immediately, before any other work.
- After every edit to a component file — run it again to confirm no new violations were introduced.
- Before marking any task complete — must show zero violations.

**How to fix:** Extract per-item logic into a named helper function. The render callback itself should only compose already-computed values into JSX. Regex patterns with long alternation groups (e.g. 12-way month names) count toward complexity — prefer a broad pattern + JS validation instead.

### Memoization

Any value or function inside a component that is:

- derived from props/state, or
- passed as a prop to a child, or
- used as a `useEffect` dependency

...must be wrapped in `useMemo` / `useCallback` unless it is a primitive literal. Inline arrow functions inside `.map()` callbacks that are passed as props to children must be extracted to named `useCallback` handlers defined before the return statement.

### JSDoc

Every exported component function and every exported prop interface must have JSDoc. Storybook autodoc generates prop tables from TypeScript types but will not show a component-level description or usage notes without JSDoc on the function itself.

- JSDoc goes on the exported function, not just the Props type.
- Only document own props — never redeclare props inherited from MUI interfaces (rule 4). TypeScript inheritance carries MUI's own JSDoc into autodoc automatically.

### Component folder structure rule

A component gets its own subfolder (`src/components/<name>/`) **only when it is exported from `src/index.ts`** (independently usable by consumers).

Internal sub-components — helpers, local wrappers, private building blocks that only make sense inside their parent — stay flat in the parent's folder. Creating a subfolder for an internal component implies it is independently usable; that false signal causes confusion during refactors.

### Storybook story decision rule

A Storybook story file is created **only when seeing the component in isolation answers a question a developer would actually ask when deciding to use it**.

**Evaluation checklist before writing a story:**

1. Is the component exported from `src/index.ts` (independently usable)? If no — `.md` only.
2. Does isolation reveal something invisible in a full parent context (variant comparison, state matrix, light/dark mode switch)? If no — `.md` only.
3. Does a developer need to see this to choose how to use it? If no — `.md` only.

Use `argTypes: { control: false }` for `ReactNode` and `SxProps` slots. Every story that demonstrates colour variants must include all six palette keys: `primary`, `secondary`, `info`, `success`, `warning`, `error`.

### Preferred `.dataset` over `getAttribute` in tests

Use `element.dataset['camelKey']` rather than `element.getAttribute('data-kebab-key')` in test files. Sonar flags `getAttribute` as a code smell when `.dataset` is available.

