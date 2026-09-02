import type { ReactNode } from 'react';
import type { TimelinePlatformItem } from '../types';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { derivePlatformEntry } from './phase-card.utils';
import { platformStripItemSlotSx, platformStripItemLabelSx } from './phase-card.styles';

// ----------------------------------------------------------------------

/**
 * Maps a phase's platform items into Tooltip-wrapped icon/chip nodes.
 *
 * @internal — not part of the public component API; exported for testing only.
 */
export function buildPlatformStripItems(platforms: TimelinePlatformItem[]): ReactNode[] {
  return platforms.map((p, i) => {
    const { label, icon } = derivePlatformEntry(p);
    return (
      <Tooltip key={`platform-${i}`} title={label} arrow placement="top">
        <Box sx={platformStripItemSlotSx}>
          {icon ?? (
            <Box component="span" sx={platformStripItemLabelSx}>
              {label}
            </Box>
          )}
        </Box>
      </Tooltip>
    );
  });
}
