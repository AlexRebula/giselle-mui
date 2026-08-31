import React from 'react';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import { fade } from '../../../motion/variants/fade';
import { featureFlowItemSx } from '../feature-flow-section.styles';
import type { FeatureFlowItemRowProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowItemRow` — one row in `FeatureFlowSection`'s description column.
 *
 * Interactive rows (items with expansion data) render as a real `<button>`:
 * clicking opens the detail panel, and `aria-pressed` reflects the selected
 * state. Non-interactive rows are not buttons — nothing happens on
 * activation — but they're still focusable (`tabIndex={0}`) and wire the
 * same `onHover`/`onFocus` preview callbacks, so the image-column preview
 * that hovering triggers is also reachable from the keyboard. Not exported
 * from the package barrel: an implementation detail of `FeatureFlowSection`.
 */
export const FeatureFlowItemRow = React.forwardRef<HTMLElement, FeatureFlowItemRowProps>(
  function FeatureFlowItemRow(
    {
      icon,
      title,
      description,
      interactive,
      isSelected,
      isActive,
      isExpanded,
      onHover,
      onFocus,
      onSelect,
    },
    ref
  ) {
    const rowContent = (
      <>
        <GiselleIcon icon={icon} width={48} aria-hidden="true" />
        <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h4" component="h6" color="inherit">
            {title}
          </Typography>
          <Typography color="inherit">{description}</Typography>
        </Stack>
      </>
    );

    const sx = featureFlowItemSx({ isSelected, isActive, isExpanded, interactive });

    if (!interactive) {
      return (
        <Box
          ref={ref}
          component={m.div}
          variants={fade('inUp', { distance: 24 })}
          tabIndex={0}
          onMouseEnter={onHover}
          onFocus={onFocus}
          sx={sx}
        >
          {rowContent}
        </Box>
      );
    }

    return (
      <ButtonBase
        ref={ref as React.Ref<HTMLButtonElement>}
        disableRipple
        type="button"
        aria-pressed={isSelected}
        component={m.button}
        variants={fade('inUp', { distance: 24 })}
        onMouseEnter={onHover}
        onFocus={onFocus}
        onClick={onSelect}
        sx={sx}
      >
        {rowContent}
      </ButtonBase>
    );
  }
);

FeatureFlowItemRow.displayName = 'FeatureFlowItemRow';
