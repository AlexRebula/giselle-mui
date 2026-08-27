import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/**
 * Root `Chip` sx for `SelectableLabel`.
 *
 * Mirrors `SelectableCard`'s selected-ring pattern (box-shadow, not border,
 * so selection never shifts layout) and keyboard focus ring, adapted to a
 * pill shape.
 *
 * @param selected - Whether the label is currently selected.
 */
export const selectableLabelSx =
  (selected: boolean): SxProps<Theme> =>
  (theme) => {
    const vars = theme.vars!;
    return {
      cursor: 'pointer',
      // Set explicitly rather than left to inherit — Chip's own base styles
      // set `color: inherit`, which makes the label's visible color depend
      // on whatever ambient text color the chip happens to be mounted
      // under. StatusLabel (a working precedent) never relies on this
      // either; every color this component shows should be self-contained.
      color: vars.palette.text.primary,
      transition: theme.transitions.create(['background-color', 'box-shadow'], {
        duration: theme.transitions.duration.shorter,
      }),
      // --- Keyboard focus ring ---
      // .Mui-focusVisible is applied on keyboard navigation only, so mouse
      // users never see this ring — same convention as SelectableCard.
      '&.Mui-focusVisible': {
        outline: `3px solid ${vars.palette.primary.main}`,
        outlineOffset: 2,
      },
      // --- Selected ring (box-shadow, doesn't affect layout) ---
      ...(selected && {
        boxShadow: `0 0 0 1.5px ${vars.palette.text.primary}`,
        bgcolor: vars.palette.action.selected,
      }),
      // --- Disabled: muted + no pointer (Chip also sets aria-disabled) ---
      '&.Mui-disabled': {
        opacity: 0.48,
        cursor: 'default',
        pointerEvents: 'none',
      },
    };
  };

/** sx for the checkmark icon shown only when selected. */
export const selectableLabelIconSx: SxProps<Theme> = {
  fontSize: '1rem',
  color: 'text.primary',
};
