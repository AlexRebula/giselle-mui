import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type TextSlotProps = {
  sx?: SxProps<Theme>;
};

export type SectionTitleProps = Omit<BoxProps, 'title'> & {
  /**
   * Optional gradient accent word appended to `title`.
   * Rendered with reduced opacity and a horizontal gradient that fades from
   * `text.primary` to a 20% alpha of the same channel.
   */
  txtGradient?: string;
  /** Main heading text. */
  title: ReactNode;
  /**
   * Rendered tag for the heading. `h1` keeps this component's own `h2`
   * visual sizing/weight - only the semantic tag changes, so a page's one
   * real `<h1>` (e.g. its own hero) can still look identical to every other
   * `SectionTitle` on the page.
   * @default 'h2'
   */
  titleComponent?: 'h1' | 'h2';
  /**
   * Short overline label rendered above the heading.
   * Styled as `overline` typography in `text.disabled` colour.
   */
  caption?: ReactNode;
  /**
   * Supporting description text rendered below the heading.
   * Styled as `body1` in `text.secondary` colour.
   */
  description?: ReactNode;
  /**
   * `sx` overrides for individual text slots.
   */
  slotProps?: {
    title?: TextSlotProps;
    caption?: TextSlotProps;
    description?: TextSlotProps;
  };
};

export type SectionCaptionProps = {
  title: ReactNode;
  sx?: SxProps<Theme>;
};
