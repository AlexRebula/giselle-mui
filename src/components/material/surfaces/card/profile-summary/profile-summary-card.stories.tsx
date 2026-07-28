import type { Meta, StoryObj } from '@storybook/react';

import { ProfileSummaryCard } from './profile-summary-card';

// ----------------------------------------------------------------------

const meta: Meta<typeof ProfileSummaryCard> = {
  title: 'Material/Surfaces/Card/ProfileSummary',
  component: ProfileSummaryCard,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof ProfileSummaryCard>;

// ----------------------------------------------------------------------

/**
 * Default state — name, role, and three stats.
 */
export const Default: Story = {
  args: {
    name: 'Nami',
    role: 'Navigator',
    stats: [
      { label: 'Tasks done', value: 12 },
      { label: 'Earned', value: '$240' },
      { label: 'Pending', value: '$60' },
    ],
  },
};

/**
 * No role — the role line is absent when the prop is not provided.
 */
export const NoRole: Story = {
  args: {
    name: 'Nami',
    stats: [{ label: 'Tasks done', value: 12 }],
  },
};
