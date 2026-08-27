import { forwardRef, useCallback } from 'react';
import type { MouseEvent } from 'react';

import Chip from '@mui/material/Chip';
import SvgIcon from '@mui/material/SvgIcon';

import type { SelectableLabelProps } from './types';
import { selectableLabelSx, selectableLabelIconSx } from './selectable-label.styles';

// Re-export — keeps `import { SelectableLabelProps } from './selectable-label'` working.
export type { SelectableLabelProps } from './types';

// ----------------------------------------------------------------------
// Built-in checkmark icon, shown only when selected. Created once at
// module load, never recreated. Not consumer-configurable — the checkmark
// is the fixed visual signal for "selected", the same way SelectableCard's
// ring is fixed rather than themeable per-instance.
// ----------------------------------------------------------------------
const CHECK_ICON = (
  <SvgIcon sx={selectableLabelIconSx} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.4-1.4z" />
  </SvgIcon>
);

/** A toggleable chip for multi-select filter groups, built on MUI `Chip` with `SelectableCard`'s selected-state styling. */
export const SelectableLabel = forwardRef<HTMLDivElement, SelectableLabelProps>(
  function SelectableLabel({ selected, onSelectedChange, disabled, sx, ...other }, ref) {
    const handleClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        // Guarded explicitly rather than trusting Chip's own disabled+onClick
        // handling: under MUI v7 (one of this library's two supported peer
        // ranges) Chip's clickable variant still invokes onClick when
        // disabled — ButtonBase-based components like SelectableCard don't
        // have this gap, but Chip isn't ButtonBase-based the same way.
        if (disabled) return;
        // Mirrors ToggleIconButton: stops the click from also triggering a
        // parent's onClick (e.g. a filter row wrapper) alongside the toggle.
        e.stopPropagation();
        onSelectedChange?.(!selected);
      },
      [selected, disabled, onSelectedChange]
    );

    return (
      <Chip
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        // aria-pressed communicates toggle/selection state to assistive
        // technologies, the same ARIA pattern SelectableCard uses.
        aria-pressed={selected}
        icon={selected ? CHECK_ICON : undefined}
        sx={[selectableLabelSx(selected), ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      />
    );
  }
);
SelectableLabel.displayName = 'SelectableLabel';
