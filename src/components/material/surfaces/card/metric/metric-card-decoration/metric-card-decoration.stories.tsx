import type { Meta, StoryObj } from '@storybook/react';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material/styles';

import Box from '@mui/material/Box';

import { MetricCardDecoration } from './metric-card-decoration';
import type { MetricCardColor } from '../types';

// ----------------------------------------------------------------------

const ALL_COLORS: MetricCardColor[] = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
];

const swatchGridSx: SystemStyleObject<Theme> = { display: 'flex', flexWrap: 'wrap', gap: 3 };

const swatchSx: SystemStyleObject<Theme> = {
  position: 'relative',
  width: 120,
  height: 120,
  bgcolor: 'background.paper',
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
};

const meta: Meta<typeof MetricCardDecoration> = {
  component: MetricCardDecoration,
  title: 'Material/Surfaces/Card/Metric/Decoration',
  argTypes: {
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof MetricCardDecoration>;

// ----------------------------------------------------------------------

/**
 * `MetricCardDecoration` rendered standalone (outside `MetricCard`) — all six
 * palette color variants, each clipped by a swatch box the same way `MetricCard`
 * clips it via `overflow: hidden`.
 */
export const AllColors: Story = {
  render: () => (
    <Box sx={swatchGridSx}>
      {ALL_COLORS.map((color) => (
        <Box key={color} sx={swatchSx}>
          <MetricCardDecoration color={color} />
        </Box>
      ))}
    </Box>
  ),
};
