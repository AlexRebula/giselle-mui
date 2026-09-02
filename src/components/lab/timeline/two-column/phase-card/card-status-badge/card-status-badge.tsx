import type { CardStatusBadgeProps } from './types';

import { ScenarioBadge } from './scenario-badge';

// ----------------------------------------------------------------------

/**
 * Status badge rendered at the top of a PhaseCard.
 *
 * Currently only the scenario badge variant is active; active/new badges were
 * removed to stabilise card height and may be reinstated in a future iteration.
 * Returns `null` when the phase has no active status badge.
 *
 * **Quality status (02 Sep 2026):** DoD 12/12 · Best practices 13/13
 */
export function CardStatusBadge({ color, isScenario, scenarioLabel }: CardStatusBadgeProps) {
  if (!isScenario || !scenarioLabel) return null;
  return <ScenarioBadge color={color} scenarioLabel={scenarioLabel} />;
}
