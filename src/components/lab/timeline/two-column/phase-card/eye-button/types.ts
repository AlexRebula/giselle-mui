// ----------------------------------------------------------------------

export interface EyeButtonProps {
  /** Whether this phase has already been marked viewed. */
  isViewed: boolean;
  /** Called when the button is clicked, toggling the viewed state. */
  onMarkViewed: () => void;
  /** Which column this phase card is in — controls which outer edge the button floats on. */
  columnSide: 'left' | 'right';
}
