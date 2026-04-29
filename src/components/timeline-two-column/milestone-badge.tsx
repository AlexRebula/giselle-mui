import type { PaperProps } from '@mui/material/Paper';
import type { TimelinePhase, HighlightedPaletteKey } from './types';

import { useCallback, type KeyboardEvent } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export type MilestoneBadgeProps = Omit<PaperProps, 'children'> & {
  /** The milestone data object from the parent phase's `milestones` array. */
  milestone: NonNullable<TimelinePhase['milestones']>[number];
  /** Dims and desaturates the card. Mirrors the checklist done state from the parent timeline. */
  done?: boolean;
  /** Whether this card's details section is currently expanded. Controlled by the parent accordion. */
  isExpanded: boolean;
  /** Called when the user clicks or keys Enter/Space to toggle this card open or closed. */
  onRequestExpand: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
  /**
   * Stable unique id prefix used to construct the `aria-controls` / `id` pair for the
   * expandable details region. Should be unique across all milestones on the page
   * (e.g. `"${phaseKey}-${milestoneIndex}"`). Falls back to a sanitised title slug
   * when omitted, which can collide if two milestones share the same title.
   */
  stableId?: string;
};

/**
 * Milestone card — spine-adjacent badge that expands/collapses on click.
 * Expansion is controlled externally (accordion: at most one open per phase).
 * The parent wrapper in TimelineTwoColumn owns z-index and blur animations.
 */
export function MilestoneBadge({
  milestone: m,
  done = false,
  isExpanded,
  onRequestExpand,
  suppressElevation = false,
  stableId,
  sx,
  ...other
}: MilestoneBadgeProps) {
  const hasDetails = !!m.details?.length;
  const colorKey = (m.color ?? 'primary') as HighlightedPaletteKey;
  const titleSlug = String(m.title)
    .replace(/[^a-z0-9]/gi, '-')
    .toLowerCase();
  const detailsId = stableId ? `ms-details-${stableId}` : `ms-details-${titleSlug}`;

  const handleClick = useCallback(() => {
    if (hasDetails) onRequestExpand();
  }, [hasDetails, onRequestExpand]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onRequestExpand();
      }
    },
    [hasDetails, onRequestExpand]
  );

  return (
    <Paper
      {...other}
      role={hasDetails ? 'button' : undefined}
      tabIndex={hasDetails ? 0 : undefined}
      aria-expanded={hasDetails ? isExpanded : undefined}
      aria-controls={hasDetails ? detailsId : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={[
        (theme) => ({
          p: 2,
          overflow: 'hidden',
          // Default (collapsed): transparent — no background, border colour set to transparent
          // so the 3px top border slot is reserved for a smooth colour transition on hover.
          borderTop: '3px solid',
          borderTopColor: isExpanded
            ? (theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main)
            : 'transparent',
          bgcolor: isExpanded ? 'background.paper' : 'transparent',
          boxShadow: isExpanded
            ? `0 4px 16px rgba(${
                theme.vars!.palette[colorKey]?.mainChannel ??
                (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
              } / 0.1)`
            : 'none',
          transition:
            'box-shadow 0.22s, opacity 0.3s, filter 0.3s, background-color 0.22s, border-color 0.22s',
          ...(done && { opacity: 0.45, filter: 'grayscale(1)' }),
          // Hover reveals the styled card — only when collapsed and interactive
          ...(hasDetails &&
            !isExpanded && {
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'background.paper',
                borderTopColor:
                  theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
                boxShadow: `0 16px 40px rgba(${
                  theme.vars!.palette[colorKey]?.mainChannel ??
                  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
                } / 0.22)`,
              },
              '&:focus-visible': {
                bgcolor: 'background.paper',
                borderTopColor:
                  theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
                outline: '2px solid',
                outlineColor:
                  theme.vars!.palette[colorKey]?.main ?? theme.vars!.palette.primary.main,
                outlineOffset: 3,
              },
            }),
          // Flatten elevation when another card is expanded
          ...(suppressElevation && { boxShadow: 'none' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Typography
        variant="caption"
        sx={{ color: 'text.secondary', fontSize: '0.72rem', display: 'block', mb: 0.5 }}
      >
        {m.date}
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ fontSize: '0.85rem', fontWeight: 700, lineHeight: 1.3 }}
      >
        {m.title}
      </Typography>
      {hasDetails && (
        <Collapse in={isExpanded} timeout={50}>
          <Box
            id={detailsId}
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
            }}
          >
            {m.details?.map((detail, i) => (
              <Box
                key={i}
                sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}
              >
                <Typography
                  aria-hidden="true"
                  component="span"
                  variant="body2"
                  sx={{ color: 'text.disabled', flexShrink: 0, lineHeight: 1.6 }}
                >
                  ›
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {detail}
                </Typography>
              </Box>
            ))}
          </Box>
        </Collapse>
      )}
    </Paper>
  );
}
