'use client';

import type { MouseEvent } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { GiselleIcon } from '../../../../../material/data-display/icon/giselle/giselle-icon';
import { eyeButtonSx } from './eye-button.styles';
import { EYE_BUTTON_MIN_SIZE, PHASE_EYE_ICON_SIZE } from './eye-button.const';
import type { EyeButtonProps } from './types';

// ----------------------------------------------------------------------

/**
 * Viewed-state toggle button, floating outside a `PhaseCard` at the bottom
 * on the outer edge (mirrors `CardCornerAlertBadge`'s outer-edge placement:
 * away from the spine).
 *
 * Only rendered by the parent when `onMarkViewed` is provided — this
 * component itself always assumes a handler is present.
 */
export function EyeButton({ isViewed, onMarkViewed, columnSide }: EyeButtonProps) {
  return (
    <Tooltip
      title={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
      placement={columnSide === 'left' ? 'right' : 'left'}
      arrow
    >
      <Box
        component="button"
        type="button"
        onClick={(e: MouseEvent) => {
          e.stopPropagation();
          onMarkViewed();
        }}
        aria-label={isViewed ? 'Mark as not viewed' : 'Mark as viewed'}
        aria-pressed={isViewed}
        sx={eyeButtonSx({ columnSide, isViewed, minSize: EYE_BUTTON_MIN_SIZE })}
      >
        <GiselleIcon
          icon={isViewed ? 'solar:eye-bold' : 'solar:eye-outline'}
          width={PHASE_EYE_ICON_SIZE}
          aria-hidden
        />
      </Box>
    </Tooltip>
  );
}
