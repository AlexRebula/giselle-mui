import React, { useCallback } from 'react';

import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';

import { subNavButtonSx } from './sub-nav-button.styles';
import type { SubNavButtonProps } from './types';

// ----------------------------------------------------------------------

/**
 * Icon-only navigation button used inside `NavPill`.
 *
 * Accessibility decisions:
 * - `aria-label` — taken from `item.label`; no visible text, so the label is the only
 *   accessible name.
 * - `aria-pressed` — communicates the active/idle toggle state to screen readers.
 * - `disableRipple` — the pill already has a background transition; a ripple layer
 *   creates visual noise inside the compact pill shape.
 * - `component="button" type="button"` — prevents form submission if the pill is
 *   ever rendered inside a `<form>` ancestor.
 *
 * The forwarded ref targets `ButtonBase` (the actual interactive element) rather than
 * an outer wrapper — `Tooltip` requires a single child that can hold a ref for its own
 * positioning to work, and `ButtonBase` is that child here.
 *
 * This is an internal sub-component — always rendered by `NavPill`,
 * never instantiated directly by consumers.
 *
 * **Quality status (13 May 2026):** DoD 9/9 · Best practices 13/13
 */
export const SubNavButton = React.forwardRef<HTMLButtonElement, SubNavButtonProps>(
  function SubNavButton({ item, isActive, onPress }, ref) {
    const handleClick = useCallback(() => onPress(item.id), [onPress, item.id]);

    return (
      <Tooltip title={item.label} placement="top" arrow>
        <ButtonBase
          ref={ref}
          disableRipple
          component="button"
          type="button"
          aria-label={item.label}
          aria-pressed={isActive}
          onClick={handleClick}
          sx={subNavButtonSx(isActive)}
        >
          {item.icon}
        </ButtonBase>
      </Tooltip>
    );
  }
);

SubNavButton.displayName = 'SubNavButton';
