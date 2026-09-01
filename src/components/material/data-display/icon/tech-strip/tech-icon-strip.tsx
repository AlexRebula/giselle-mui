import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  iconSlotSx,
  itemLabelSx,
  itemSx,
  stripRootSx,
  stripWrapperSx,
  titleSx,
} from './tech-icon-strip.styles';
import type { TechIconStripProps } from './types';

// ----------------------------------------------------------------------

/**
 * Horizontal strip of icon + label pairs.
 *
 * Use for "Technologies used", "Built with", or any icon-labelled collection.
 * The strip wraps automatically when the container is too narrow.
 *
 * @example
 * ```tsx
 * <TechIconStrip
 *   heading="Technologies"
 *   items={[
 *     { icon: <GiselleIcon icon="solar:code-bold" width={32} />, label: 'TypeScript' },
 *     { icon: <GiselleIcon icon="solar:database-bold" width={32} />, label: 'PostgreSQL' },
 *   ]}
 * />
 * ```
 */
export function TechIconStrip({
  items,
  heading,
  centeredWrap = false,
  sx,
  ...other
}: TechIconStripProps) {
  return (
    <Box sx={[stripRootSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {heading && (
        <Typography component="span" sx={titleSx} variant="overline">
          {heading}
        </Typography>
      )}
      <Box sx={stripWrapperSx(centeredWrap)}>
        {items.map((item) => (
          <Box key={item.label} sx={itemSx}>
            <Box aria-hidden sx={iconSlotSx}>
              {item.icon}
            </Box>
            <Typography sx={itemLabelSx} variant="caption">
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
