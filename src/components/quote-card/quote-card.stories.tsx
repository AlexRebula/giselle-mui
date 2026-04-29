import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';

import { QuoteCard } from './quote-card';

// ----------------------------------------------------------------------

type QuoteColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

const ALL_COLORS: QuoteColor[] = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

const SAMPLE_QUOTE =
  'Alex transformed our legacy system into a maintainable, modern React platform. The quality of the architecture and the attention to detail were exceptional.';

const SHORT_QUOTE = 'Excellent work, delivered on time.';

const meta: Meta<typeof QuoteCard> = {
  component: QuoteCard,
  title: 'Components/QuoteCard',
};

export default meta;
type Story = StoryObj<typeof QuoteCard>;

// ----------------------------------------------------------------------

/** Full card with author, source, and default primary color. */
export const Default: Story = {
  args: {
    quote: SAMPLE_QUOTE,
    author: 'Dominic Pollaers',
    source: 'NBN Project',
    color: 'primary',
    sx: { maxWidth: 440 },
  },
  argTypes: {
    sx: { control: false },
  },
};

/** All six palette color variants — light/dark mode adaptive. */
export const AllColors: Story = {
  render: () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 380px)', gap: 2 }}>
      {ALL_COLORS.map((color) => (
        <QuoteCard
          key={color}
          quote={SAMPLE_QUOTE}
          author="Dominic Pollaers"
          source="NBN Project"
          color={color}
        />
      ))}
    </Box>
  ),
};

/** Without attribution — quote-only form. */
export const NoAttribution: Story = {
  args: {
    quote: SHORT_QUOTE,
    color: 'info',
    sx: { maxWidth: 380 },
  },
  argTypes: {
    sx: { control: false },
  },
};

/** With author but without source — separator dot is hidden. */
export const AuthorOnly: Story = {
  args: {
    quote: SAMPLE_QUOTE,
    author: 'Dominic Pollaers',
    color: 'success',
    sx: { maxWidth: 440 },
  },
  argTypes: {
    sx: { control: false },
  },
};
