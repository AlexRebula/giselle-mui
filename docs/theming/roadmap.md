---
sidebar_position: 3
sidebar_label: 'Roadmap'
---

# Theming Roadmap

> This file tracks the current state of the theming layer in `@alexrebula/giselle-mui`
> and the work remaining to make the theme fully self-contained for consuming projects.

---

## Current state

`@alexrebula/giselle-mui` uses only standard MUI v7 APIs to set up its theme:

```ts
import { extendTheme, CssVarsProvider } from '@mui/material/styles';
```

There are zero external theme utility imports in this package.
See [`theming-nextjs.md`](./theming-nextjs.md) for the recommended setup in a new project.

---

## Theme utilities

A few small helpers are commonly needed when building MUI v7 themes — most notably
`varAlpha` for CSS variable–based colour tints. Until Phase A ships these in `giselle-mui`,
you can write them inline:

```ts
// varAlpha — channel: space-separated RGB string, e.g. "99 102 241"; alpha: 0–1
export const varAlpha = (channel: string, alpha: number) =>
  `rgba(${channel.replace(/ /g, ', ')}, ${alpha})`;
```

Phase A of this roadmap will export these as named utilities from `giselle-mui/src/utils/`.

---

## Roadmap for giselle-mui

### Phase A — Ship standalone theme token utilities (Medium priority)

**Goal:** Ship the small theme-building primitives needed by any MUI v7 project
as named exports from `giselle-mui`, so consuming projects have them out of the box.

| Task | Status |
| --- | --- |
| Add `varAlpha(channel, alpha)` to `giselle-mui/src/utils/` | ⬜ |
| Add `createPaletteChannel(hex)` to `giselle-mui/src/utils/` | ⬜ |
| Add `pxToRem(px)` and `remToPx(rem)` to `giselle-mui/src/utils/` | ⬜ |
| Export all theme utilities from `giselle-mui/src/index.ts` | ⬜ |
| Add tests for all theme utilities | ⬜ |
| Update `theming-nextjs.md` to show usage from giselle-mui | ⬜ |

### Phase B — Giselle brand theme preset (Medium priority)

**Goal:** Define the Giselle default palette and typography scale as a named export
(`giselleTheme`) — a ready-to-use `extendTheme()` result that consuming projects can
import directly, extend, or ignore in favour of their own palette.

The default palette is the Giselle brand identity:

- **Primary:** Giselle green — a saturated, accessible green (exact hex TBD at build time)
- **Secondary:** Giselle amber — a warm yellow/amber accent

This is intentionally opinionated. A consumer who wants a different palette passes overrides
(see Phase C). A consumer who wants the Giselle look gets it out of the box with zero config.

| Task | Status |
| --- | --- |
| Decide final hex values for `primary` and `secondary` Giselle palette colours | ⬜ |
| Define `giselleTheme` using `extendTheme()` with the Giselle palette | ⬜ |
| Ensure all six palette keys are covered: `primary`, `secondary`, `info`, `success`, `warning`, `error` | ⬜ |
| Export `giselleTheme` from `giselle-mui/src/index.ts` | ⬜ |
| Document the palette decisions in `theming-nextjs.md` | ⬜ |

### Phase C — GiselleThemeProvider component (HIGH priority)

**Goal:** Expose a `<GiselleThemeProvider>` wrapper from `giselle-mui` that:

1. Ships with the Giselle brand theme (Phase B) as the default — zero-config usage
2. Accepts a `themeOverrides` prop for consumers who want a different palette, typography, or spacing
3. Accepts a `theme` prop for consumers who want to bypass the defaults entirely and pass their own `extendTheme()` result

This is the DX goal:

```tsx
// Zero config — uses Giselle green + amber palette
<GiselleThemeProvider>
  <App />
</GiselleThemeProvider>

// Consumer overrides specific tokens — still wraps in CssVarsProvider correctly
<GiselleThemeProvider themeOverrides={{ palette: { primary: { main: '#1976d2' } } }}>
  <App />
</GiselleThemeProvider>

// Fully custom — consumer owns the full theme
<GiselleThemeProvider theme={extendTheme(myThemeInput)}>
  <App />
</GiselleThemeProvider>
```

**Design principle — sensible defaults, easy to override:**

The previous plan required consumers to provide all tokens. This created too much friction for
the zero-config case. The revised design ships a real default so consumers can try the library
immediately without any theme configuration.

**What it wraps:**

