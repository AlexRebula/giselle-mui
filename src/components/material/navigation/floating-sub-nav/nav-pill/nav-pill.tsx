import React from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import { pillVariants, pillTransition } from './nav-pill.animations';
import { PILL_BUTTON_ROW_SPACING } from './nav-pill.const';
import { pillSx } from './nav-pill.styles';
import type { NavPillProps } from './types';
import { SubNavButton } from '../sub-nav-button';

// ----------------------------------------------------------------------

/**
 * Animated pill container rendered by `FloatingSubNav`.
 * Wraps a row of `SubNavButton` elements inside an `m.div` that slides
 * in from below on mount and slides out on unmount via `AnimatePresence`.
 *
 * This is an internal sub-component — always rendered by `FloatingSubNav`,
 * never instantiated directly by consumers.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices 13/13 — SonarQube not verified
 */
export const NavPill = React.forwardRef<HTMLDivElement, NavPillProps>(function NavPill(
  { items, activeId, onPress },
  ref
) {
  return (
    <m.div
      ref={ref}
      variants={pillVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pillTransition}
    >
      <Box component="nav" aria-label="Section navigation" sx={pillSx}>
        <Stack direction="row" spacing={PILL_BUTTON_ROW_SPACING}>
          {items.map((item) => (
            <SubNavButton
              key={item.id}
              item={item}
              isActive={activeId === item.id}
              onPress={onPress}
            />
          ))}
        </Stack>
      </Box>
    </m.div>
  );
});

NavPill.displayName = 'NavPill';
