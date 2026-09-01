'use client';

import type { AnimatedHeroHeadingProps } from './types';

import React from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';

import {
  gradientHighlightAnimate,
  gradientHighlightTransition,
  headingMotionProps,
} from './animated-hero-heading.animations';
import { headingH1Sx, headingHighlightSx } from './animated-hero-heading.styles';

// ----------------------------------------------------------------------

/**
 * `AnimatedHeroHeading` — an animated `<h1>` with a cycling gradient highlight span.
 *
 * The heading fades in on mount via `motionProps` (defaults to `fade('inUp', { distance: 24 })`).
 * The `highlight` word animates its gradient `backgroundPosition` infinitely, creating a
 * colour-wash effect using `theme.vars.palette.primary.main` and `theme.vars.palette.warning.main`.
 *
 * **Usage:**
 * ```tsx
 * <AnimatedHeroHeading
 *   subheading="The work of"
 *   highlight="Platform Team"
 * />
 * ```
 *
 * **Custom font family:**
 * ```tsx
 * <AnimatedHeroHeading
 *   subheading="The work of"
 *   highlight="Platform Team"
 *   sx={(theme) => ({ fontFamily: theme.typography.fontSecondaryFamily })}
 * />
 * ```
 *
 * **Note:** `fontFamily` is not baked in — it is intentionally left to the consumer.
 * Override via `sx` to apply any custom typeface from the active theme.
 *
 * **Ref and passthrough target:** the outer `motion.div` only exists to carry the
 * fade-in `motionProps` — it has no other props and nothing a consumer would want a
 * handle on. `ref` and `...other` are forwarded to the inner `<h1>` Box instead, since
 * that is the semantically meaningful DOM node (and the one every other `Box`-wrapping
 * component in this library exposes a ref to).
 *
 * **Quality status (May 2026):** implementation complete, styles tested.
 */
export const AnimatedHeroHeading = React.forwardRef<HTMLHeadingElement, AnimatedHeroHeadingProps>(
  function AnimatedHeroHeading({ subheading, highlight, motionProps, sx, ...other }, ref) {
    const resolvedMotionProps = motionProps ?? headingMotionProps;
    return (
      <motion.div {...resolvedMotionProps}>
        <Box
          ref={ref}
          component="h1"
          sx={[headingH1Sx, ...(Array.isArray(sx) ? sx : [sx])]}
          {...other}
        >
          {subheading}{' '}
          <Box
            component={motion.span as React.ElementType}
            animate={gradientHighlightAnimate}
            transition={gradientHighlightTransition}
            sx={headingHighlightSx}
          >
            {highlight}
          </Box>
        </Box>
      </motion.div>
    );
  }
);

AnimatedHeroHeading.displayName = 'AnimatedHeroHeading';
