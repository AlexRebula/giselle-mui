# @alexrebula/giselle-mui

Small, focused MUI wrapper components that encode non-obvious design and
accessibility decisions — so consumers don't have to rediscover them.

Built on `@mui/material` v7 (CSS variables mode). TypeScript-first. MIT licensed.

> **License independence:** This library is **MIT licensed**. Its only dependencies are `@mui/material` and `@iconify/react`, which are both open-source packages published under the Apache 2.0 license — not any commercial theme or kit. No code has been copied or derived from any proprietary theme. Every component is an original work. See [LICENSE](./LICENSE).

---

## Status

> **Beta — active development. Not yet published to npm.**
>
> The API is stable and all 52 unit tests pass. The package is fully built and tested locally.
> First public npm release is planned alongside the portfolio site launch (May/June 2026).
> Feedback and issues are welcome on [GitHub](https://github.com/AlexRebula/giselle-mui/issues).

Test coverage is functional and growing. The current suite covers component structure,
prop forwarding, ARIA semantics, and interaction behaviour. Coverage of edge cases and
visual logic (which requires a full MUI theme provider) is tracked in the component
READMEs and expanded with each release. Contributions and issue reports are welcome.

**The test suite will receive a full review and overhaul before the first npm publish.**
This includes edge-case coverage, negative assertion quality, and any gaps identified
during pre-release review. No package ships to npm until the tests meet the same
standard as the implementation.

Until the package is on npm, use it from disk — see [Local development](#local-development).

---

## ⚠️ ThemeProvider requirement

These components are built on **MUI v7 CSS variables mode**. They require a
`CssVarsProvider` (or equivalent MUI theme provider) somewhere above them in the React tree.

Without a theme provider, `theme.vars.*` CSS custom properties are not injected, and
**components will render without meaningful colours or styles** — buttons without borders,
cards without backgrounds, icons without tint.

This is intentional: the library delegates theme ownership to the consuming application,
so it can integrate into any existing MUI theme without conflict.

**Minimal setup:**

```tsx
import { CssVarsProvider, extendTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = extendTheme();

export function App() {
  return (
    <CssVarsProvider theme={theme}>
      <CssBaseline />
      <YourApp />
    </CssVarsProvider>
  );
}
```

Full integration guides:

- [React — Vite / CRA](./docs/theming-react.md)
- [Next.js — App Router + Pages Router](./docs/theming-nextjs.md)

---

## Components

| Component | Description |
|---|---|
| `GiselleIcon` | `@iconify/react` wrapper with full MUI `sx` support. Fixes the `Box component={ThirdParty}` TypeScript pitfall. See [icon registration](#giselleicon-and-icon-registration). |
| `createIconRegistrar` | Utility to pre-register icons offline — no CDN flicker, works in any framework. |
| `MetricCard` | Stat card — value + label + icon slot + decoration slot. Zero icon-library dependency. |
| `MetricCardDecoration` | Companion decoration fill for `MetricCard`. |
| `SelectableCard` | Accessible clickable card built on `ButtonBase`. Correct `aria-pressed` semantics, keyboard support, and focus ring out of the box. |
| `QuoteCard` | Testimonial/pull-quote card with CSS-var color tinting and conditional attribution row. |

Every component exists because it solves a recurring problem that is either easy to get wrong
or non-trivial to implement correctly with MUI alone. Each component folder includes a
`README.md` with the full design rationale, accessibility decisions, and library-safety notes.

---

## Install

> **Not yet published to npm.** This will work after the package is released.

```bash
npm install @alexrebula/giselle-mui
```

Peer dependencies (install separately if not already in your project):

```bash
npm install @mui/material @emotion/react @emotion/styled react react-dom
```

Optional — only required if you use `GiselleIcon`:

```bash
npm install @iconify/react
```

> **Icon registration required.** `GiselleIcon` renders from the `@iconify/react` store.
> Without pre-registration, icons load from the Iconify CDN — causing visible flicker.
> See [GiselleIcon and icon registration](#giselleicon-and-icon-registration) below.

---

## Usage

```tsx
import {
  GiselleIcon,
  MetricCard,
  MetricCardDecoration,
  SelectableCard,
  QuoteCard,
} from '@alexrebula/giselle-mui';

// Wrap your app in CssVarsProvider — see docs/theming-react.md for full setup
<MetricCard
  value="20+"
  label="Years"
  sublabel="front-end, since 2005"
  color="primary"
  icon={<GiselleIcon icon="solar:clock-circle-bold-duotone" width={36} />}
  decoration={<MetricCardDecoration color="primary" />}
/>
```

---

## GiselleIcon and icon registration

`GiselleIcon` renders icons from the `@iconify/react` module-level store. That store is
**empty by default**. If you don't pre-load it, `@iconify/react` falls back to the
Iconify CDN — icons load after a network round-trip and flicker visibly on first render.

### Online (CDN) — zero setup, not production-ready

Icon names from the [Iconify catalogue](https://icon-sets.iconify.design/) load
automatically with no configuration. Works in **any framework**. Acceptable for
prototyping; not suitable for production.

```tsx
// Works immediately — icons fetched from CDN on demand
<GiselleIcon icon="solar:rocket-bold-duotone" />
```

### Offline registration — recommended for production

Use `createIconRegistrar` to bundle icon SVG bodies directly in your JS output.
No CDN, no flicker, works in **any framework**.

```ts
// src/icon-sets.ts
import { createIconRegistrar } from '@alexrebula/giselle-mui';

export const registerIcons = createIconRegistrar({
  'solar:rocket-bold-duotone': {
    body: '<path fill="currentColor" d="..." />',
  },
  'logos:typescript-icon': {
    width: 256, height: 256,  // logos: icons need explicit dims — see README
    body: '<path fill="#3178c6" d="..." />',
  },
});
```

Then call `registerIcons()` at module level before React renders:

- **Vite / CRA** — call it in `src/main.tsx` before `createRoot`
- **Next.js App Router** — call it at module level inside a `'use client'` component mounted in root layout
- **Next.js Pages Router** — call it in `pages/_app.tsx`

Full setup guide (framework examples, viewBox rules, monorepo caveats):
→ [GiselleIcon README](./src/components/giselle-icon/README.md)
→ [docs/iconify-registration.md](./docs/iconify-registration.md)

---

## Tech stack

- React 18+ with TypeScript — strict mode, no `any`
- `@mui/material` v7 (CSS variables mode — `theme.vars.palette.*`, not `theme.palette.*`)
- `@iconify/react` for icons (Apache 2.0 — only allowed icon peer dependency)
- Vitest + jsdom for unit tests (52 passing)
- Storybook for visual development and autodoc (coming)

---

## Local development

```bash
git clone git@github.com:AlexRebula/giselle-mui.git
cd giselle-mui
npm install
npm run typecheck
npm test
npm run build
```

To use the package from disk in a consuming app before it is published:

```json
// your-app/package.json
"@alexrebula/giselle-mui": "file:../path/to/giselle-mui"
```

Run `npm install` in the consuming app once to create the symlink in `node_modules/`.
TypeScript changes in `src/` are picked up immediately — no rebuild needed for types.
Re-run `npm install` only if you change `package.json` (e.g. add a new export entry).

---

## Roadmap

- [x] GiselleIcon, MetricCard, SelectableCard, QuoteCard — all with unit tests + READMEs
- [ ] Storybook stories for all components
- [ ] Published to npm (alongside portfolio launch, May/June 2026)
- [ ] Additional components extracted from portfolio patterns
- [ ] Storybook deployed as public documentation site

---

## Part of the Giselle UI ecosystem

| Package | Description | Status |
|---|---|---|
| `@alexrebula/giselle-mui` | MUI wrapper components (this package) | Beta |
| `@alexrebula/giselle-ui` | Framework-agnostic component primitives | Beta |
| `@alexrebula/giselle-sections-sdk` | Typed section data contracts for portfolio/product sites | Beta |

All packages are in active development and will be published together.

---

## License

MIT — see [LICENSE](./LICENSE).

---

Made with ❤️ by [Alex Rebula](https://github.com/AlexRebula)
