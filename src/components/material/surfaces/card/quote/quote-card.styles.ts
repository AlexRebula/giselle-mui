import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Opening decorative quotation mark glyph.
 *
 * Dynamic — tints to the card's palette `color`.
 *
 * ⚠️ Performance note: returns a new object on every call.
 * Wrap in `useMemo` if the component re-renders frequently with a stable `color`.
 */
export const quoteMarkSx = (color: string): SxProps<Theme> => ({
  lineHeight: 1,
  fontSize: '4rem',
  color: `${color}.main`,
  opacity: 0.4,
  fontFamily: 'Georgia, serif',
  userSelect: 'none',
  flexShrink: 0,
  mt: -0.5,
});

/**
 * Body text of the quote — italicised, light-weight, readable line height.
 */
export const quoteTextSx: SxProps<Theme> = {
  fontStyle: 'italic',
  fontWeight: 'fontWeightLight',
  color: 'text.secondary',
  lineHeight: 1.85,
};

/** Root row: decorative quote-mark column beside the text+attribution column. */
export const quoteCardRowSlotSx: SxProps<Theme> = {
  display: 'flex',
  gap: 2,
};

/** Right-hand column: takes remaining width next to the quote mark. */
export const quoteCardTextSlotSx: SxProps<Theme> = {
  flex: 1,
  minWidth: 0,
};

/** Author + separator + source row beneath the quote text. */
export const quoteAttributionRowSlotSx: SxProps<Theme> = {
  mt: 2,
  color: 'text.disabled',
  alignItems: 'center',
};

/** Author name — the more prominent half of the attribution line. */
export const quoteAuthorSx: SxProps<Theme> = {
  fontWeight: 'fontWeightMedium',
};

/** Decorative "·" divider between author and source — purely visual, carries `aria-hidden`. */
export const quoteSeparatorSx: SxProps<Theme> = {
  opacity: 0.6,
};

/** Source label — the less prominent half of the attribution line. */
export const quoteSourceSx: SxProps<Theme> = {
  opacity: 0.72,
};

// ----------------------------------------------------------------------

/**
 * `Paper` root for `QuoteCard` — tinted surface with a palette-keyed border.
 *
 * @param color - MUI palette key for the tint and border colour.
 */
export const quoteCardPaperSx =
  (color: string): SxProps<Theme> =>
  (theme) => ({
    p: 3,
    borderRadius: 2,
    bgcolor: `rgba(${
      (theme.vars!.palette as unknown as Record<string, { mainChannel: string }>)[color]
        ?.mainChannel
    } / 0.06)`,
    border: `1px solid rgba(${
      (theme.vars!.palette as unknown as Record<string, { mainChannel: string }>)[color]
        ?.mainChannel
    } / 0.12)`,
  });
