import type { BaseSettingsState } from '../../settings-types';

// ----------------------------------------------------------------------

/**
 * Props for the internal `SettingsThemeBridge` component.
 *
 * @internal Not exported from the package barrel — used only by `GiselleThemeAndSettingsProvider`.
 */
export interface SettingsThemeBridgeProps<TState extends BaseSettingsState> {
  /**
   * Extract a color scheme mode from the current settings state.
   * When the returned value changes, `useColorScheme().setMode` is called automatically.
   * Return `undefined` to leave the MUI color scheme unchanged.
   */
  getMode?: (state: TState) => 'light' | 'dark' | 'system' | undefined;
}
