'use client';

import type { PortraitLayerProps } from './types';

import React from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { portraitImageSx, portraitWrapperSx } from './portrait-layer.styles';

// ----------------------------------------------------------------------

/**
 * Layer 3 (z-index 3) — the directional portrait.
 *
 * An oversized image scaled to `3.8×` that fills the viewport bleed zone
 * when the pointer hovers and moves around the logo. Which image is shown
 * is determined by the pointer direction relative to the logo centre.
 *
 * Returns `null` when no portrait source has been resolved for the current
 * direction so the layer is absent from the DOM during idle and artistic phases.
 *
 * @internal — used by `InteractiveHeroLogo` only.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices not re-audited — SonarQube not verified
 */
export const PortraitLayer = React.forwardRef<HTMLDivElement, PortraitLayerProps>(
  function PortraitLayer({ portraitSrc, portraitAlt, showPortrait, portraitFadeTransition }, ref) {
    if (!portraitSrc) {
      return null;
    }

    return (
      <Box ref={ref} sx={portraitWrapperSx}>
        <Box
          component={motion.img}
          alt={portraitAlt}
          src={portraitSrc}
          initial={{
            opacity: 0,
            scale: 1.035,
            filter: 'blur(10px)',
          }}
          animate={{
            opacity: showPortrait ? 1 : 0,
            scale: showPortrait ? 1 : 1.035,
            filter: showPortrait ? 'blur(0px)' : 'blur(10px)',
          }}
          transition={portraitFadeTransition}
          sx={portraitImageSx}
        />
      </Box>
    );
  }
);

PortraitLayer.displayName = 'PortraitLayer';
