import React from 'react';

import { m, useReducedMotion } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import { fade } from '../../../motion/variants/fade';
import { featureFlowItemSx } from '../feature-flow-section.styles';
import { itemRowTextSlotSx } from './feature-flow-item-row.styles';
import type { FeatureFlowItemRowProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowItemRow` — one row in `FeatureFlowSection`'s description
 * column. Always a real, focusable `ButtonBase` — including items with no
 * expansion data (`expandable: false`): clicking/activating those does
 * nothing (no `onClick` wired), but they stay a genuine button rather than a
 * different element type, since hovering or focusing any row (expandable or
 * not) already has a real effect — it drives what the image column shows
 * (see #198). `expandable` only gates the *visual* hover/press/selected/
 * expanded treatment in `featureFlowItemSx`. Not exported from the package
 * barrel: an implementation detail of `FeatureFlowSection`.
 */
export const FeatureFlowItemRow = React.forwardRef<HTMLButtonElement, FeatureFlowItemRowProps>(
  function FeatureFlowItemRow(
    {
      icon,
      title,
      description,
      expandable,
      isSelected,
      isActive,
      isExpanded,
      onHover,
      onFocus,
      onSelect,
      sx,
      ...other
    },
    ref
  ) {
    const reducedMotion = useReducedMotion();

    return (
      <ButtonBase
        {...other}
        ref={ref}
        disableRipple
        type="button"
        aria-pressed={expandable ? isSelected : undefined}
        component={m.button}
        variants={fade('inUp', { distance: reducedMotion ? 0 : 24 })}
        onMouseEnter={onHover}
        onFocus={onFocus}
        onClick={expandable ? onSelect : undefined}
        sx={[
          featureFlowItemSx({ isSelected, isActive, isExpanded, expandable }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <GiselleIcon icon={icon} width={48} aria-hidden="true" />
        <Stack spacing={1} sx={itemRowTextSlotSx}>
          <Typography variant="h4" component="h6" color="inherit">
            {title}
          </Typography>
          <Typography color="inherit">{description}</Typography>
        </Stack>
      </ButtonBase>
    );
  }
);

FeatureFlowItemRow.displayName = 'FeatureFlowItemRow';
