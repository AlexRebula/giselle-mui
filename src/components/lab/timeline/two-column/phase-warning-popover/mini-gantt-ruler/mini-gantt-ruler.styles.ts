import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** Mini Gantt ruler track — the background bar behind phase sliders. */
export const ganttTrackSx: SxProps<Theme> = {
  position: 'relative',
  height: 20,
  borderRadius: 1,
  bgcolor: 'action.hover',
};

/**
 * Individual Gantt bar for a single phase in the popover mini-chart.
 *
 * @param leftPct - Left offset as a percentage of the track width.
 * @param widthPct - Bar width as a percentage of the track width.
 * @param isOverlapping - When true, renders a diagonal-stripe pattern instead of a solid fill.
 * @param sliderColor - MUI palette key for the bar fill color.
 */
export const ganttBarSx =
  (
    leftPct: number,
    widthPct: number,
    isOverlapping: boolean,
    sliderColor: string
  ): SxProps<Theme> =>
  (theme) => ({
    position: 'absolute',
    top: 4,
    height: 12,
    left: `${leftPct}%`,
    width: `${widthPct}%`,
    borderRadius: 0.5,
    opacity: isOverlapping ? 0.7 : 1,
    bgcolor: isOverlapping
      ? 'transparent'
      : (theme.vars!.palette as unknown as Record<string, { main: string }>)[sliderColor]?.main,
    ...(isOverlapping && {
      background: `repeating-linear-gradient(
                  45deg,
                  ${(theme.vars!.palette as unknown as Record<string, { main: string }>)[sliderColor]?.main} 0px,
                  ${(theme.vars!.palette as unknown as Record<string, { main: string }>)[sliderColor]?.main} 4px,
                  transparent 4px,
                  transparent 8px
                )`,
    }),
  });
