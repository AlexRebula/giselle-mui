'use client';

import type { ArtisticLogoLayerProps } from './types';

import React from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import { artisticLogoSx } from './artistic-logo-layer.styles';

// ----------------------------------------------------------------------

/**
 * Layer 2 (z-index 2) — the artistic logo.
 *
 * An absolute-positioned `<img>` that fades in during the `'idle'` hover
 * phase, giving the logo a distinct watercolour-style look at rest.
 *
 * Returns `null` when no `artisticLogoSrc` is provided so the layer is
 * entirely absent from the DOM until a source is supplied.
 *
 * @internal — used by `InteractiveHeroLogo` only.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices not re-audited — SonarQube not verified
 */
export const ArtisticLogoLayer = React.forwardRef<HTMLImageElement, ArtisticLogoLayerProps>(
  function ArtisticLogoLayer(
    { artisticLogoSrc, showArtisticLogo, logoFadeTransition, logoAlt },
    ref
  ) {
    if (!artisticLogoSrc) {
      return null;
    }

    return (
      <Box
        ref={ref}
        component={motion.img}
        alt={logoAlt ?? 'Logo'}
        src={artisticLogoSrc}
        initial={{
          opacity: 1,
          scale: 1.03,
          filter: 'blur(8px)',
        }}
        animate={{
          opacity: showArtisticLogo ? 1 : 0,
          scale: showArtisticLogo ? 1 : 1.03,
          filter: showArtisticLogo ? 'blur(0px)' : 'blur(8px)',
        }}
        transition={logoFadeTransition}
        sx={artisticLogoSx}
      />
    );
  }
);

ArtisticLogoLayer.displayName = 'ArtisticLogoLayer';
