import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------
// AnimatedHeroHeading sx constants
//
// Used only by this sub-component — not shared with `ScrollParallaxHero`.

/**
 * `<h1>` Box — resets margin, caps width at 680px, enables flex wrapping for the
 * inline gradient span, and bumps font size to 72px on `lg+` screens.
 */
export const headingH1Sx: SxProps<Theme> = (theme) => ({
  my: 0,
  mx: 'auto',
  maxWidth: 680,
  display: 'flex',
  flexWrap: 'wrap',
  typography: 'h2',
  justifyContent: 'center',
  [theme.breakpoints.up('lg')]: {
    fontSize: theme.typography.pxToRem(72),
    lineHeight: '90px',
  },
});

/**
 * Gradient highlight span — infinitely cycles a 5-stop `primary → warning → primary`
 * linear gradient across 400% background-size, clipped to the text shape.
 *
 * Uses `WebkitTextFillColor: 'transparent'` instead of `color` so the gradient
 * is visible on Safari where `-webkit-background-clip: text` requires it.
 */
export const headingHighlightSx: SxProps<Theme> = (theme) => ({
  backgroundImage: `linear-gradient(300deg, ${theme.vars!.palette.primary.main} 0%, ${theme.vars!.palette.warning.main} 25%, ${theme.vars!.palette.primary.main} 50%, ${theme.vars!.palette.warning.main} 75%, ${theme.vars!.palette.primary.main} 100%)`,
  backgroundSize: '400%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  ml: { xs: 0.75, md: 1, xl: 1.5 },
});
