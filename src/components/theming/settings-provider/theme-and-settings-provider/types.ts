import type { CssVarsThemeOptions, CssVarsTheme } from '@mui/material/styles';

import type { BaseSettingsState, GiselleSettingsProviderProps } from '../settings-types';

// ----------------------------------------------------------------------

/**
 * Props for `GiselleThemeAndSettingsProvider` — a convenience wrapper that
 * composes `GiselleThemeProvider` and `GiselleSettingsProvider` in one component
 * and optionally bridges settings state to the MUI color scheme.
 */
export type GiselleThemeAndSettingsProviderProps<TState extends BaseSettingsState> =
  GiselleSettingsProviderProps<TState> & {
    /**
     * Partial theme options deep-merged on top of the Giselle brand defaults.
     * Ignored when `theme` is provided. Same as `GiselleThemeProviderProps.themeOverrides`.
     */
    themeOverrides?: CssVarsThemeOptions;

    /**
     * A fully custom theme created with `extendTheme()`. When provided, `themeOverrides`
     * is ignored. Same as `GiselleThemeProviderProps.theme`.
     */
    theme?: CssVarsTheme;

    /**
     * Initial color scheme applied before settings are read.
     * Same as `GiselleThemeProviderProps.defaultMode`.
     *
     * @default 'system'
     */
    defaultMode?: 'light' | 'dark' | 'system';

    /**
     * Map settings state to an MUI color scheme mode.
     *
     * When provided, the MUI color scheme is synced to the returned value
     * whenever settings change. Use this to drive `light`/`dark`/`system` mode
     * from your settings state.
     *
     * **Example:**
     * ```ts
     * getMode={(s) => s.mode}
     * ```
     */
    getMode?: (state: TState) => 'light' | 'dark' | 'system' | undefined;
  };
