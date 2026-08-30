import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { contentPlaceholderSx } from '../../../../stories-defaults';
import { BasicSection } from './basic-section';

// ----------------------------------------------------------------------

const meta: Meta<typeof BasicSection> = {
  title: 'Material/Layout/Basic Section',
  component: BasicSection,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof BasicSection>;

// ----------------------------------------------------------------------

/**
 * Default: `decorated` (the default) renders corner plus-marks and border
 * lines. Only visible at >=1440px viewport width — resize the preview or use
 * a wide browser window to see them.
 */
export const Default: Story = {
  render: () => (
    <BasicSection>
      <Box sx={contentPlaceholderSx}>
        <Typography variant="h4">Section content</Typography>
        <Typography variant="body2" color="text.secondary">
          Widen the viewport past 1440px to see the corner marks and border lines.
        </Typography>
      </Box>
    </BasicSection>
  ),
};

/** `decorated={false}` — a plain section with none of the corner marks or border lines. */
export const NotDecorated: Story = {
  render: () => (
    <BasicSection decorated={false}>
      <Box sx={contentPlaceholderSx}>
        <Typography variant="h4">Section content</Typography>
        <Typography variant="body2" color="text.secondary">
          No decorative frame — `decorated={false}`.
        </Typography>
      </Box>
    </BasicSection>
  ),
};
