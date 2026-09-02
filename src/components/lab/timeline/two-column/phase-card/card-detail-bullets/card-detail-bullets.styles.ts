import type { SxProps, Theme } from '@mui/material/styles';

// ── CardDetailBullets ─────────────────────────────────────────────────────────

/** Collapse container that holds the expandable detail bullet list. */
export const detailBulletsContainerSx: SxProps<Theme> = {
  mt: 1.5,
  pt: 1.5,
  borderTop: '1px solid',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  gap: 0.75,
};

/** Task toggle row — flex container for icon + title in the expanded detail list. */
export const taskRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  py: 0.25,
};

/** Task toggle icon button sx (interactive mode). */
export const taskToggleButtonSx: SxProps<Theme> = {
  all: 'unset',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: 'color 0.2s',
  '&:focus-visible': {
    outline: '2px solid',
    outlineColor: 'primary.main',
    borderRadius: '50%',
  },
};

/** Task toggle icon static (read-only mode). */
export const taskIconStaticSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  transition: 'color 0.2s',
};

/** Task title sx — done state passed dynamically. */
export const taskTitleSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'text.disabled' : 'text.secondary',
  lineHeight: 1.6,
  textDecoration: isDone ? 'line-through' : 'none',
  transition: 'color 0.2s, text-decoration 0.2s',
});

/** Task toggle icon colour sx — done state passed dynamically (interactive mode). */
export const taskToggleColorSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'success.main' : 'text.disabled',
  '&:hover': { color: isDone ? 'success.dark' : 'text.secondary' },
});

/** Task icon colour sx — done state passed dynamically (read-only mode). */
export const taskIconColorSx = (isDone: boolean): SxProps<Theme> => ({
  color: isDone ? 'success.main' : 'text.disabled',
});
