import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';

import { FeatureFlowImageColumn } from './feature-flow-image-column';

// ----------------------------------------------------------------------

const allSrcs = [
  '/placeholder/frame-1.svg',
  '/placeholder/frame-2.svg',
  '/placeholder/frame-3.svg',
];

const meta: Meta<typeof FeatureFlowImageColumn> = {
  title: 'Section/Feature Flow/Image Column',
  component: FeatureFlowImageColumn,
  args: {
    activeSrc: allSrcs[0],
    ghostSrc: allSrcs[0],
    allSrcs,
    alt: 'Design systems',
  },
  decorators: [
    (Story) => (
      // A fixed-height, positioned ancestor: FeatureFlowImageColumn's own
      // root uses `position: sticky` (md+), which needs a real containing
      // block with room to travel to render meaningfully in isolation.
      <Box sx={{ position: 'relative', height: 480, maxWidth: 480 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeatureFlowImageColumn>;

// ----------------------------------------------------------------------

export const Default: Story = {};

/** The second source is active — crossfades from the first without a remount. */
export const SecondSourceActive: Story = {
  args: {
    activeSrc: allSrcs[1],
  },
};
