import React from 'react';

import Box from '@mui/material/Box';

import { metricCardDecorationSx } from './metric-card-decoration.styles';
import type { MetricCardDecorationProps } from './types';

// ----------------------------------------------------------------------

/**
 * MetricCardDecoration — the rotated gradient rectangle that sits behind MetricCard content.
 *
 * Pass as the `decoration` prop of `MetricCard`. The card clips it via `overflow: hidden`.
 *
 * @example
 * import { MetricCard, MetricCardDecoration } from '@littlebranches/giselle-mui';
 * <MetricCard decoration={<MetricCardDecoration color="primary" />} ... />
 *
 * **Quality status (02 Sep 2026):** DoD 19/22 · Best practices not re-audited — SonarQube not verified · size-constant regression tests missing · no Responsive story
 */
export const MetricCardDecoration = React.forwardRef<HTMLDivElement, MetricCardDecorationProps>(
  function MetricCardDecoration({ color = 'primary', sx, ...other }, ref) {
    return (
      <Box
        ref={ref}
        sx={[metricCardDecorationSx(color), ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      />
    );
  }
);

MetricCardDecoration.displayName = 'MetricCardDecoration';
