import type { SxProps, Theme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';

/**
 * Props for `<BasicSection>`.
 *
 * @todo Fill in remaining props when implementation begins.
 * See README.md for the planned API.
 */
export interface BasicSectionProps extends Omit<BoxProps<'section'>, 'component'> {
  /** Section content. */
  children: React.ReactNode;
  /**
   * Renders the corner plus-marks and border lines around the content.
   * @default true
   */
  decorated?: boolean;
  /** MUI sx prop: forwarded to the root `<section>` element. */
  sx?: SxProps<Theme>;
}
