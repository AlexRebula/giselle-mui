import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import {
  imageColumnCardSx,
  imageColumnFrameSx,
  imageColumnInnerGhostSx,
  imageColumnOuterGhostSx,
  imageColumnStickyStackSx,
} from './feature-flow-section.styles';
import type { FeatureFlowImageColumnProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowImageColumn` — the sticky image column. Presentational only:
 * all hover-stack/scroll-direction timing lives in `FeatureFlowSection`,
 * which computes `activeSrc` and passes it down. Not exported from the
 * package barrel.
 *
 * Every src in `allSrcs` is permanently mounted; only `activeSrc` is opaque.
 * This crossfades on `activeSrc` changes with no image remount/flicker.
 * `ghostSrc` renders invisibly in-flow purely to give the sticky column its
 * natural height, so `position: sticky` has room to travel within the tall
 * grid track next to it.
 */
export function FeatureFlowImageColumn({
  activeSrc,
  ghostSrc,
  allSrcs,
  alt,
  sx,
}: FeatureFlowImageColumnProps) {
  return (
    <Stack sx={imageColumnStickyStackSx}>
      <Box component="img" alt="" aria-hidden src={ghostSrc} sx={imageColumnOuterGhostSx} />

      <Box sx={[imageColumnCardSx, ...(Array.isArray(sx) ? sx : [sx])]}>
        <Box sx={{ width: 1, position: 'relative' }}>
          <Box component="img" alt="" aria-hidden src={ghostSrc} sx={imageColumnInnerGhostSx} />
          {allSrcs.map((src) => (
            <Box
              key={src}
              component="img"
              alt={src === activeSrc ? alt : ''}
              aria-hidden={src === activeSrc ? undefined : true}
              src={src}
              fetchPriority={src === ghostSrc ? 'high' : 'auto'}
              sx={imageColumnFrameSx(src === activeSrc)}
            />
          ))}
        </Box>
      </Box>
    </Stack>
  );
}
