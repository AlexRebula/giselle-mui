import React from 'react';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import {
  imageColumnCardSx,
  imageColumnFrameSx,
  imageColumnInnerGhostSx,
  imageColumnOuterGhostSx,
  imageColumnStickyStackSx,
} from '../feature-flow-section.styles';
import type { FeatureFlowImageColumnProps, FeatureFlowImageRevealStyle } from './types';

// Re-export — keeps `import { FeatureFlowImageColumnProps } from
// './feature-flow-image-column'` working alongside the folder barrel.
export type { FeatureFlowImageColumnProps } from './types';

// ----------------------------------------------------------------------

/** Resting state applied when no `revealStyle` is given — the card renders
 * fully revealed, matching the pre-entrance-transform appearance. */
const RESTING_REVEAL_STYLE: FeatureFlowImageRevealStyle = {
  opacity: 1,
  y: 0,
  scale: 1,
  filter: 'none',
};

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
 *
 * `revealStyle` drives a scroll-linked entrance transform (opacity, y,
 * scale, blur) on the card's inner content — computed by `FeatureFlowSection`
 * (via `useImageRevealTransform`), not here. It's additive to the per-image
 * crossfade below: the whole card settles into place while whichever frame
 * is active still crossfades independently underneath. Applied one level in
 * from the card's own outer `Box` (which owns `imageColumnCardSx`'s own
 * `transform: translateX(-50%)` centering) rather than on that outer `Box`
 * itself, so the two transforms don't collide.
 *
 * `sx` styles the inner image card specifically (border-radius, shadow,
 * background) — not the root sticky wrapper — matching the one call site's
 * established use (`FeatureFlowImage['sx']`). All other passthrough props
 * (`className`, event handlers, `data-*`/`aria-*`, etc.) go to the root
 * `Stack` as usual.
 */
export const FeatureFlowImageColumn = React.forwardRef<HTMLDivElement, FeatureFlowImageColumnProps>(
  function FeatureFlowImageColumn(
    { activeSrc, ghostSrc, allSrcs, alt, revealStyle = RESTING_REVEAL_STYLE, sx, ...other },
    ref
  ) {
    return (
      <Stack ref={ref} sx={imageColumnStickyStackSx} {...other}>
        <Box component="img" alt="" aria-hidden src={ghostSrc} sx={imageColumnOuterGhostSx} />

        <Box sx={[imageColumnCardSx, ...(Array.isArray(sx) ? sx : [sx])]}>
          {/* The reveal transform's `y`/`scale` compose into this element's own
              `transform`, so it lives on this inner wrapper rather than the card
              above — that outer `Box` owns `imageColumnCardSx`'s own `transform`
              (translateX(-50%), for horizontal centering), and an inline motion
              `transform` would silently replace it if applied to the same node. */}
          <Box component={m.div} style={revealStyle} sx={{ width: 1, position: 'relative' }}>
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
);

FeatureFlowImageColumn.displayName = 'FeatureFlowImageColumn';