```tsx
// Internal implementation shape (simplified)
import { CssVarsProvider, extendTheme } from '@mui/material/styles';
import { giselleTheme } from '../utils/theme-preset';

function GiselleThemeProvider({ children, themeOverrides, theme }: Props) {
  const resolvedTheme = theme ?? extendTheme(merge(giselleTheme, themeOverrides ?? {}));
  return <CssVarsProvider theme={resolvedTheme}>{children}</CssVarsProvider>;
}
```

| Task | Status |
| --- | --- |
| Complete Phase B (Giselle theme preset) — this is a direct prerequisite | ⬜ |
| Define `GiselleThemeProviderProps` interface (`children`, `themeOverrides?`, `theme?`) | ⬜ |
| Implement `GiselleThemeProvider` wrapping `CssVarsProvider` with merge logic | ⬜ |
| Export `GiselleThemeProvider` from `giselle-mui/src/index.ts` | ⬜ |
| Add Storybook story: default palette, with overrides, fully custom | ⬜ |
| Add Vitest test: renders correctly, passes `data-mui-color-scheme` to DOM | ⬜ |
| Update `theming-nextjs.md` with the new zero-config usage pattern | ⬜ |

**Storybook note:** Storybook in `giselle-mui` must be able to test two things:
1. MUI wrapper components (existing) — isolated, styled via a test theme
2. `GiselleThemeProvider` — with the default Giselle palette, with overrides, and with a
   fully custom theme. All three modes must have a story.

Sample token data used in Storybook stories must be defined in `giselle-mui` itself —
no imports from `alexrebula` or any client project.

**This is the foundational prerequisite for:**
- Writing authoritative dev.to articles about MUI v7 CSS variables (`GiselleThemeProvider` is the worked example)
- The premium template (the template's look is the default Giselle palette, consumers override it)
- Replacing `minimal-shared/utils` in the portfolio's theme setup

---

## Corresponding alexrebula milestone

See [alexrebula `docs/roadmap.md`](../../rm/presentation/alexrebula/docs/roadmap.md)
for the milestone tracking the removal of `minimal-shared/utils` imports from
`alexrebula/src/theme/`.

---

### Phase D — GiselleSettingsProvider (Medium priority)

**Goal:** Export a framework-agnostic, MIT-safe `GiselleSettingsProvider<TState>` that
persists user UI preferences (color mode, direction, font size, color presets) with zero
proprietary dependencies. Enables consumers to migrate off the Minimals `SettingsProvider`
in a one-import swap.

**Prerequisite:** Phase C (GiselleThemeProvider) — the settings system drives the theme.

Full design: [`docs/components/settings-provider-plan.md`](../components/settings-provider-plan.md)

| Task | Status |
| ---- | ------ |
| Phase α: Port `useLocalStorage<T>` to `src/utils/use-local-storage.ts` | ⬜ |
| Phase α: Write `isDeepEqual(a, b)` — covers primitives, arrays, plain objects (no es-toolkit) | ⬜ |
| Phase α: Write `getCookieValue` / `setCookieValue` — SSR-safe (`typeof document !== 'undefined'`) | ⬜ |
| Phase α: Tests for all three utilities | ⬜ |
| Phase 1: Define `BaseSettingsState`, `GiselleSettingsContextValue<T>`, `GiselleSettingsProviderProps<T>` | ⬜ |
| Phase 1: Implement `GiselleSettingsProvider<T>` — localStorage by default, `initialState?` for SSR | ⬜ |
| Phase 1: Version check on mount — reset to defaults if stored version mismatches | ⬜ |
| Phase 1: Export `useGiselleSettings<T>()` hook | ⬜ |
| Phase 1: Storybook story — default, `setField`, `canReset`/`onReset`, drawer toggle | ⬜ |
| Phase 1: Vitest tests — render, `setField`, `canReset`, `onReset`, version mismatch reset | ⬜ |
| Phase 2: `storage: 'cookie'` option (client-side `document.cookie`) | ⬜ |
| Phase 2: `storage: StorageAdapter<T>` custom adapter | ⬜ |
| Phase 2: `detectGiselleSettings()` server helper (separate `/server` entrypoint) | ⬜ |
| Phase 3: `SettingsThemeBridge` — internal bridge wiring settings state into `GiselleThemeProvider` | ⬜ |
| Phase 3: `GiselleThemeAndSettingsProvider` convenience wrapper | ⬜ |
| Phase 3: Migration guide in README and `theming-nextjs.md` | ⬜ |

