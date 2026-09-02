import type { ReactNode } from 'react';

import type { TimelineStep } from '../types';

// ----------------------------------------------------------------------

export interface RoadmapTimelineDemoOptions {
  /** Icon element to use for every step's dot — kept as a param since giselle-mui never imports an icon library internally. */
  icon?: ReactNode;
  /** Icon used for the not-yet-started, scenario step. */
  scenarioIcon?: ReactNode;
}

/**
 * A generic library-roadmap dataset — the primary intended consumer of
 * `RoadmapTimeline` per `docs/components/timeline/two-column/timeline-plan.md`.
 */
export function createRoadmapTimelineDemoSteps(
  options: RoadmapTimelineDemoOptions = {}
): TimelineStep[] {
  const { icon, scenarioIcon } = options;
  return [
    {
      key: 1,
      title: 'Foundation utilities',
      description: 'Theme tokens, spacing helpers, and shared type contracts shipped.',
      date: 'Q1 2026',
      color: 'success',
      done: true,
      icon,
      details: ['channelAlpha / hexToChannel / pxToRem shipped', 'GiselleThemeProvider available'],
    },
    {
      key: 2,
      title: 'Core component library',
      description: 'First wave of reusable MUI wrapper components with full Storybook coverage.',
      date: 'Q2 2026',
      color: 'success',
      done: true,
      icon,
    },
    {
      key: 3,
      title: 'Timeline component family',
      description: 'TimelineTwoColumn shipped; RoadmapTimeline in progress.',
      date: 'Q3 2026',
      color: 'primary',
      done: false,
      icon,
      details: [
        'TimelineTwoColumn — showcase variant, shipped',
        'RoadmapTimeline — documentation variant, in progress',
      ],
    },
    {
      key: 4,
      title: 'Documentation site integration',
      description: 'A candidate variant, pending confirmation from the docs team.',
      date: 'Q4 2026',
      color: 'info',
      isScenario: true,
      scenarioLabel: 'Scenario',
      icon: scenarioIcon ?? icon,
    },
  ];
}

/** A single-step dataset, for the SingleStep story. */
export function createRoadmapTimelineSingleStepDemo(icon?: ReactNode): TimelineStep[] {
  return [
    {
      key: 1,
      title: 'Kickoff',
      description: 'Everything starts somewhere.',
      date: 'Q1 2026',
      color: 'primary',
      icon,
    },
  ];
}
