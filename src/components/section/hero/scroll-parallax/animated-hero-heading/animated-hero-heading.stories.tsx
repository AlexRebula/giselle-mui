import type { Meta, StoryObj } from '@storybook/react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import {
  BREAKPOINTS,
  breakpointLabelSx,
  buildBreakpointWidthSx,
  responsiveWrapperSx,
} from '../../../../../stories-defaults';
import { AnimatedHeroHeading } from './animated-hero-heading';

// ----------------------------------------------------------------------
// Storybook metadata
// ----------------------------------------------------------------------

const meta: Meta<typeof AnimatedHeroHeading> = {
  title: 'Section/Hero/Scroll Parallax/Animated Hero Heading',
  component: AnimatedHeroHeading,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
**AnimatedHeroHeading** is an animated \`<h1>\` with a cycling gradient highlight span, designed
to be passed as \`ScrollParallaxHero\`'s \`heading\` slot.

**Key design decisions:**

- **Two independent animations** — the whole heading fades in on mount via \`motionProps\`
  (defaults to \`fade('inUp', { distance: 24 })\`); the \`highlight\` word separately cycles its
  gradient \`backgroundPosition\` on an infinite 20-second loop.
- **\`ref\` and passthrough land on the \`<h1>\`** — not the outer \`motion.div\`, which only exists
  to carry \`motionProps\` and has nothing else a consumer would want a handle on.
- **No baked-in \`fontFamily\`** — override via \`sx\` to apply any custom typeface from the
  active theme.
`,
      },
    },
  },
  argTypes: {
    motionProps: { control: false },
    sx: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedHeroHeading>;

// ----------------------------------------------------------------------
// Stories
// ----------------------------------------------------------------------

/**
 * Default: subheading + gradient highlight, fading in on mount.
 */
export const Default: Story = {
  args: {
    subheading: 'The work of',
    highlight: 'Platform Team',
  },
};

/**
 * CustomFont: overrides `fontFamily` via `sx`, following the pattern documented in the
 * component's own JSDoc. `fontFamily` is intentionally not baked into `headingH1Sx` so any
 * theme typeface can be applied per-usage.
 */
export const CustomFont: Story = {
  args: {
    subheading: 'The work of',
    highlight: 'Platform Team',
    sx: { fontFamily: 'Georgia, "Times New Roman", serif' },
  },
  parameters: {
    docs: {
      description: {
        story:
          '`sx={{ fontFamily: ... }}` overrides the default theme typeface. Compare with ' +
          '`Default` to see the difference — `headingH1Sx` never sets `fontFamily` itself.',
      },
    },
  },
};

/**
 * CustomMotion: overrides `motionProps` to skip the fade-in entirely — useful when the
 * heading is not a descendant of a `MotionContainer`/`MotionViewport` stagger parent and
 * should simply be visible immediately.
 */
export const CustomMotion: Story = {
  args: {
    subheading: 'The work of',
    highlight: 'Platform Team',
    motionProps: { initial: { opacity: 1 }, animate: { opacity: 1 } },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Overriding `motionProps` replaces the default `fade("inUp", ...)` mount animation ' +
          'entirely — here with a no-op transition so the heading renders immediately visible.',
      },
    },
  },
};

/**
 * Responsive: the heading rendered at each MUI standard breakpoint width.
 * The `lg+` font-size bump (72px) is the key visual difference to verify here.
 */
export const Responsive: Story = {
  render: () => (
    <Box sx={responsiveWrapperSx}>
      {BREAKPOINTS.map(({ label, width }) => (
        <div key={width}>
          <Typography variant="caption" sx={breakpointLabelSx}>
            {label}
          </Typography>
          <Box sx={buildBreakpointWidthSx(width)}>
            <AnimatedHeroHeading subheading="The work of" highlight="Platform Team" />
          </Box>
        </div>
      ))}
    </Box>
  ),
};
