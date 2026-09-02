import type { ScenarioBadgeProps } from './types';

import Typography from '@mui/material/Typography';

import { scenarioBadgeSx } from './scenario-badge.styles';

// ----------------------------------------------------------------------

/**
 * Pill label for scenario-variant phase cards.
 * Rendered by `CardStatusBadge` — not used directly in `PhaseCard`.
 *
 * **Quality status (02 Sep 2026):** DoD 10/12 · Best practices 13/13 — SonarQube not verified · JSDoc prop coverage incomplete
 */
export function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography variant="overline" sx={scenarioBadgeSx(color)}>
      {scenarioLabel}
    </Typography>
  );
}
