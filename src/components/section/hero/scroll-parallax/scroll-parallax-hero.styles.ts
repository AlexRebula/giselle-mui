import type { MotionValue } from 'framer-motion';
import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// ScrollParallaxHero — sx constants and factories
// ----------------------------------------------------------------------

/**
 * Root `<section>` — sets the scroll frame height.
 *
 * On md+: fixes to 100vh so content stays in view while the user scrolls through
 * the outer placeholder div. `willChange: 'opacity'` hints the browser to composite
 * this layer independently.
 */
export const heroRootSx: SxProps<Theme> = (theme) => ({
  overflow: 'hidden',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    minHeight: 760,
    height: '100vh',
    maxHeight: 1440,
    display: 'block',
    willChange: 'opacity',
  },
});

/**
 * Inner Box — layout spine for the hero content.
 *
 * On md+: `position: fixed` so the content panel stays anchored to the viewport
 * while the outer section div scrolls past it (the parallax-scroll illusion).
 */
export const heroInnerWrapSx: SxProps<Theme> = (theme) => ({
  width: 1,
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
  [theme.breakpoints.up('md')]: {
    height: 1,
    position: 'fixed',
    maxHeight: 'inherit',
    minHeight: '300px',
  },
});

/**
 * MUI `Container` — slot stagger parent and layout spine.
 *
 * `zIndex: 9` keeps the content layer above any `background` slot content.
 * On md+: `flex: 1 1 auto; justifyContent: center` fills the viewport vertically.
 */
export const heroContainerSx: SxProps<Theme> = (theme) => ({
  gap: 2,
  zIndex: 9,
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  pb: 0,
  minHeight: { xs: '300px' },
  [theme.breakpoints.up('md')]: {
    flex: '1 1 auto',
    justifyContent: 'center',
  },
});

/** Logo slot wrapper — `position: relative; display: inline-flex`. */
export const heroLogoBoxSx: SxProps<Theme> = {
  position: 'relative',
  display: 'inline-flex',
};

/** Heading + text Stack — centres all text slots. */
export const heroStackSx: SxProps<Theme> = {
  textAlign: 'center',
};

// ----------------------------------------------------------------------
// MotionValue style factories — parallax layers
// ----------------------------------------------------------------------

/**
 * Y-axis parallax layer style. Accepts a `MotionValue<number>` produced by `useTransformY`
 * and returns the `style` object for a `motion.div` parallax wrapper.
 *
 * Extracted as a factory so no `style={{...}}` object literal ever appears inline in JSX.
 */
export const parallaxYStyle = (y: MotionValue<number>) => ({ y });

/**
 * Opacity fade layer style. Accepts a `MotionValue<number>` produced by `useTransform`
 * and returns the `style` object for the outermost `motion.div` opacity wrapper.
 */
export const parallaxOpacityStyle = (opacity: MotionValue<number>) => ({ opacity });

// `AnimatedHeroHeading`'s sx constants (`headingH1Sx`, `headingHighlightSx`) now live in
// `animated-hero-heading/animated-hero-heading.styles.ts` — used only by that sub-component.
