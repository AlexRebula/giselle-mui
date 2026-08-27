import type { ChipProps } from '@mui/material/Chip';

// ----------------------------------------------------------------------

/**
 * Props for the {@link SelectableLabel} component.
 *
 * Extends MUI `ChipProps` — `size`, `disabled`, `sx`, and all other MUI
 * `Chip` props are forwarded to the root element unchanged. `onClick` and
 * `icon` are omitted because `SelectableLabel` owns them internally (the
 * click handler drives `onSelectedChange`; the icon slot shows the
 * selected-state checkmark).
 */
export interface SelectableLabelProps extends Omit<ChipProps, 'onClick' | 'icon'> {
  /** Whether this label is currently selected — maps to `aria-pressed`. */
  selected: boolean;

  /** Called with the next selected value when the label is activated. */
  onSelectedChange?: (nextSelected: boolean) => void;
}
