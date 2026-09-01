import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import {
  buildBreakpointWidthSx,
  breakpointLabelSx,
  BREAKPOINTS,
} from '../../../../stories-defaults';
import { SectionTitle } from './section-title';

// ----------------------------------------------------------------------

const meta: Meta<typeof SectionTitle> = {
  title: 'Material/Layout/Section Title',
  component: SectionTitle,
  parameters: { layout: 'padded' },
  argTypes: {
    slotProps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

// ----------------------------------------------------------------------

/** Full composition: caption + title + gradient accent + description. */
export const Full: Story = {
  args: {
    caption: 'What we offer',
    title: 'Build better',
    txtGradient: 'faster',
    description:
      'A curated set of components that removes boilerplate and encodes non-obvious MUI patterns so you can focus on your product.',
  },
};

/** Title only — minimum required prop. */
export const TitleOnly: Story = {
  args: {
    title: 'Our components',
  },
};

/** With caption and gradient but no description. */
export const CaptionAndGradient: Story = {
  args: {
    caption: 'Giselle MUI',
    title: 'Components',
    txtGradient: 'that ship',
  },
};

/** Centred alignment — common for hero and marketing sections. */
export const Centred: Story = {
  args: {
    ...Full.args,
    sx: { textAlign: 'center', alignItems: 'center' },
  },
};

/**
 * `titleComponent="h1"` renders the page's actual `<h1>` tag while keeping
 * `titleVariant`'s default `h2` sizing - use for the one section (e.g. a
 * homepage hero) that should carry the page's real H1, so it still looks
 * identical to every other `SectionTitle` on the same page.
 */
export const AsPageH1: Story = {
  args: {
    ...Full.args,
    titleComponent: 'h1',
  },
};

/**
 * `titleComponent` and `titleVariant` are independent - the same way MUI's
 * own `Typography` separates `component` from `variant`. A nested heading
 * hierarchy sets both together: this section's own subsection renders as a
 * real `<h3>` at a visibly smaller `h3`-sized `titleVariant`, distinct from
 * its parent's `h2`.
 */
export const NestedSubsection: Story = {
  render: () => (
    <Stack spacing={4}>
      <SectionTitle caption="Parent section" title="Everything you need" titleVariant="h2" />
      <SectionTitle title="A nested subsection" titleComponent="h3" titleVariant="h3" />
    </Stack>
  ),
};

/**
 * Responsive: verify layout at each standard breakpoint.
 *
 * `SectionCaption` used standalone has its own dedicated story: see
 * `section-caption/section-caption.stories.tsx`.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Stack spacing={4}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={buildBreakpointWidthSx(width)}>
            <SectionTitle
              caption="Giselle MUI"
              title="Build better"
              txtGradient="faster"
              description="Components that encode non-obvious MUI patterns."
            />
          </Box>
        </div>
      ))}
    </Stack>
  ),
};
