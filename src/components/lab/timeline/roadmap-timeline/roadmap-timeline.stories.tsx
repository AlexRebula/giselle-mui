import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  BREAKPOINTS,
  breakpointLabelSx,
  buildBreakpointPaddedWidthSx,
  responsiveWrapperSx,
} from '../../../../stories-defaults';
import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import type { TimelineStep } from './types';
import {
  createRoadmapTimelineDemoSteps,
  createRoadmapTimelineMultiScenarioDemo,
  createRoadmapTimelinePerStepSideDemo,
  createRoadmapTimelineSingleStepDemo,
} from './__fixtures__/roadmap-timeline.fixtures';
import { RoadmapTimeline } from './roadmap-timeline';

// ----------------------------------------------------------------------

const meta: Meta<typeof RoadmapTimeline> = {
  title: 'Lab/Timeline/Roadmap Timeline',
  component: RoadmapTimeline,
  parameters: { layout: 'padded' },
  argTypes: {
    steps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof RoadmapTimeline>;

// ----------------------------------------------------------------------

const ICON_CHECK = <GiselleIcon icon="solar:check-circle-bold" width={16} />;
const ICON_ROCKET = <GiselleIcon icon="solar:rocket-bold" width={16} />;
const ICON_STAR = <GiselleIcon icon="solar:star-bold" width={16} />;

// ----------------------------------------------------------------------

export const Default: Story = {
  args: {
    steps: createRoadmapTimelineDemoSteps({ icon: ICON_ROCKET, scenarioIcon: ICON_STAR }),
  },
};

export const AllDone: Story = {
  args: {
    steps: createRoadmapTimelineDemoSteps({ icon: ICON_CHECK }).map((step): TimelineStep => ({
      ...step,
      done: true,
      isScenario: false,
    })),
  },
};

export const WithScenarios: Story = {
  args: {
    steps: createRoadmapTimelineMultiScenarioDemo({ icon: ICON_ROCKET, scenarioIcon: ICON_STAR }),
  },
};

export const SingleStep: Story = {
  args: {
    steps: createRoadmapTimelineSingleStepDemo(ICON_ROCKET),
  },
};

export const ColorVariants: Story = {
  args: {
    steps: (['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const).map(
      (color, index): TimelineStep => ({
        key: index,
        title: color[0]!.toUpperCase() + color.slice(1),
        description: `Dot rendered with the "${color}" palette key.`,
        date: 'Q1 2026',
        color,
        icon: ICON_STAR,
      })
    ),
  },
};

export const AlternatePosition: Story = {
  args: {
    steps: createRoadmapTimelineDemoSteps({ icon: ICON_ROCKET, scenarioIcon: ICON_STAR }),
    position: 'alternate',
  },
};

export const PerStepSideOverride: Story = {
  args: {
    steps: createRoadmapTimelinePerStepSideDemo(ICON_ROCKET),
  },
};

// ----------------------------------------------------------------------

/**
 * Responsive story — verify layout at each MUI standard breakpoint.
 * The component is single-column at all widths; container width is the only variable.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => {
    const steps = createRoadmapTimelineDemoSteps({ icon: ICON_ROCKET, scenarioIcon: ICON_STAR });
    return (
      <Box sx={responsiveWrapperSx}>
        {BREAKPOINTS.map(({ label, width }) => (
          <div key={label}>
            <Typography variant="overline" sx={breakpointLabelSx}>
              {label}
            </Typography>
            <Box sx={buildBreakpointPaddedWidthSx(width)}>
              <RoadmapTimeline steps={steps.slice(0, 3)} />
            </Box>
          </div>
        ))}
      </Box>
    );
  },
};
