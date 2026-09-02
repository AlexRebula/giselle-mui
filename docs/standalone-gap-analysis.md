---
sidebar_position: 7
sidebar_label: 'Migration Source Gap Analysis'
---

# Migration source gap analysis

> _Last updated: 02 Sep 2026_

This document tracks one axis and one axis only: **which components still live in the private consuming apps and have not yet been ported into `giselle-mui`.**

That is deliberately narrower than it sounds, and deliberately different from the other two trackers:

| Tracker                                                | Axis                                                                  |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| **this file**                                          | Exists in a private consuming app · not yet ported here               |
| [`component-inventory.md`](./component-inventory.md)   | Internal build phase and DoD score of everything already in this repo |
| [`component-compliance.md`](./component-compliance.md) | Per-folder README / JSDoc / story / roadmap presence                  |

A component leaves this document the moment it ships here — it does not get a ✅ row and stay. If you want to know what is in the library, read the inventory.

> **Naming:** the consuming apps are private, so they are referred to generically throughout ("the primary consuming app", "the second consuming app") per the public-repository rule in [`AGENTS.md`](../AGENTS.md). Do not substitute their real repository names back in.

---

## Why porting is a rewrite, not a copy

The source apps use a proprietary theme. Any component there that touches a proprietary utility, palette token, or provider **cannot be copied** — it has to be re-implemented independently against MUI v7 CSS variables mode and this library's own conventions. That is why "port" estimates here are not proportional to the size of the original file, and why a component can sit in this list for a long time while looking trivially small in the source app.

The corollary: a source component that only ever used plain MUI is genuinely cheap to move, and those are called out below.

---

## The original structural blocker is gone

This document was written in May 2026 around a single question — what does a blank Next.js project need before it can drop the proprietary theme entirely? — and the answer at the time was a chain of unshipped theming exports.

That chain has fully landed:

| Export                                               | Then        | Now                             |
| ---------------------------------------------------- | ----------- | ------------------------------- |
| `channelAlpha`, `hexToChannel`, `pxToRem`, `remToPx` | ✅ Phase A  | Shipped — main and `/utils`     |
| `giselleTheme` + palette constants                   | ⬜ Phase B  | **Shipped** — main and `/utils` |
| `GiselleThemeProvider`                               | ⬜ Phase C  | **Shipped** — main              |
| `GiselleSettingsProvider`                            | ⬜ Phase D  | **Shipped** — main              |
| `GiselleThemeAndSettingsProvider`                    | not planned | **Shipped** — main              |

A blank Next.js project can now be stood up on `giselle-mui` alone. The minimum root layout:

```tsx
// app/layout.tsx
'use client';

import { GiselleThemeAndSettingsProvider } from '@littlebranches/giselle-mui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GiselleThemeAndSettingsProvider>{children}</GiselleThemeAndSettingsProvider>
      </body>
    </html>
  );
}
```

Icon registration is a separate module-level call, not a provider — see [`components/icon/giselle/iconify-registration.md`](./components/icon/giselle/iconify-registration.md). (The May version of this document showed an `IconRegistrar` component in this example; no such export exists or ever did. Use `createIconRegistrar` at module level.)

Also shipped since May, each of which was listed here as unported: `TwoColumnShowcaseRow`, `SectionContainer`, `SectionTitle` + `SectionCaption`, `HeroSection`, `FaqSection` (the component this file called `FAQAccordion`), `BasicSection`, `StatusLabel`, `SelectableLabel`, `AnimatedGradientText`, `TechIconStrip`, `ProfileSummaryCard`, `StatCardRow`, `FeatureFlowSection`, `ScrollParallaxHero`, `HeroButtonsRow`, and `InteractiveHeroLogo`.

---

## Still not ported

Three components remain in the primary consuming app with a scaffold waiting for them here — folder, `types.ts`, `roadmap.md`, README and a placeholder test all exist; only the implementation is missing.

| Component              | Source       | Scaffold in this repo                       | What the port needs                                                   |
| ---------------------- | ------------ | ------------------------------------------- | --------------------------------------------------------------------- |
| `OptionWithBlurb`      | primary app  | `material/input/option-with-blurb/`         | Nothing structural — small, plain MUI, genuinely a copy-and-clean job |
| `SectionPendingLoader` | primary app  | `material/feedback/section-pending-loader/` | Replace the internal `Iconify` usage with `GiselleIcon`               |
| `FloatingControlBar`   | primary app  | `material/navigation/floating-control-bar/` | Replace the internal `Iconify` usage with `GiselleIcon`               |

All three are Phase E — they are the only thing keeping Phase E from closing.

### Wanted by the second consuming app, not present in either place

| Component   | Scaffold in this repo               | Note                                                                                     |
| ----------- | ----------------------------------- | ---------------------------------------------------------------------------------------- |
| `DataTable` | `material/data-display/data-table/` | Not a port — no source implementation exists. Must be written from scratch (Phase H G3). |

Everything else that app needs — `StatusLabel`, `StatCard`, `StatCardRow`, `TimelineTwoColumn` — has shipped.

---

## What is explicitly _not_ a porting target

To stop these reappearing as apparent gaps:

- **Proprietary-theme providers** in the source apps' layout chain (`I18nProvider`, `AuthProvider`, and the proprietary `SettingsProvider` / `ThemeProvider`) are replaced by `GiselleThemeAndSettingsProvider`, not ported. `I18nProvider` and `AuthProvider` are application concerns and belong in the application.
- **App-specific content sections** in the consuming apps are not library-worthy: they encode one site's copy and layout, not a reusable decision. Where a genuinely reusable shape was hiding inside one, it has already been extracted (`FeatureFlowSection`, `HeroSection`, `TwoColumnShowcaseRow`).
- **Everything in the `Scaffold` rows of [`component-inventory.md`](./component-inventory.md)** that is not listed above. Those are planned new components with no source implementation to port — Phases F through J. They belong to the inventory's roadmap, not to this document.

---

## Related

- [`roadmap.md`](./roadmap.md) — library-level phase timeline
- [`component-inventory.md`](./component-inventory.md) — everything in this repo, with DoD scores
- [`components/settings/settings-provider-plan.md`](./components/settings/settings-provider-plan.md) — `GiselleSettingsProvider` architecture spec
- [`components/timeline/two-column/timeline-plan.md`](./components/timeline/two-column/timeline-plan.md) — `TimelineTwoColumn` full plan
- [`components/dashboard-components-plan.md`](./components/dashboard-components-plan.md) — Phase H spec, including `DataTable`
