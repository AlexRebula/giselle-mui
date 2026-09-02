import type { Theme } from '@mui/material/styles';

import React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';

import type { FaqMotionViewportProps } from './types';
import { container } from '../../../../motion/variants/container';

// ----------------------------------------------------------------------

// Created once at module load — never inside the render function.
const MotionBox = motion(Box);

// ----------------------------------------------------------------------

/**
 * Scroll-triggered animation container for `FaqSection`.
 * Wraps children in a framer-motion stagger container that fires once when
 * the section enters the viewport.
 *
 * Animation is disabled on `sm` and below — short viewports skip the
 * stagger to avoid content appearing off-screen on first render.
 *
 * @internal — used by `FaqSection` only.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices 13/13 — SonarQube not verified
 */
export const FaqMotionViewport = React.forwardRef<HTMLDivElement, FaqMotionViewportProps>(
  function FaqMotionViewport({ children, sx }, ref) {
    const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

    if (smDown) {
      return (
        <Box ref={ref} sx={sx}>
          {children}
        </Box>
      );
    }

    return (
      <MotionBox
        ref={ref}
        initial="initial"
        whileInView="animate"
        variants={container()}
        viewport={{ once: true, amount: 0.3 }}
        sx={sx}
      >
        {children}
      </MotionBox>
    );
  }
);

FaqMotionViewport.displayName = 'FaqMotionViewport';
