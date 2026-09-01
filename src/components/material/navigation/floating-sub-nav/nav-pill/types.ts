import type { FloatingSubNavItem } from '../types';

// ----------------------------------------------------------------------

export type NavPillProps = {
  /** Ordered list of items to render as icon buttons. */
  items: FloatingSubNavItem[];
  /**
   * The id of the currently active item.
   * Each `SubNavButton` derives its `aria-pressed` state by comparing `item.id` to this value.
   */
  activeId: string;
  /** Called when the user presses a button. Receives the id of the pressed item. */
  onPress: (id: string) => void;
};
