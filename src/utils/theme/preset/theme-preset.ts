/**
 * Giselle brand theme preset for MUI v7 CSS Variables mode.
 *
 * Defines the Giselle ecosystem's default palette as a ready-to-use
 * `extendTheme()` result. Pass directly to `ThemeProvider` or use the
 * zero-config `GiselleThemeProvider` wrapper (Phase C).
 *
 * **Brand palette — the Carabao mango tree:**
 * - Primary   — Deep grove green `#2E7D32` (Lime `#76C442` in dark mode)
 * - Secondary — Mango gold `#F5A623`
 */

import { extendTheme } from '@mui/material/styles';
import type { ColorSystemOptions, CssVarsThemeOptions } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import { hexToChannel } from '../theme-utils/theme-utils';

// ----------------------------------------------------------------------
// Brand palette constants
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
// Mango brand-identity palette (not mapped to MUI palette roles)
// Used in story scaffold chrome and brand-specific UI elements.
// ----------------------------------------------------------------------

/** Ripe mango flesh — warm cream for light backgrounds (`#FFF3CD`). */
export const MANGO_RIPE_FLESH = '#FFF3CD';

/** Dark grove — near-black for dark-mode canvas backgrounds (`#1A2B1A`). */
export const MANGO_DARK_GROVE = '#1A2B1A';

/** Warm tan — light neutral for warm canvas contexts (`#F5EDDC`). */
export const MANGO_WARM_TAN = '#F5EDDC';

// ----------------------------------------------------------------------
// MUI palette role constants
// ----------------------------------------------------------------------

/**
 * Giselle brand primary colour — Deep grove green `#2E7D32`.
 *
 * Used as the light-mode primary. Achieves 4.76:1 contrast against white —
 * passes WCAG 2.1 AA for normal text.
 */
export const GISELLE_PRIMARY_MAIN = '#2E7D32';

/**
 * Giselle brand primary colour in dark mode — Lime green `#76C442`.
 *
 * Lighter variant applied as `primary.main` in the dark colour scheme so
 * primary-tinted surfaces and text remain readable on dark backgrounds.
 */
export const GISELLE_PRIMARY_DARK_MAIN = '#76C442';

/**
 * Giselle brand secondary colour — Mango gold `#F5A623`.
 *
 * The Carabao mango accent. Identical in both light and dark colour schemes.
 */
export const GISELLE_SECONDARY_MAIN = '#F5A623';

// ----------------------------------------------------------------------
// Custom CSS-vars channel tokens
// ----------------------------------------------------------------------

/**
 * `grey[500]` as a space-separated RGB channel string, for `channelAlpha()`
 * tinting (e.g. `channelAlpha(theme.vars.palette.grey['500Channel'], 0.08)`).
 *
 * **Why this exists:** MUI's `extendTheme()` only auto-generates `*Channel`
 * CSS variables for palette entries shaped like a `PaletteColor` (anything
 * with a `.main`), plus a short hardcoded list (`background.default/paper`,
 * `common.background/onBackground`, `divider`, `text.primary/secondary`,
 * `action.active/selected`). The numbered `grey` scale isn't one of them —
 * `--mui-palette-grey-500Channel` is never emitted by default, even though
 * `--mui-palette-grey-500` (the plain hex) is. Several components across
 * this library reference `grey['500Channel']` for hover tints and tinted
 * shadows; without this explicit token those `rgba(var(...) / alpha)`
 * declarations resolve to an unset custom property, which browsers treat as
 * invalid and silently drop (see issue #185).
 */
const GREY_500_CHANNEL = hexToChannel(grey[500]);

/**
 * MUI's type for `palette.grey` (`ColorPartial`) only lists the numbered and
 * `A`-prefixed shades — it has no room for a custom `500Channel` token, so a
 * plain object literal can't be assigned to it directly. Every existing
 * *read* of `theme.vars.palette.grey['500Channel']` elsewhere in this
 * codebase (e.g. `floating-sub-nav.styles.ts`) already casts through
 * `Record<string, string>` for the same reason — this is the write-side
 * equivalent.
 */
type GreyPaletteWithChannel = NonNullable<ColorSystemOptions['palette']>['grey'] & {
  '500Channel': string;
};

// ----------------------------------------------------------------------
// Theme preset
// ----------------------------------------------------------------------

/**
 * The Giselle brand theme options — the raw input to `extendTheme()`.
 *
 * Use this constant when you need to deep-merge Giselle palette defaults
 * with consumer overrides before resolving the final theme. Prefer
 * `giselleTheme` when you only need the already-resolved theme object.
 */
export const giselleThemeOptions: CssVarsThemeOptions = {
  colorSchemes: {
    light: {
      palette: {
        primary: { main: GISELLE_PRIMARY_MAIN },
        secondary: { main: GISELLE_SECONDARY_MAIN },
        info: { main: '#0288D1' },
        success: { main: '#388E3C' },
        warning: { main: '#ED6C02' },
        error: { main: '#D32F2F' },
        // `grey` is shared between the light and dark schemes (MUI's default
        // scale isn't overridden here), so the same channel value applies to
        // both — see `GREY_500_CHANNEL` above for why this is needed at all.
        // MUI's `ColorPartial` type only lists the numbered/A-prefixed grey
        // shades, not custom channel tokens — cast, same as every existing
        // *read* of `theme.vars.palette.grey['500Channel']` elsewhere in this
        // codebase (e.g. `floating-sub-nav.styles.ts`).
        grey: { '500Channel': GREY_500_CHANNEL } as unknown as GreyPaletteWithChannel,
      },
    },
    dark: {
      palette: {
        primary: { main: GISELLE_PRIMARY_DARK_MAIN },
        secondary: { main: GISELLE_SECONDARY_MAIN },
        info: { main: '#29B6F6' },
        success: { main: '#66BB6A' },
        warning: { main: '#FFA726' },
        error: { main: '#F44336' },
        grey: { '500Channel': GREY_500_CHANNEL } as unknown as GreyPaletteWithChannel,
      },
    },
  },
};

/**
 * The Giselle brand theme preset.
 *
 * A ready-to-use result of `extendTheme()` carrying the full Giselle palette
 * for both light and dark colour schemes.
 *
 * **Usage — with `ThemeProvider` directly:**
 * ```tsx
 * import { ThemeProvider } from '@mui/material/styles';
 * import { giselleTheme } from '@littlebranches/giselle-mui';
 *
 * <ThemeProvider theme={giselleTheme}>
 *   <App />
 * </ThemeProvider>
 * ```
 *
 * **Usage — via `GiselleThemeProvider` (zero-config):**
 * ```tsx
 * import { GiselleThemeProvider } from '@littlebranches/giselle-mui';
 *
 * <GiselleThemeProvider>
 *   <App />
 * </GiselleThemeProvider>
 * ```
 *
 * **Palette decisions:**
 * - `primary`   — Deep grove green / Lime (dark mode): the tree foundation
 * - `secondary` — Mango gold: the fruit accent, unchanged between modes
 * - `info`      — Accessible blue (standard MUI default family)
 * - `success`   — Leaf green `#388E3C` — distinct from primary to avoid ambiguity
 * - `warning`   — Amber orange `#ED6C02` — warm, complements the mango gold family
 * - `error`     — Standard red `#D32F2F`
 */
export const giselleTheme = extendTheme(giselleThemeOptions);
