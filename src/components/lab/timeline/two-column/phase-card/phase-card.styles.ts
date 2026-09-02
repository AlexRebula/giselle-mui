import type { SxProps, Theme } from '@mui/material/styles';

import { pulseDot } from '../animations';
import type { HighlightedPaletteKey } from '../types';
import type { PaperSxParams, DateTypographySxParams, PhaseTitleSxParams } from './types';
import { PHASE_PILL_TEXT_FONT_SIZE } from './phase-card.const';

/**
 * Styles for the `PhaseCard` component.
 *
 * Static constants are created once at module load — zero per-render allocation.
 * Dynamic factories (`(arg) => SxProps<Theme>`) create a new object on every call.
 * ⚠️ Performance note: if a dynamic factory is used inside a `.map()` on every
 * render, do not call hooks per item — that violates the Rules of Hooks.
 * Keep the factory cheap, or memoize the entire derived array at the component's
 * top level with `useMemo` if profiling shows a real need.
 */

// ── CardDetailBullets (unused sibling) ────────────────────────────────────────

/** Individual bullet row — bullet glyph + detail text side by side. */
export const detailBulletsRowSx: SxProps<Theme> = {
  display: 'flex',
  gap: 1,
  alignItems: 'flex-start',
  textAlign: 'left',
};

// ── NewBadge / ActiveBadge ────────────────────────────────────────────────────

/** Shared flex row wrapper for NewBadge and ActiveBadge. */
export const statusBadgeWrapperSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.75,
  mb: 1,
};

/** Pulsing dot for the `NewBadge` — always success-green. */
export const newStatusDotSx = (dotSize: number): SxProps<Theme> => ({
  width: dotSize,
  height: dotSize,
  borderRadius: '50%',
  flexShrink: 0,
  bgcolor: 'success.main',
  animation: `${pulseDot} 1.4s ease-in-out infinite`,
});

/** Status label typography for `NewBadge` — always success-green. */
export const newStatusLabelSx: SxProps<Theme> = {
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  lineHeight: 1.6,
  color: 'success.main',
};

/**
 * Pulsing dot for `ActiveBadge` — tinted to the phase palette `color`.
 *
 * ⚠️ Performance note: called inside `.map()` indirectly via sub-component render.
 */
export const activeDotSx = (color: string, dotSize: number): SxProps<Theme> => ({
  width: dotSize,
  height: dotSize,
  borderRadius: '50%',
  flexShrink: 0,
  bgcolor: `${color}.main`,
  animation: `${pulseDot} 1.4s ease-in-out infinite`,
});

/** Status label typography for `ActiveBadge` — tinted to phase palette `color`. */
export const activeStatusLabelSx = (color: string): SxProps<Theme> => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  lineHeight: 1.6,
  color: `${color}.main`,
});

// ── Main PhaseCard render ─────────────────────────────────────────────────────

/** Root Box wrapper — establishes the positioning context for the corner alert badge and eye button. */
export const phaseCardRootSx: SxProps<Theme> = {
  position: 'relative',
};

/** Row that holds the title column next to (implicitly reserved space for) the decoration/icon. */
export const phaseContentRowSx: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: 1,
};

/** Column that takes the remaining width in `phaseContentRowSx` and stacks all title-area content. */
export const phaseContentColumnSx: SxProps<Theme> = {
  flex: 1,
};

/**
 * Phase title Typography.
 *
 * @param isHighlighted - When true (and decoration isn't hidden), no right padding is reserved for the corner icon.
 * @param hideDecoration - When true, no right padding is reserved for the corner icon.
 * @param hasDetails - Controls bottom margin: tighter when a details pill follows.
 */
export const phaseTitleSx = ({
  isHighlighted,
  hideDecoration,
  hasDetails,
}: PhaseTitleSxParams): SxProps<Theme> => ({
  pr: !isHighlighted && !hideDecoration ? 6 : 0,
  mb: hasDetails ? 0.5 : 1,
});

/** Collapsed details-count pill — shows item count before expansion. */
export const detailCountPillSx: SxProps<Theme> = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  mb: 1,
  px: 0.75,
  py: 0.25,
  borderRadius: 1,
  bgcolor: 'action.hover',
  color: 'text.secondary',
};

/** Count label Typography inside the details-count pill. */
export const phasePillTextSx: SxProps<Theme> = {
  fontWeight: 600,
  lineHeight: 1,
  fontSize: PHASE_PILL_TEXT_FONT_SIZE,
};

/** Phase description Typography — shown only in the expanded state. */
export const phaseDescriptionSx: SxProps<Theme> = {
  color: 'text.secondary',
  mt: 0.5,
};

/** Footer slot Box — wraps the optional consumer-provided footer content. */
export const phaseFooterSlotSx: SxProps<Theme> = {
  mt: 1,
};

/** Logo/icon strip container — used for clients and projects strips (gap: 2.5). */
export const logoStripSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 2.5,
};

/** Client logo `<img>` — sized, contained, greyscale until hover. */
export const clientLogoSx: SxProps<Theme> = {
  height: 40,
  width: 'auto',
  maxWidth: 140,
  objectFit: 'contain',
  opacity: 0.7,
  filter: 'grayscale(1)',
  transition: 'opacity 0.2s, filter 0.2s',
  '&:hover': { opacity: 1, filter: 'none' },
};

