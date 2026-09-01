import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';

import { FeatureFlowHighlightCarousel } from './feature-flow-highlight-carousel';
import type { FeatureFlowHighlightCard } from '../types';

// ----------------------------------------------------------------------

const cards: FeatureFlowHighlightCard[] = [
  {
    title: 'Shipped 3 releases',
    description: 'In under a month, with zero regressions caught post-release.',
    media: '/placeholder/frame-1.svg',
    href: '#',
  },
  {
    title: '99% test coverage',
    description: 'Every component ships with unit tests and a Storybook story.',
    media: '/placeholder/frame-2.svg',
  },
  {
    title: 'Adopted by 4 teams',
    description: 'Rolled out across product, marketing, and two partner squads.',
    media: '/placeholder/frame-3.svg',
    href: '#',
  },
];

const meta: Meta<typeof FeatureFlowHighlightCarousel> = {
  title: 'Section/Feature Flow/Highlight Carousel',
  component: FeatureFlowHighlightCarousel,
  args: {
    cards,
  },
  decorators: [
    (Story) => (
      <Box sx={{ maxWidth: 480 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeatureFlowHighlightCarousel>;

// ----------------------------------------------------------------------

export const Default: Story = {};

/** A single card: the prev/next controls are hidden since there's nothing to cycle to. */
export const SingleCard: Story = {
  args: {
    cards: [cards[0]!],
  },
};

/** No `href` on the selected card — the "Learn more" link doesn't render. */
export const WithoutLink: Story = {
  args: {
    cards: [{ ...cards[1]! }],
  },
};
