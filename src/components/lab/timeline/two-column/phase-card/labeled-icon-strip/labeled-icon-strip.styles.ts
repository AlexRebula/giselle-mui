import type { SxProps, Theme } from '@mui/material/styles';

// ── LabeledIconStrip ──────────────────────────────────────────────────────────

/** Section overline label inside a `LabeledIconStrip` (clients, tech stack, etc.). */
export const labeledIconStripLabelSx: SxProps<Theme> = {
  display: 'block',
  mb: 1,
  fontSize: '0.75rem',
  color: 'text.disabled',
};

/** Root Box wrapper for `LabeledIconStrip` — top margin separates it from the previous section. */
export const labeledIconStripWrapperSx: SxProps<Theme> = {
  mt: 2.5,
};
