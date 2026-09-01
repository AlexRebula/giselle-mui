import type { MotionProps } from 'framer-motion';
import type { BoxProps } from '@mui/material/Box';

// ----------------------------------------------------------------------

/** Props for `AnimatedHeroHeading`. */
export type AnimatedHeroHeadingProps = Omit<BoxProps, 'sx' | 'children'> & {
  /**
   * The plain-text portion before the animated highlight span.
   * Rendered as a text node inside the `<h1>`.
   */
  subheading: string;
  /**
   * The highlighted word(s). Rendered with an infinitely cycling linear gradient
   * animation using `theme.vars.palette.primary.main` and `theme.vars.palette.warning.main`.
   */
  highlight: string;
  /**
   * Motion props for the fade-in wrapper `motion.div`.
   * Defaults to `fade('inUp', { distance: 24 })`.
   */
  motionProps?: MotionProps;
  /**
   * Additional sx overrides applied to the `<h1>` Box element.
   *
   * Use to override `fontFamily`, `maxWidth`, `textAlign`, etc.
   */
  sx?: BoxProps['sx'];
};
