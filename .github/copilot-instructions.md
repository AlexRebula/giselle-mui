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

0. **Zero personal data.** Stories, tests, JSDoc examples, and README code snippets must
   never contain real names (people, clients, employers), real project names, or any content
   derived from the `alexrebula` portfolio. Use generic placeholders:
   authors → `'Jane Smith'`, sources/projects → `'Platform Team'`, metrics → `'20+'` / `'of experience'`.
   Violating this rule exposes private career data in a public MIT-licensed repository.

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

4a. **JSDoc must use Markdown formatting.** Storybook autodoc renders JSDoc descriptions
    as Markdown. Use `**bold**`, `- ` bullet lists, and fenced code blocks (` ```tsx `).
    Never use bare indented code lines — they do not render as code blocks in Markdown.
    `@example` tags are rendered separately as code snippets and remain plain JSX/TSX.

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
| [`docs/theming/roadmap.md`](../docs/theming/roadmap.md) | Phase A (theme utilities), Phase B (Giselle brand palette), Phase C (GiselleThemeProvider) — next planned work |
| [`docs/components/timeline-plan.md`](../docs/components/timeline-plan.md) | Full plan for `RoadmapTimeline` — next component to build |
| [`docs/theming/nextjs.md`](../docs/theming/nextjs.md) | How to wire this library into a Next.js app |

### Current components (shipped)

| Component | File | Status |
|-----------|------|--------|
| `GiselleIcon` | `src/components/giselle-icon/` | ✅ Shipped + tested |
| `MetricCard` + `MetricCardDecoration` | `src/components/metric-card/` | ✅ Shipped + tested |
| `QuoteCard` | `src/components/quote-card/` | ✅ Shipped + tested |
| `SelectableCard` | `src/components/selectable-card/` | ✅ Shipped + tested |
| `createIconRegistrar` | `src/utils/create-icon-registrar.ts` | ✅ Shipped + tested |
| `TimelineTwoColumn` | `src/components/timeline-two-column/` | ✅ Shipped + tested |

### Next planned work (priority order)

1. **Phase A theme utilities** — `varAlpha`, `createPaletteChannel`, `pxToRem` / `remToPx` in `src/utils/`. Prerequisite for Phase B and C. See `docs/theming/roadmap.md` Phase A table.
2. **Phase B — Giselle brand theme preset** — define the Giselle green + amber palette as `giselleTheme` using `extendTheme()`. Export from `src/index.ts`. See `docs/theming/roadmap.md` Phase B.
3. **Phase C — `GiselleThemeProvider`** — wraps `CssVarsProvider` with the Giselle default palette. Zero-config usage. Accepts `themeOverrides` for partial overrides and `theme` for full bypass. See `docs/theming/roadmap.md` Phase C.
4. **Storybook story polish** — Remaining: MetricCard notes panel, responsive `sx` demo in GiselleIcon.
5. **RoadmapTimeline component** — requires Phase A first. Full plan in `docs/components/timeline-plan.md`. Uses `@mui/lab` Timeline primitives (acceptable peer dep).

### Additional allowed peer dependencies

- `@mui/lab` — needed for Timeline primitives (`Timeline`, `TimelineItem`, `TimelineSeparator`, etc.). Acceptable under the zero-proprietary-dependencies rule.

---

## Quality gate

All six checks must pass before every push:

```sh
npm run check         # auto-fix Prettier + ESLint, then verify all
npm run check:verify  # verify only (same as CI / pre-push hook)
```

Checks (in order): Prettier → ESLint → `tsc --noEmit` → Vitest → tsup build → Storybook build

- **Storybook build** runs in CI (`CI=true`) and is also part of the pre-push hook (`--storybook` flag).
  Broken stories are caught before any code reaches `main`.
- **tsup build** verifies the published package compiles and tree-shakes cleanly — not just types.
- Pre-push hook wired via `.githooks/pre-push` + `scripts/setup-hooks.js` (runs on `postinstall`).
- GitHub Actions CI defined in `.github/workflows/ci.yml`.

### Storybook infrastructure

- Config: `.storybook/main.ts` (react-vite builder) + `.storybook/preview.tsx` (wraps stories in `CssVarsProvider`)
- Stories live co-located with their component: `src/components/<name>/<name>.stories.tsx`
- Every story file must pass `tsc --noEmit`, ESLint, and Prettier — they are in `src/` and covered by all checks
- Named component helpers (e.g. `function ToggleDemo()`) must be used whenever a story render function uses React hooks — anonymous arrow functions inside `render:` violate the `react-hooks/rules-of-hooks` ESLint rule

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

Every exported component must have a `Responsive` story that renders the component inside labeled containers at each MUI standard breakpoint width: xs (360px), sm (600px), md (900px), lg (1200px). Use `parameters: { layout: 'padded' }` on these stories. For grid-based components (cards in a collection), the column count should increase with width. Named component helpers are required when the story uses React hooks.

### Preferred `.dataset` over `getAttribute` in tests

Use `element.dataset['camelKey']` rather than `element.getAttribute('data-kebab-key')` in test files. Sonar flags `getAttribute` as a code smell when `.dataset` is available.

---

## MUI Store quality bar (enforce always — not just before submission)

These rules come directly from the MUI Store submission requirements
(`https://support.mui.com/hc/en-us/articles/11440613164444`). They are development
standards, not pre-submission checklists. Every component must comply from the moment
it is written. Full research and codebase risk analysis: `alexrebula/docs/giselle-premium/02-quality-bar.md`.

### Do not use `React.FC`

Use plain function declarations. `React.FC` is redundant, adds implicit `children` typing
baggage, and is explicitly banned by the MUI Store quality bar.

```tsx
// ❌ wrong
const MyComponent: React.FC<MyProps> = ({ foo }) => { ... }

// ✅ correct
function MyComponent({ foo }: MyProps) { ... }
```

**Enforcement:** Any new component using `React.FC` must be refactored before merge.

### Do not use `<Box>` without using its props

If a JSX element has no props — not even `sx` — use a raw `<div>` (or `<span>`, `<section>`,
etc.) instead. `<Box>` is only justified when you are actively using at least one of its
MUI-specific props (`sx`, `component`, `ref`, or shorthand layout props like `display`).

```tsx
// ❌ wrong — Box adds runtime cost but provides nothing
<Box>
  <Typography>Hello</Typography>
</Box>

// ✅ correct — plain div when no Box props are needed
<div>
  <Typography>Hello</Typography>
</div>

// ✅ correct — Box justified because sx is used
<Box sx={{ display: 'flex', gap: 2 }}>
  <Typography>Hello</Typography>
</Box>
```

**Before every PR:** run the following to catch bare Box usage:
```sh
grep -rn "<Box[^/]*>" src/ | grep -v "sx=\|component=\|className=\|ref=\|aria-\|data-\|display="
```

### Use `shouldForwardProp` on every reusable `styled()` component

If a component uses `styled()`, it **must** declare `shouldForwardProp` to prevent custom
props from leaking into the DOM.

```tsx
// ❌ wrong — custom prop leaks to DOM → React warning + Sonar violation
const StyledDiv = styled('div')<{ active: boolean }>`
  color: ${({ active }) => active ? 'red' : 'black'};
`;

// ✅ correct
const StyledDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  color: ${({ active }) => active ? 'red' : 'black'};
`;
```

Currently: zero `styled()` components in this library. This rule fires the moment the
first one is introduced.

### Icon imports: one level deep (not from package root)

Import from `@iconify/react`, not from any `@iconify-json/*` path or the icon package root
without the module specifier. This is already the correct pattern in this library — do not
deviate.

```tsx
// ✅ correct
import { Icon } from '@iconify/react';

// ❌ wrong — root import of full icon set
import allIcons from '@iconify/json';
```

### No source maps in the distributed build

`sourcemap: true` is acceptable in `tsup.config.ts` for the open-source library (developers
debugging against source). But any **premium or production distribution** build must set
`sourcemap: false`. MUI Store ToS §9 explicitly prohibits distributing source maps.

This does **not** require changing the current `tsup.config.ts` today. It is a hard
constraint on the future premium template's separate build config.

### Browser support targets

All components must work in — and must not use APIs or CSS features unavailable in — the
following minimum versions:

| Browser | Minimum |
|---------|---------|
| Chrome | ≥ 121 |
| Firefox | ≥ 121 |
| Edge | ≥ 117 |
| Safari (macOS + iOS) | ≥ 17.0 |

This matches the MUI Core supported browser matrix. Do not use CSS features, JS APIs, or
DOM behaviour that falls outside these targets.

### Images and SVGs

- No low-resolution raster images. Any raster asset must look sharp at >200 PPI.
- SVG files must be optimised — no verbose metadata, no inline raster data.
- If SVGs are added to Storybook or a demo app, run them through `svgo` before committing.

