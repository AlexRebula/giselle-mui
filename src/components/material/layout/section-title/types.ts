import type { ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type TextSlotProps = {
  sx?: SxProps<Theme>;
};

/** Heading levels `SectionTitle`'s `titleComponent`/`titleVariant` accept. */
export type SectionTitleHeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

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
   * Rendered tag for the heading - independent of `titleVariant` (its visual
   * size), matching how MUI's own `Typography` separates `component` from
   * `variant`. Set this alone to change only the semantic tag while keeping
   * this component's default `h2` sizing (e.g. a page's one real `<h1>`
   * that should still look identical to every other `SectionTitle` on the
   * page). Combine with `titleVariant` when nesting a real heading hierarchy
   * (a section's own subsection using `titleComponent="h3"` at a visually
   * smaller `titleVariant="h3"`, for instance).
   * @default 'h2'
   */
  titleComponent?: SectionTitleHeadingLevel;
  /**
   * Visual size/weight for the heading - independent of `titleComponent`
   * (its semantic tag). Defaults to `'h2'` sizing regardless of
   * `titleComponent`, so a `titleComponent="h1"` heading still looks
   * identical to every other `SectionTitle` unless a different
   * `titleVariant` is explicitly requested.
   * @default 'h2'
   */
  titleVariant?: SectionTitleHeadingLevel;
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
