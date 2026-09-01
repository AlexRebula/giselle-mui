import type { Meta, StoryObj } from '@storybook/react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { SectionCaption } from './section-caption';

// ----------------------------------------------------------------------

const meta: Meta<typeof SectionCaption> = {
  component: SectionCaption,
  title: 'Material/Layout/Section Title/Caption',
  argTypes: {
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SectionCaption>;

// ----------------------------------------------------------------------

/** `SectionCaption` used standalone — for when you need just the overline label. */
export const Standalone: Story = {
  render: () => (
    <Stack spacing={2}>
      <SectionCaption title="Section label" />
      <Typography variant="h3">Heading rendered separately</Typography>
    </Stack>
  ),
};
