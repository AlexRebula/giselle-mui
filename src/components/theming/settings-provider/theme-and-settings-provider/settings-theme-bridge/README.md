# SettingsThemeBridge

Internal sub-component of [`GiselleThemeAndSettingsProvider`](../README.md) — not exported from
the package barrel, never useful on its own.

## Why it exists

Syncing settings state to MUI's color scheme needs both `useGiselleSettings` (from
`GiselleSettingsProvider`'s context) and `useColorScheme` (from `GiselleThemeProvider`'s context)
in the same render. `GiselleThemeAndSettingsProvider` itself renders *outside* both providers, so
this logic can't live in its body — it has to be a component rendered *inside* both, which is all
this is. It renders nothing (`return null`) and exists purely for its `useEffect`.

See [`../README.md`](../README.md#design-decisions) for the fuller reasoning.

---

_Compliance standard: [documentation-strategy.md](../../../../../docs/documentation-strategy.md)_
