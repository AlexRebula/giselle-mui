# GiselleThemeAndSettingsProvider

## Why it exists

Most consumers who want `GiselleSettingsProvider`'s persisted-settings behaviour also want the
color-mode field in that settings state (`mode: 'light' | 'dark' | 'system'`) to actually drive
MUI's theme. Wiring that by hand means composing `GiselleThemeProvider` and
`GiselleSettingsProvider` yourself and writing a `useEffect` that reads the settings state and
calls `useColorScheme().setMode` whenever it changes. `GiselleThemeAndSettingsProvider` is that
composition, done once, correctly.

## Why it belongs here

It has no behaviour of its own beyond composition — it renders `GiselleThemeProvider` wrapping
`GiselleSettingsProvider` wrapping an internal bridge component
([`SettingsThemeBridge`](./settings-theme-bridge/README.md), a genuine sub-component: it is never
useful on its own, only in service of this composition). Living inside `settings-provider/`
alongside `GiselleSettingsProvider` keeps the two-provider story colocated, since one exists
largely to make the other easier to use with theming.

## Design decisions

**`getMode` is optional.** Without it, this component behaves exactly like using
`GiselleThemeProvider` and `GiselleSettingsProvider` side by side with no sync — the settings
state and the MUI color scheme are independent. Only providing `getMode` opts into the sync,
so this component is a strict superset of the "just compose them yourself" baseline, never a
behavioural surprise.

**The bridge is a separate component, not inline logic.** `SettingsThemeBridge` must render
*inside* both providers to call both `useGiselleSettings` and `useColorScheme`, so it cannot be a
`useEffect` in this component's own body — this component itself renders *outside* both.
Isolating it also keeps its one job (sync settings → color scheme) independently testable without
mounting the full provider tree.

## Usage

### Zero-config

```tsx
const defaultSettings = { version: '1', mode: 'light' as const };

<GiselleThemeAndSettingsProvider defaultSettings={defaultSettings}>
  <App />
</GiselleThemeAndSettingsProvider>
```

### With color-scheme sync

```tsx
<GiselleThemeAndSettingsProvider defaultSettings={defaultSettings} getMode={(s) => s.mode}>
  <App />
</GiselleThemeAndSettingsProvider>
```

### With cookie storage + SSR hydration

Read the stored settings server-side (e.g. via Next.js `cookies()`), parse them, and pass as
`initialState` to avoid a flash of default settings on first render.

```tsx
// In a Next.js RSC (app/layout.tsx) — read + parse the stored cookie
const raw = (await cookies()).get('giselle-settings')?.value ?? null;
const initialState = raw ? (JSON.parse(raw) as typeof defaultSettings) : undefined;

<GiselleThemeAndSettingsProvider
  defaultSettings={defaultSettings}
  initialState={initialState}
  storage="cookie"
  getMode={(s) => s.mode}
>
  <App />
</GiselleThemeAndSettingsProvider>
```

## File structure

```
theme-and-settings-provider/
  theme-and-settings-provider.tsx        Component
  theme-and-settings-provider.test.ts    Tests
  types.ts                               GiselleThemeAndSettingsProviderProps
  index.ts                               Barrel
  README.md                              This file
  roadmap.md                             Status and history
  settings-theme-bridge/                 Internal sub-component — see its own README
```

## Related

- [`../README.md`](../README.md) — `GiselleSettingsProvider`, the settings half of this
  composition
- [`./settings-theme-bridge/README.md`](./settings-theme-bridge/README.md) — the internal bridge
  this component renders
- [GiselleThemeProvider](../../theme-provider/giselle/README.md) — the theming half of this
  composition

---

_Compliance standard: [documentation-strategy.md](../../../../docs/documentation-strategy.md)_
