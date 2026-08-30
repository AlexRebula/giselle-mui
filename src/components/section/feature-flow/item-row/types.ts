export interface FeatureFlowItemRowProps {
  /** Solar icon name, rendered at the row's leading edge. */
  icon: string;
  title: string;
  description: string;
  /**
   * Whether this item has expansion data (metrics, technologies, highlight
   * cards, or a long description). Interactive rows render as a real
   * `<button>` and can be clicked to expand; non-interactive rows are
   * focusable (so the hover-preview effect is keyboard-reachable) but are
   * not buttons — nothing happens on activation.
   */
  interactive: boolean;
  /** Persistent: this is the last-clicked item (only meaningful when `interactive`). */
  isSelected: boolean;
  /** Transient: this is the currently-previewed item (hover or focus, either row type). */
  isActive: boolean;
  /** This item's detail panel is currently open (only meaningful when `interactive`). */
  isExpanded: boolean;
  /** Fires on mouse enter — makes this the previewed item. */
  onHover: () => void;
  /** Fires on focus — makes this the previewed item (keyboard equivalent of `onHover`). */
  onFocus: () => void;
  /** Fires on click. Only ever called for interactive rows — never wired for non-interactive ones. */
  onSelect: () => void;
}
