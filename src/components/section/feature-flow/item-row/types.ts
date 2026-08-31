export interface FeatureFlowItemRowProps {
  /** Solar icon name, rendered at the row's leading edge. */
  icon: string;
  title: string;
  description: string;
  /**
   * Whether this item has expansion data (metrics, technologies, highlight
   * cards, or a long description). Every row is a real `ButtonBase`
   * regardless of this value (see #198) — it only gates the visual
   * hover/press/selected/expanded treatment and whether `onSelect` is wired.
   */
  expandable: boolean;
  /** Persistent: this is the last-clicked item (only meaningful when `expandable`). */
  isSelected: boolean;
  /** Transient: this is the currently-previewed item (hover or focus, any row). */
  isActive: boolean;
  /** This item's detail panel is currently open (only meaningful when `expandable`). */
  isExpanded: boolean;
  /** Fires on mouse enter — makes this the previewed item. */
  onHover: () => void;
  /** Fires on focus — makes this the previewed item (keyboard equivalent of `onHover`). */
  onFocus: () => void;
  /** Fires on click. Only wired when `expandable` — never called otherwise. */
  onSelect: () => void;
}
