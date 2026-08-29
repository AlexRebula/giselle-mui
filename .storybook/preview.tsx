import type { Preview } from '@storybook/react';
import { domMax, LazyMotion } from 'framer-motion';
import { ThemeProvider, createTheme, extendTheme } from '@mui/material/styles';
import { addCollection } from '@iconify/react';
import { giselleThemeOptions } from '../src/utils/theme/preset/theme-preset';
import { solarStorybookIcons } from './solar-storybook-icons';

// Register the Solar icon set offline so icons don't flicker due to CDN fetches.
addCollection(solarStorybookIcons as Parameters<typeof addCollection>[0]);

// Storybook's canvas is a fixed white background that never follows the
// developer's OS dark-mode preference. Two separate MUI mechanisms both
// need pinning away from OS-driven behaviour, not just one:
// 1. `colorSchemeSelector` controls how the *stylesheet* is generated —
//    pinned away from its 'media' default (production apps, incl.
//    giselleTheme itself, keep 'media'; see GiselleThemeProvider's own
//    documented gotcha) so dark-mode CSS variables live under an explicit
//    class instead of an unconditional `@media (prefers-color-scheme)`
//    block.
// 2. `ThemeProvider`'s `defaultMode` prop (default: 'system') is a
//    SEPARATE, JS-level mechanism: even with (1) fixed, ThemeProvider
//    still resolves 'system' mode via its own `matchMedia` check at
//    runtime and applies the resulting class itself — reproducing the
//    identical OS-dependent bug through a different path. Both must be
//    pinned for Storybook to render deterministically regardless of the
//    developer's OS setting.
const STORYBOOK_COLOR_SCHEME_SELECTOR = '.mode-%s';

const muiDefaultTheme = createTheme({
  cssVariables: { colorSchemeSelector: STORYBOOK_COLOR_SCHEME_SELECTOR },
  colorSchemes: { light: true, dark: true },
});

const giselleStorybookTheme = extendTheme({
  ...giselleThemeOptions,
  colorSchemeSelector: STORYBOOK_COLOR_SCHEME_SELECTOR,
});

// Registry of themes available in the Storybook toolbar.
const themes: Record<string, typeof muiDefaultTheme> = {
  'mui-default': muiDefaultTheme,
  giselle: giselleStorybookTheme as unknown as typeof muiDefaultTheme,
};

// Hide low-signal inherited args globally so controls focus on design decisions.
// Stories can still override this with local `parameters.controls.exclude`.
const STORYBOOK_GLOBAL_CONTROLS_EXCLUDE = [
  /^classes$/,
  /^slotProps$/,
  /^slots$/,
  /^ownerState$/,
  /^theme$/,
  /^as$/,
  /^ref$/,
];

/**
 * Toolbar dropdown — switch between registered themes in the Storybook canvas.
 * Each `value` must match a key in the `themes` registry above.
 */
export const globalTypes = {
  theme: {
    name: 'Theme',
    defaultValue: 'giselle',
    toolbar: {
      icon: 'paintbrush',
      items: [
        { value: 'mui-default', title: 'MUI Default' },
        { value: 'giselle', title: '🥭 Giselle' },
      ],
      dynamicTitle: true,
    },
  },
};

// Wraps every story in MUI ThemeProvider so that --mui-palette-* CSS custom
// properties are injected into the DOM — required by giselle-mui components that
// reference theme.vars.palette.* or var(--mui-palette-...) directly.
//
// Also wraps every story in a (non-strict) LazyMotion provider with all features
// loaded — required for `MotionViewport` (used by `FeatureFlowSection`), which
// renders via `m.div` rather than `motion.div` (see src/components/motion/README.md).
const preview: Preview = {
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const key = context.globals['theme'] as string | undefined;
      const selectedTheme = (key && themes[key]) || muiDefaultTheme;
      return (
        <ThemeProvider theme={selectedTheme} defaultMode="light">
          <LazyMotion features={domMax}>
            <Story />
          </LazyMotion>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: 'centered',
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      exclude: STORYBOOK_GLOBAL_CONTROLS_EXCLUDE,
    },
    docs: {
      controls: {
        sort: 'requiredFirst',
        exclude: STORYBOOK_GLOBAL_CONTROLS_EXCLUDE,
      },
    },
  },
};

export default preview;
