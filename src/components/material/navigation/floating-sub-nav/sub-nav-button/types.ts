import type { FloatingSubNavItem } from '../types';

// ----------------------------------------------------------------------

export type SubNavButtonProps = {
  /** The navigation item this button represents (id, label, icon). */
  item: FloatingSubNavItem;
  /**
   * Whether this button represents the currently active section.
   * Drives `aria-pressed`, hover suppression, and active colour via `subNavButtonSx`.
   */
  isActive: boolean;
  /** Called with `item.id` when the user clicks the button. */
  onPress: (id: string) => void;
};
