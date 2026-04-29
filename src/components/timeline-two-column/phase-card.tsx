import type { Theme } from '@mui/material/styles';
import type { BoxProps } from '@mui/material/Box';
import type { TimelinePhase, HighlightedPaletteKey } from './types';

import {
  useState,
  type ReactNode,
  type ReactElement,
  type KeyboardEventHandler,
  type Dispatch,
  type SetStateAction,
} from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Icon } from '@iconify/react';

import { pulseDot } from './animations';

// ----------------------------------------------------------------------

/**
 * A labelled group: an optional overline label above any icon/logo strip.
 * Handles the repeated pattern across platforms, clients, and projects.
 */
type LabeledIconStripProps = {
  /** Optional overline label rendered above the strip. Omitted when undefined. */
  label?: string;
  children: ReactNode;
};

function LabeledIconStrip({ label, children }: LabeledIconStripProps) {
  return (
    <Box sx={{ mt: 2.5 }}>
      {label && (
        <Typography
          variant="overline"
          sx={{ display: 'block', mb: 1, fontSize: '0.65rem', color: 'text.disabled' }}
        >
          {label}
        </Typography>
      )}
      {children}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Expandable bullet list for phase detail items.
 * Collapses by default; expands when the parent card is toggled.
 */
type CardDetailBulletsProps = {
  /** Matches `aria-controls` on the parent Paper so screen readers wire the relationship. */
  id: string;
  details: string[];
  in: boolean;
};

function CardDetailBullets({ id, details, in: expanded }: CardDetailBulletsProps) {
  return (
    <Collapse in={expanded} timeout={50}>
      <Box
        id={id}
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
        {details.map((detail, i) => (
          <Box
            key={i}
            sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', textAlign: 'left' }}
          >
            <Typography
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
  );
}

// ----------------------------------------------------------------------

function OverdueBadge() {
  return (
    <Box sx={{ display: 'inline-flex', mb: 1 }}>
      <Typography
        variant="overline"
        sx={{
          display: 'inline-block',
          px: 1,
          py: 0.25,
          borderRadius: 0.75,
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: 0.8,
          lineHeight: 1.6,
          color: `rgba(var(--mui-palette-error-darkChannel) / 1)`,
          bgcolor: `rgba(var(--mui-palette-error-mainChannel) / 0.12)`,
        }}
      >
        Overdue
      </Typography>
    </Box>
  );
}

type ActiveBadgeProps = { color: string; activeLabel?: string };

function ActiveBadge({ color, activeLabel }: ActiveBadgeProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          flexShrink: 0,
          bgcolor: `${color}.main`,
          animation: `${pulseDot} 1.4s ease-in-out infinite`,
        }}
      />
      <Typography
        variant="overline"
        sx={{
          fontSize: '0.65rem',
          fontWeight: 700,
          letterSpacing: 0.8,
          lineHeight: 1,
          color: `${color}.main`,
        }}
      >
        {activeLabel ?? 'Now'}
      </Typography>
    </Box>
  );
}

type ScenarioBadgeProps = { color: string; scenarioLabel: string };

function ScenarioBadge({ color, scenarioLabel }: ScenarioBadgeProps) {
  return (
    <Typography
      variant="overline"
      sx={{
        display: 'inline-block',
        mb: 1,
        px: 1,
        py: 0.25,
        borderRadius: 0.75,
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: 0.8,
        color: `${color}.dark`,
        bgcolor: `${color}.lighter`,
      }}
    >
      {scenarioLabel}
    </Typography>
  );
}

/**
 * The three mutually-exclusive status badges that appear at the top of a PhaseCard.
 *
 * Priority: overdue > active ("Now") > scenario label.
 * In practice at most one fires — a phase can't be simultaneously overdue and active.
 */
type CardStatusBadgeProps = {
  /** Whether the phase is overdue (past due, not done). */
  isOverdue: boolean;
  /** Whether the phase is already done — suppresses the overdue badge. */
  isDone: boolean;
  /** Whether this is the current "active" / "Now" phase. */
  isActive: boolean;
  /** Optional override for the "Now" label text. @default 'Now' */
  activeLabel?: string;
  /** MUI palette key for the active badge colour. */
  color: string;
  /** Whether this phase uses the scenario variant. */
  isScenario: boolean;
  /** Scenario label text to render. Only shown when `isScenario` is true. */
  scenarioLabel?: string;
};

function CardStatusBadge({
  isOverdue,
  isDone,
  isActive,
  activeLabel,
  color,
  isScenario,
  scenarioLabel,
}: CardStatusBadgeProps) {
  if (isOverdue && !isDone) return <OverdueBadge />;
  if (isActive) return <ActiveBadge color={color} activeLabel={activeLabel} />;
  if (isScenario && scenarioLabel)
    return <ScenarioBadge color={color} scenarioLabel={scenarioLabel} />;
  return null;
}

// ----------------------------------------------------------------------

/** True when the phase uses a variant that gets the highlighted card treatment. */
function isHighlightedVariant(variant?: string): boolean {
  return variant === 'scenario' || variant === 'life-event';
}

/**
 * Decorative MetricCardDecoration + corner icon for a phase card.
 * Extracted to keep PhaseCard's own complexity below the Sonar limit.
 * Receives pre-computed `isOverduePending` to avoid repeating the `&&` in the parent.
 */
type CardDecorationProps = {
  /** Effective palette key for the decoration colour (already resolved from phase.color). */
  color: HighlightedPaletteKey;
  /**
   * `true` when the phase is both overdue AND not yet done.
   * Switches the decoration and corner icon to the error (red) palette.
   */
  isOverduePending: boolean;
  /** Phase icon cloned into the corner at width 32. */
  icon: ReactElement<{ width?: number }>;
};

function CardDecoration({ color, isOverduePending, icon }: CardDecorationProps) {
  return (
    <>
      {/* Gradient decoration rectangle — replicates MetricCardDecoration from giselle-mui */}
      <Box
        aria-hidden
        sx={[
          (theme) => ({
            top: -40,
            right: -56,
            width: 140,
            height: 140,
            borderRadius: 4,
            position: 'absolute',
            transform: 'rotate(40deg)',
            pointerEvents: 'none',
            background: `linear-gradient(to right, ${
              theme.vars!.palette[isOverduePending ? 'error' : color]?.main ??
              theme.vars!.palette.primary.main
            }, transparent)`,
            opacity: isOverduePending ? 0.18 : 0.08,
          }),
        ]}
      />
      <Box
        aria-hidden="true"
        sx={(theme) => ({
          top: 16,
          right: 16,
          width: 36,
          height: 36,
          position: 'absolute',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Force the icon SVG to 32 × 32 via CSS instead of cloneElement,
          // so the icon element can remain an RSC-created React element.
          '& svg': { width: 32, height: 32 },
          color: isOverduePending
            ? theme.vars!.palette.error.main
            : (theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main),
          opacity: isOverduePending ? 0.55 : 0.35,
        })}
      >
        {icon}
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

type PaperSxParams = {
  hasDetails: boolean;
  isDone: boolean;
  color: string;
  phaseSide: 'left' | 'right';
  isHighlighted: boolean;
  isScenario: boolean;
  isOverdue: boolean;
  suppressElevation: boolean;
  textAlign: 'left' | 'right' | undefined;
};

/** Returns the sx theme callback for the root Paper element of a PhaseCard. */
function buildPaperSx(p: PaperSxParams) {
  return (theme: Theme) => ({
    p: 2.5,
    position: 'relative' as const,
    overflow: 'hidden',
    textAlign: p.textAlign ?? 'left',
    bgcolor: `rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']} / 0.08)`,
    ...(p.hasDetails && {
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
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
      transition: 'opacity 0.3s, filter 0.3s',
    }),
    ...(!p.isDone && { transition: 'opacity 0.3s, filter 0.3s' }),
    ...(p.phaseSide === 'right' &&
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
    // Overdue last — always overrides side/highlighted borders when active
    ...(p.isOverdue &&
      !p.isDone && {
        border: '2px solid',
        borderColor: 'error.main',
        boxShadow: `0 0 0 2px rgba(${theme.vars!.palette.error.mainChannel} / 0.2), 0 8px 32px rgba(${theme.vars!.palette.error.mainChannel} / 0.18)`,
      }),
    // Flatten elevation on all sibling cards when another is expanded
    ...(p.suppressElevation && { boxShadow: 'none' }),
  });
}

/** Returns an onClick handler that calls `toggle` only when the card has details. */
function buildCardClickHandler(hasDetails: boolean, toggle: () => void): () => void {
  return () => {
    if (hasDetails) toggle();
  };
}

/**
 * Returns an onKeyDown handler that calls `toggle` on Enter or Space
 * when the card has details.
 */
function buildCardKeyDownHandler(
  hasDetails: boolean,
  toggle: () => void
): KeyboardEventHandler<HTMLDivElement> {
  return (e) => {
    if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  };
}

/** Resolves expand/toggle for controlled vs uncontrolled card mode. */
function resolveCardExpansion(
  onRequestExpand: (() => void) | undefined,
  isExpanded: boolean | undefined,
  internalExpanded: boolean,
  setInternalExpanded: Dispatch<SetStateAction<boolean>>
): { expanded: boolean; toggle: () => void } {
  if (onRequestExpand === undefined) {
    return { expanded: internalExpanded, toggle: () => setInternalExpanded((v) => !v) };
  }
  return { expanded: isExpanded ?? false, toggle: onRequestExpand };
}

// ----------------------------------------------------------------------

type DateTypographySxParams = {
  isScenario: boolean;
  isHighlighted: boolean;
  hideDecoration: boolean | undefined;
  color: string | undefined;
};

/** Returns the sx object for the phase date Typography element. */
function buildDateTypographySx({
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

/** Maps a phase's platform strings into icon/chip nodes for inline rendering. */
function buildPlatformStripItems(platforms: string[]): ReactNode[] {
  return platforms.map((p, i) =>
    p.includes(':') ? (
      <Tooltip key={`${p}-${i}`} title={p.split(':').at(-1) ?? p} arrow placement="top">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon icon={p} width={24} height={24} />
        </Box>
      </Tooltip>
    ) : (
      <Chip
        key={`${p}-${i}`}
        label={p}
        size="small"
        variant="outlined"
        sx={(theme) => ({
          fontSize: '0.7rem',
          bgcolor: `rgba(${(theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']} / 0.08)`,
        })}
      />
    )
  );
}

// ----------------------------------------------------------------------

export type PhaseCardProps = Omit<BoxProps, 'children'> & {
  /** The timeline phase data to render. */
  phase: TimelinePhase;
  /** Runtime done override from the parent timeline (local toggle state). Defaults to phase.done. */
  done?: boolean;
  /** Runtime overdue override from the parent timeline. Adds a red warning border to the card. */
  overdue?: boolean;
  /**
   * Controlled expansion state. When provided together with `onRequestExpand`,
   * the card operates in controlled mode and the parent owns the open/close state.
   */
  isExpanded?: boolean;
  /** Called when the user clicks or keys the card to toggle details. Controlled mode only. */
  onRequestExpand?: () => void;
  /** When true, suppresses box-shadow so the card appears flat (used when another card is expanded). */
  suppressElevation?: boolean;
};

/**
 * Expandable card for a single timeline phase.
 *
 * Renders the phase title, description, date, optional icon strips (platforms,
 * clients, projects), and a collapsible bullet-point detail section.
 * Operates in controlled mode when `onRequestExpand` is provided; falls back to
 * internal toggle state otherwise.
 *
 * Status badge (overdue / active / scenario) is resolved automatically from props.
 */
export function PhaseCard({
  phase,
  done,
  overdue,
  isExpanded,
  onRequestExpand,
  suppressElevation = false,
  sx,
  ...other
}: PhaseCardProps) {
  const isDone = done ?? phase.done ?? false;
  const isOverdue = overdue ?? phase.overdue ?? false;
  const [internalExpanded, setInternalExpanded] = useState(false);

  const hasDetails = Boolean(phase.details?.length);
  const isScenario = phase.variant === 'scenario';
  const isHighlighted = isHighlightedVariant(phase.variant);
  const detailsId = `timeline-details-${String(phase.key).replace('.', '-')}`;

  const { expanded, toggle } = resolveCardExpansion(
    onRequestExpand,
    isExpanded,
    internalExpanded,
    setInternalExpanded
  );

  const handleClick = buildCardClickHandler(hasDetails, toggle);
  const handleKeyDown = buildCardKeyDownHandler(hasDetails, toggle);

  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Paper
        role={hasDetails ? 'button' : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        aria-expanded={hasDetails ? expanded : undefined}
        aria-controls={hasDetails ? detailsId : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        sx={[
          buildPaperSx({
            hasDetails,
            isDone,
            color: phase.color ?? 'primary',
            phaseSide: phase.side,
            isHighlighted,
            isScenario,
            isOverdue,
            suppressElevation,
            textAlign: phase.textAlign,
          }),
        ]}
      >
        {/* Decorative background shape + corner icon */}
        {!isHighlighted && !phase.hideDecoration && (
          <CardDecoration
            color={(phase.color ?? 'primary') as HighlightedPaletteKey}
            isOverduePending={isOverdue && !isDone}
            icon={phase.icon}
          />
        )}

        {/* Overdue / Now / Scenario status badge — at most one renders */}
        <CardStatusBadge
          isOverdue={isOverdue}
          isDone={isDone}
          isActive={Boolean(phase.active)}
          activeLabel={phase.activeLabel}
          color={phase.color ?? 'primary'}
          isScenario={isScenario}
          scenarioLabel={phase.scenarioLabel}
        />

        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            {!phase.hideDate && !phase.active && (
              <Typography
                variant="subtitle2"
                sx={buildDateTypographySx({
                  isScenario,
                  isHighlighted,
                  hideDecoration: phase.hideDecoration,
                  color: phase.color,
                })}
              >
                {phase.date}
              </Typography>
            )}

            <Typography
              variant={isScenario ? 'h6' : 'subtitle1'}
              sx={{ mb: 1, pr: !isHighlighted && !phase.hideDecoration ? 6 : 0 }}
            >
              {phase.title}
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {phase.description}
            </Typography>

            {phase.photo && (
              <Box
                component="img"
                src={phase.photo.src}
                alt={phase.photo.alt}
                sx={{
                  mt: 2,
                  width: '100%',
                  maxWidth: 200,
                  aspectRatio: '4/3',
                  objectFit: 'cover',
                  borderRadius: 1.5,
                  border: '2px solid',
                  borderColor: 'divider',
                  display: 'block',
                }}
              />
            )}

            {/* Tech stack platforms */}
            {phase.platforms && phase.platforms.length > 0 && (
              <LabeledIconStrip label={phase.platformsLabel ?? 'Tech Stack'}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
                  {buildPlatformStripItems(phase.platforms)}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Client logos */}
            {phase.clients && (
              <LabeledIconStrip label={phase.clientsLabel}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
                  {phase.clients.map(({ name, logo }) => (
                    <Tooltip key={name} title={name} arrow>
                      <Box
                        component="img"
                        src={logo}
                        alt={name}
                        sx={{
                          height: 28,
                          width: 'auto',
                          maxWidth: 100,
                          objectFit: 'contain',
                          opacity: 0.7,
                          filter: 'grayscale(1)',
                          transition: 'opacity 0.2s, filter 0.2s',
                          '&:hover': { opacity: 1, filter: 'none' },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </LabeledIconStrip>
            )}

            {/* Project logos */}
            {phase.projects && (
              <LabeledIconStrip label={phase.projectsLabel}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5 }}>
                  {phase.projects.map(({ name, logo }) => (
                    <Box
                      key={name}
                      component="img"
                      src={logo}
                      alt={name}
                      sx={{
                        height: 28,
                        width: 'auto',
                        maxWidth: 100,
                        objectFit: 'contain',
                        opacity: 0.85,
                        transition: 'opacity 0.2s',
                        '&:hover': { opacity: 1 },
                      }}
                    />
                  ))}
                </Box>
              </LabeledIconStrip>
            )}
          </Box>
        </Box>

        {hasDetails && (
          <CardDetailBullets id={detailsId} details={phase.details ?? []} in={expanded} />
        )}
      </Paper>
    </Box>
  );
}