/** Platform/tech-stack strip container (gap: 1 — tighter than logo strips). */
export const platformStripSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 1,
};

/** Project logo `<img>` — smaller than client logos, subtle hover opacity. */
export const projectLogoSx: SxProps<Theme> = {
  height: 28,
  width: 'auto',
  maxWidth: 100,
  objectFit: 'contain',
  opacity: 0.85,
  transition: 'opacity 0.2s',
  '&:hover': { opacity: 1 },
};

// ── Viewed eye button ─────────────────────────────────────────────────────────

// ── Photos ────────────────────────────────────────────────────────────────────

/**
 * Photo `<img>` element inside a phase card.
 *
 * The top margin differs between the first photo and subsequent ones:
 * - First photo: `mt: 2` — extra breathing room after the description.
 * - Additional photos: `mt: 1` — tighter gap within the photo strip.
 *
 * ⚠️ Performance note: this factory creates a new object on every call.
 * It is called inside `.map()` — keep it cheap (no heavy derivations).
 * If needed, memoize the entire mapped array at the call site with `useMemo`.
 *
 * @param isFirst - True for the first photo in the array (`i === 0`).
 */
export const photoImgSx = (isFirst: boolean): SxProps<Theme> => ({
  mt: isFirst ? 2 : 1,
  width: '100%',
  maxWidth: 200,
  aspectRatio: '4/3',
  objectFit: 'cover',
  borderRadius: 1.5,
  border: '2px solid',
  borderColor: 'divider',
  display: 'block',
});

// ── Paper root ────────────────────────────────────────────────────────────────

/** Returns the sx theme callback for the root Paper element of a PhaseCard. */
export function buildPaperSx(p: PaperSxParams) {
  return (theme: Theme) => ({
    p: 2.5,
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: p.textAlign ?? 'left',
    bgcolor: `rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']} / 0.08)`,
    transition: p.hasDetails
      ? 'box-shadow 0.2s, opacity 0.3s, filter 0.3s'
      : 'opacity 0.3s, filter 0.3s',
    ...(p.hasDetails && {
      cursor: 'pointer',
      '&:hover': {
        boxShadow: `0 16px 40px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.22)`,
      },
      '&:focus-visible': {
        outline: '2px solid',
        outlineColor:
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.main ??
          theme.vars!.palette.primary.main,
        outlineOffset: 3,
      },
    }),
    ...(p.isDone && {
      opacity: 0.45,
      filter: 'grayscale(1)',
      '&:hover': {
        opacity: 1,
        filter: 'none',
        ...(p.hasDetails && {
          boxShadow: `0 16px 40px rgba(${
            theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
            (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
          } / 0.22)`,
        }),
      },
    }),
    ...(p.phaseSide === 'left' &&
      !p.isHighlighted && {
        bgcolor: 'background.paper',
        borderTop: '3px solid',
        borderColor: `${p.color ?? 'primary'}.main`,
        boxShadow: `0 8px 24px rgba(${
          theme.vars!.palette[(p.color ?? 'primary') as HighlightedPaletteKey]?.mainChannel ??
          (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
        } / 0.12)`,
      }),
    ...(p.isHighlighted && {
      borderLeft: '4px solid',
      borderColor: `${p.color}.main`,
      bgcolor: `rgba(${
        theme.vars!.palette[p.color as HighlightedPaletteKey]?.mainChannel ??
        (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
      } / ${p.isScenario ? 0.1 : 0.08})`,
    }),
    ...(p.isOverdue &&
      !p.isDone && {
        border: '2px solid',
        borderColor: 'error.main',
        boxShadow: `0 0 0 2px rgba(${theme.vars!.palette.error.mainChannel} / 0.2), 0 8px 32px rgba(${theme.vars!.palette.error.mainChannel} / 0.18)`,
      }),
    ...(p.suppressElevation && { boxShadow: 'none' }),
  });
}

// ── Date Typography ───────────────────────────────────────────────────────────

/** Returns the sx object for the phase date Typography element. */
export function buildDateTypographySx({
  isScenario,
  isHighlighted,
  hideDecoration,
  color,
}: DateTypographySxParams) {
  return {
    display: 'block',
    mb: 1.5,
    pr: !isHighlighted && !hideDecoration ? 6 : 0,
    fontSize: isScenario ? '0.875rem' : '0.8rem',
    fontWeight: isScenario ? 800 : undefined,
    letterSpacing: isScenario ? 0 : undefined,
    color: isScenario ? `${color ?? 'primary'}.main` : 'text.disabled',
  };
}

// ── Pill icon box ─────────────────────────────────────────────────────────────

/**
 * Inline icon slot inside detail-count and similar pill badges.
 *
 * Forces the SVG to the exact icon size used by the pill.
 *
 * @param iconSize - Width and height applied to the `& svg` selector (px).
 */
export const pillIconBoxSx = (iconSize: number): SxProps<Theme> => ({
  display: 'inline-flex',
  flexShrink: 0,
  '& svg': { width: iconSize, height: iconSize },
});
