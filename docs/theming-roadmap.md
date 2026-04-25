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

### Phase B — Base theme preset (Low priority)

**Goal:** Provide an optional starter theme for projects that do not want to define
all their own tokens from scratch.

| Task | Status |
| --- | --- |
| Define a `baseTheme` preset in `giselle-mui` (neutral, no branding) | ⬜ |
| Document how to extend the base theme with project-specific tokens | ⬜ |

### Phase C — ThemeProvider component (Medium priority)

**Goal:** Expose a `<ThemeProvider>` wrapper from `giselle-mui` that consuming Next.js
apps can use directly, without having to wire up `CssVarsProvider` + `extendTheme` themselves.

**Critical principle — theme variables come from the consumer, not giselle-mui:**

`giselle-mui` provides the logic and the TypeScript types.
The consumer (Next.js app / client) is responsible for providing the token data:
colour palette, typography scale, spacing, shadows.

This mirrors the sections-api principle exactly:
- components receive typed props; they never hardcode data
- `ThemeProvider` receives typed token objects; it never hardcodes colour values

```ts
// Consumer provides tokens:
<GiselleThemeProvider palette={clientPalette} typography={clientTypography}>
  <App />
</GiselleThemeProvider>

// giselle-mui provides the types:
export interface GiselleThemePalette { primary: string; ... }
```

| Task | Status |
| --- | --- |
| Define `GiselleThemePalette` and `GiselleThemeTypography` interfaces | ⬜ |
| Implement `GiselleThemeProvider` using `CssVarsProvider` + `extendTheme` | ⬜ |
| Add Storybook story that tests `GiselleThemeProvider` with a real token set | ⬜ |
| Document the "token data from consumer" principle in `theming-nextjs.md` | ⬜ |

**Storybook note:** Storybook in `giselle-mui` must be able to test two things:
1. MUI wrapper components (existing) — isolated, styled via a test theme
2. `GiselleThemeProvider` — with a real MUI `CssVarsProvider` setup and sample token data

The sample token data used in Storybook must be generic test data defined in `giselle-mui` itself
(no imports from `alexrebula` or any client project). This is analogous to the
`giselle-sections-sdk/src/samples/` pattern.

---

## Corresponding alexrebula milestone

See [alexrebula `docs/roadmap.md`](../../rm/presentation/alexrebula/docs/roadmap.md)
for the milestone tracking the removal of `minimal-shared/utils` imports from
`alexrebula/src/theme/`.
