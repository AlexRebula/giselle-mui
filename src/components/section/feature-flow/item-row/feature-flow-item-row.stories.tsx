import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@mui/material/Stack';

import { FeatureFlowItemRow } from './feature-flow-item-row';

// ----------------------------------------------------------------------

const meta: Meta<typeof FeatureFlowItemRow> = {
  title: 'Section/Feature Flow/Item Row',
  component: FeatureFlowItemRow,
  args: {
    icon: 'solar:widget-bold-duotone',
    title: 'Design systems',
    description: 'Consistent, accessible UI components at scale.',
    expandable: true,
    isSelected: false,
    isActive: false,
    isExpanded: false,
    onHover: () => {},
    onFocus: () => {},
    onSelect: () => {},
  },
  decorators: [
    (Story) => (
      <Stack spacing={1.5} sx={{ maxWidth: 400 }}>
        <Story />
      </Stack>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FeatureFlowItemRow>;

// ----------------------------------------------------------------------

export const Default: Story = {};

/** The last-clicked item: a persistent elevated card, regardless of hover. */
export const Selected: Story = {
  args: { isSelected: true },
};

/** The currently-previewed item (hover or focus), before any click. */
export const Active: Story = {
  args: { isActive: true },
};

/** This item's detail panel is open: a left inset accent shows it. */
export const Expanded: Story = {
  args: { isSelected: true, isExpanded: true },
};

/**
 * No expansion data (`expandable: false`) — a quiet, non-clickable row, but
 * still a real button: hovering/focusing it still drives the image column.
 */
export const NotExpandable: Story = {
  args: {
    expandable: false,
    title: 'Brand and visual identity',
    description: 'A quiet, informational item with no expansion data.',
  },
};
