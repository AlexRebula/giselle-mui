import type { SxProps, Theme } from '@mui/material/styles';

// ── CardCornerAlertBadge ──────────────────────────────────────────────────────

/** Tooltip content column — stacks alert rows with spacing. */
export const tooltipAlertListSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 1.25,
  py: 0.5,
  px: 0.25,
};

/** One alert row inside the tooltip content column — icon + message side by side. */
export const tooltipAlertRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
};

/** Alert message Typography inside a tooltip alert row. */
export const tooltipAlertMessageSx: SxProps<Theme> = {
  lineHeight: 1.55,
  fontSize: '0.8rem',
  fontWeight: 500,
};

/**
 * Corner alert badge circle.
 *
 * Dynamic — position, error state, and click behaviour all affect rendering.
 *
 * @param positionOverride - `{ left: 0 }` for left-column cards, `{ right: 0 }` for right-column.
 * @param transform - CSS transform string from `resolveCornerBadgeAlign`.
 * @param hasError - true → error.main background; false → warning.dark.
 * @param hasClickHandler - true → pointer cursor; false → help cursor.
 * @param badgeSize - Pixel size of the circle. Defaults to 26 (`CORNER_ALERT_BADGE_SIZE`).
 */
export const cornerBadgeCircleSx =
  (opts: {
    positionOverride: { left?: number; right?: number };
    transform: string;
    hasError: boolean;
    hasClickHandler: boolean;
    badgeSize?: number;
  }): SxProps<Theme> =>
  (theme) => ({
    position: 'absolute',
    top: 0,
    ...opts.positionOverride,
    zIndex: 10,
    transform: opts.transform,
    width: opts.badgeSize ?? 26,
    height: opts.badgeSize ?? 26,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bgcolor: opts.hasError ? 'error.main' : 'warning.dark',
    color: 'common.white',
    boxShadow: `0 2px 6px rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['900Channel']} / 0.3)`,
    cursor: opts.hasClickHandler ? 'pointer' : 'help',
    pointerEvents: 'auto',
    '&:focus-visible': {
      outline: '2px solid',
      outlineColor: opts.hasError ? 'error.main' : 'warning.dark',
      outlineOffset: 2,
    },
  });

// ── Corner alert tooltip ──────────────────────────────────────────────────────

/** Sx for the Tooltip popup in `CardCornerAlertBadge`. */
export const cornerAlertTooltipSx: SxProps<Theme> = {
  maxWidth: 320,
  px: 1.75,
  py: 1.25,
  bgcolor: 'grey.900',
  '& .MuiTooltip-arrow': { color: 'grey.900' },
};
