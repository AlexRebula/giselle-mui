import type { TimelinePhase, HighlightedPaletteKey, TimelineTwoColumnProps } from './types';

import { useMemo, useState, useEffect, useCallback, type ReactNode } from 'react';

import Box from '@mui/material/Box';
import Timeline from '@mui/lab/Timeline';

import { PhaseCard } from './phase-card';
import { TimelineDot } from './timeline-dot';
import { MilestoneBadge } from './milestone-badge';
import { SpineConnector } from './spine-connector';
import { getLastYear, parseLastDate, sortPhasesByDate } from './utils';

// ----------------------------------------------------------------------

/**
 * One flex column in the two-column phase row.
 *
 * @remarks
 * The Box is a flex layout child of the phase row — NOT part of PhaseCard.
 * It controls column width (`flex: 1`), text alignment, padding, and
 * responsive visibility. Keep it in the parent, not inside PhaseCard.
 *
 * On mobile (`xs`) the column is hidden when it carries no content for this
 * phase (empty padding would still consume space). On desktop (`md+`) both
 * columns always render.
 *
 * REGRESSION NOTE: This helper was extracted deliberately to prevent the
 * two near-identical column Boxes from drifting out of sync during refactors.
 * Do NOT inline these Boxes back into the render. If you need to change column
 * behaviour, change it here once.
 */
type TimelineColumnProps = {
  /** Which physical column this is — determines padding direction and text alignment. */
  columnSide: 'left' | 'right';
  /**
   * Whether this column contains content for the current phase.
   * When false the column is hidden on mobile (`xs`) to avoid empty padding.
   * On desktop (`md+`) both columns always show.
   */
  hasContent: boolean;
  /**
   * Extra bottom padding (px) added below the card content.
   * Drives the consistent vertical gap between consecutive phase cards:
   * gap = bottomPadding + column top padding.
   */
  bottomPadding: number;
  children: ReactNode;
};

function TimelineColumn({ columnSide, hasContent, children, bottomPadding }: TimelineColumnProps) {
  return (
    <Box
      data-col={columnSide}
      sx={{
        flex: 1,
        textAlign: columnSide === 'left' ? 'right' : 'left',
        pr: columnSide === 'left' ? 2 : 0,
        pl: columnSide === 'right' ? 2 : 0,
        pt: 0.75,
        paddingBottom: `${bottomPadding}px`,
        // On mobile: hide empty columns to avoid phantom padding.
        // On desktop: both columns always show.
        display: { xs: hasContent ? 'block' : 'none', md: 'block' },
      }}
    >
      {children}
    </Box>
  );
}

// ── Milestone type alias ───────────────────────────────────────────────────

type Milestone = NonNullable<TimelinePhase['milestones']>[number];

// ── Per-phase derived state helpers ───────────────────────────────────────

type PhaseStateProps = {
  isDone: boolean;
  isOverdue: boolean;
  dotColor: HighlightedPaletteKey;
  yearLabelValue: string | null;
  phaseMilestones: NonNullable<TimelinePhase['milestones']>;
  isLastPhase: boolean;
};

type PhaseDotHandlers = {
  dotClickAction: (() => void) | undefined;
  dotKeyDownHandler: ((e: React.KeyboardEvent) => void) | undefined;
  dotAriaLabel: string | undefined;
};

/** Returns true when a phase is past-due in checklist mode. */
function resolvePhaseOverdue(
  phase: TimelinePhase,
  checklist: boolean,
  isDone: boolean,
  today: Date
): boolean {
  if (!checklist || isDone) return false;
  const parsedDate = parseLastDate(phase.date);
  const isAutoOverdue = !phase.active && parsedDate !== null && parsedDate < today;
  return (phase.overdue ?? false) || isAutoOverdue;
}

/** Resolves display-state derived values for a single phase row. */
function resolvePhaseState(
  phase: TimelinePhase,
  index: number,
  sorted: TimelinePhase[],
  lastKey: number | undefined,
  checklist: boolean,
  localPhaseDone: Record<string, boolean>,
  today: Date
): PhaseStateProps {
  const isDone = checklist ? (localPhaseDone[String(phase.key)] ?? false) : (phase.done ?? false);
  const isOverdue = resolvePhaseOverdue(phase, checklist, isDone, today);
  const colorFromData =
    phase.color && phase.color !== 'inherit' && phase.color !== 'grey'
      ? (phase.color as HighlightedPaletteKey)
      : null;
  const baseDotColor: HighlightedPaletteKey =
    colorFromData ?? (phase.side === 'left' ? 'secondary' : 'primary');
  const dotColor: HighlightedPaletteKey = isOverdue ? 'error' : baseDotColor;
  const nextPhase = sorted[index + 1];
  const thisYear = getLastYear(phase.date);
  const nextYear = nextPhase ? getLastYear(nextPhase.date) : null;
  const yearLabelValue =
    nextYear !== null && thisYear !== null && nextYear < thisYear ? String(nextYear) : null;
  return {
    isDone,
    isOverdue,
    dotColor,
    yearLabelValue,
    phaseMilestones: phase.milestones ?? [],
    isLastPhase: phase.key === lastKey,
  };
}

/** Resolves click/keyboard handlers and ARIA label for a phase dot. */
function resolvePhaseDotHandlers(
  phase: TimelinePhase,
  isDone: boolean,
  checklist: boolean,
  handleTogglePhase: (key: number) => void,
  onPhaseSelect: ((key: number) => void) | undefined
): PhaseDotHandlers {
  const dotActionLabel = isDone ? 'Unmark' : 'Mark';
  let dotAriaLabel: string | undefined;
  if (checklist) {
    dotAriaLabel = `${dotActionLabel} "${phase.title}" as done`;
  } else if (onPhaseSelect) {
    dotAriaLabel = `Select "${phase.title}"`;
  }
  let dotClickAction: (() => void) | undefined;
  if (checklist) {
    dotClickAction = () => handleTogglePhase(phase.key);
  } else if (onPhaseSelect) {
    dotClickAction = () => onPhaseSelect(phase.key);
  }
  const dotKeyDownHandler = dotClickAction
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dotClickAction();
        }
      }
    : undefined;
  return { dotClickAction, dotKeyDownHandler, dotAriaLabel };
}

/** Resolves the JSX prop bag for the phase-row PhaseCard. */
function buildPhaseCardTsxProps(
  checklist: boolean,
  isDone: boolean,
  isOverdue: boolean,
  anyExpanded: boolean,
  isThisPhaseExpanded: boolean
) {
  return {
    done: isDone,
    overdue: checklist ? isOverdue : undefined,
    suppressElevation: anyExpanded && !isThisPhaseExpanded,
  };
}

/** Resolves the JSX prop bag for the phase-row TimelineDot. */
function buildPhaseDotTsxProps(
  phase: TimelinePhase,
  checklist: boolean,
  isDone: boolean,
  dotAriaLabel: string | undefined,
  phaseToggleCounts: Record<string, number>,
  selectedPhaseKey: number | undefined
) {
  let role: 'checkbox' | 'button' | undefined;
  if (checklist) {
    role = 'checkbox';
  } else if (dotAriaLabel) {
    role = 'button';
  }
  return {
    active: (phase.active ?? false) || (!checklist && phase.key === selectedPhaseKey),
    animationKey: phaseToggleCounts[String(phase.key)] ?? 0,
    done: isDone,
    role,
    'aria-checked': checklist ? isDone : undefined,
    'aria-label': dotAriaLabel,
    tabIndex: checklist || dotAriaLabel ? 0 : undefined,
  };
}

// ── Per-milestone derived state helpers ───────────────────────────────────

type MilestoneDotHandlers = {
  msDotClickAction: (() => void) | undefined;
  msDotKeyDown: ((e: React.KeyboardEvent) => void) | undefined;
  msDotAriaLabel: string | undefined;
};

type MilestoneRowCtx = {
  phaseKey: number;
  phaseSide: 'left' | 'right';
  checklist: boolean;
  localMilestoneDone: Record<string, boolean>;
  expandedMiIdx: number | null;
  anyExpanded: boolean;
  dotColor: HighlightedPaletteKey;
  handleToggleMilestone: (phaseKey: number, mi: number) => void;
  handleExpandMilestone: (phaseKey: number, milestoneIndex: number) => void;
};

/** Resolves done state and effective color for a milestone in checklist mode. */
function resolveMilestoneState(
  ms: Milestone,
  mi: number,
  phaseKey: number,
  dotColor: HighlightedPaletteKey,
  checklist: boolean,
  localMilestoneDone: Record<string, boolean>
): { msDone: boolean; msColor: HighlightedPaletteKey } {
  const msDoneKey = `${phaseKey}-${mi}`;
  const msDone = checklist ? (localMilestoneDone[msDoneKey] ?? false) : (ms.done ?? false);
  const msIsOverdue = checklist && (ms.overdue ?? false) && !msDone;
  const msColorFromData =
    ms.color && ms.color !== 'inherit' && ms.color !== 'grey'
      ? (ms.color as HighlightedPaletteKey)
      : dotColor;
  const msColor: HighlightedPaletteKey = msIsOverdue ? 'error' : msColorFromData;
  return { msDone, msColor };
}

/** Resolves click/keyboard handlers and ARIA label for a milestone dot. */
function resolveMilestoneDotHandlers(
  ms: Milestone,
  mi: number,
  phaseKey: number,
  msDone: boolean,
  checklist: boolean,
  handleToggleMilestone: (phaseKey: number, mi: number) => void
): MilestoneDotHandlers {
  const msDotActionLabel = msDone ? 'Unmark' : 'Mark';
  const msDotAriaLabel = checklist ? `${msDotActionLabel} "${ms.title}" as done` : undefined;
  const msDotClickAction = checklist ? () => handleToggleMilestone(phaseKey, mi) : undefined;
  const msDotKeyDown = msDotClickAction
    ? (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          msDotClickAction();
        }
      }
    : undefined;
  return { msDotClickAction, msDotKeyDown, msDotAriaLabel };
}

/** Builds the full JSX node for a single milestone row. */
function buildMilestoneRow(
  ms: Milestone,
  mi: number,
  totalMilestones: number,
  ctx: MilestoneRowCtx
): React.ReactNode {
  const { msDone, msColor } = resolveMilestoneState(
    ms,
    mi,
    ctx.phaseKey,
    ctx.dotColor,
    ctx.checklist,
    ctx.localMilestoneDone
  );
  const { msDotClickAction, msDotKeyDown, msDotAriaLabel } = resolveMilestoneDotHandlers(
    ms,
    mi,
    ctx.phaseKey,
    msDone,
    ctx.checklist,
    ctx.handleToggleMilestone
  );

  const isThisMsExpanded = ctx.expandedMiIdx === mi;
  const topPercent = ((mi + 1) / (totalMilestones + 1)) * 100;
  const stopProp = isThisMsExpanded ? (e: React.MouseEvent) => e.stopPropagation() : undefined;
  const suppressElevation = ctx.anyExpanded && !isThisMsExpanded;
  const msDoneForBadge = msDone;
  const dotChecklistProps = ctx.checklist
    ? {
        role: 'checkbox' as const,
        'aria-checked': msDone,
        'aria-label': msDotAriaLabel,
        tabIndex: 0,
      }
    : {};

  const wrapperBase = {
    position: 'absolute' as const,
    zIndex: isThisMsExpanded ? 10 : 1,
    transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
    // translateY(-50%) centers the card vertically on its dot (dot height = 30px, center = 15px)
    transform: 'translateY(-50%)',
    // Raise hovered card above its siblings so nearby cards don't overlap it
    '&:hover': { zIndex: 9 },
    ...(suppressElevation && {
      filter: 'blur(1.5px)',
      opacity: 0.38,
      transform: 'scale(0.97) translateY(-50%)',
      pointerEvents: 'none' as const,
    }),
  };

  return (
    <Box
      key={`ms-row-${mi}`}
      sx={{
        // Absolutely positioned on the li so the dot sits ON the spine
        // at an equal-interval % of the li height, not stacked below the phase card.
        position: 'absolute',
        top: `${topPercent}%`,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Left column — milestone card for side='left' phases */}
      <Box
        data-col="left"
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'visible',
          display: { xs: ctx.phaseSide === 'left' ? 'block' : 'none', md: 'block' },
        }}
      >
        {ctx.phaseSide === 'left' && (
          <Box
            onClick={stopProp}
            sx={(theme) => ({
              ...wrapperBase,
              top: '15px',
              left: 0,
              right: theme.spacing(2),
            })}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDoneForBadge}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>

      {/* Centre: milestone dot — blurs with siblings when another card is open */}
      <Box
        data-col="center"
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box
          sx={{
            transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
            ...(suppressElevation && {
              filter: 'blur(1.5px)',
              opacity: 0.38,
              transform: 'scale(0.97)',
              pointerEvents: 'none',
            }),
          }}
        >
          <TimelineDot
            icon={ms.icon}
            color={msColor}
            size="milestone"
            done={msDone}
            onClick={msDotClickAction}
            onKeyDown={msDotKeyDown}
            {...dotChecklistProps}
          />
        </Box>
        {/* No spine here — the phase row's SpineConnector runs behind all milestone dots */}
      </Box>

      {/* Right column — milestone card for side='right' phases */}
      <Box
        data-col="right"
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'visible',
          display: { xs: ctx.phaseSide === 'right' ? 'block' : 'none', md: 'block' },
        }}
      >
        {ctx.phaseSide === 'right' && (
          <Box
            onClick={stopProp}
            sx={(theme) => ({
              ...wrapperBase,
              top: '15px',
              left: theme.spacing(2),
              right: 0,
            })}
          >
            <MilestoneBadge
              milestone={ms}
              done={msDoneForBadge}
              isExpanded={isThisMsExpanded}
              suppressElevation={suppressElevation}
              stableId={`${ctx.phaseKey}-${mi}`}
              onRequestExpand={() => ctx.handleExpandMilestone(ctx.phaseKey, mi)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Two-column alternating timeline.
 *
 * Phases are sorted automatically (active pinned first, then newest → oldest).
 * Each phase renders a dot on the central spine and a card in the left or right
 * column depending on `phase.side`. Milestone dots appear at equal intervals
 * along the spine between consecutive phases.
 *
 * Two modes:
 * - **Default (read-only):** cards are expandable on click; no done/overdue state.
 * - **Checklist:** pass `checklist` to enable dot-click toggling, done dimming,
 *   and automatic overdue detection (past date + not done + not active → red).
 *
 * For hero navigation use, pass `selectedPhaseKey` + `onPhaseSelect` to control
 * which phase dot appears active from the outside.
 */
export function TimelineTwoColumn({
  phases,
  checklist = false,
  onTogglePhaseDone,
  onToggleMilestoneDone,
  selectedPhaseKey,
  onPhaseSelect,
  milestoneSlotHeight = 60,
  phaseCardGap = 90,
  yearLabelMarginBottom = 30,
  sx,
  ...other
}: TimelineTwoColumnProps) {
  // Internal done-state overlay — initialised from data, toggled by dot clicks.
  // Re-synced whenever `phases` changes (e.g. async load, external reset).
  const [localPhaseDone, setLocalPhaseDone] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false]))
  );
  const [localMilestoneDone, setLocalMilestoneDone] = useState<Record<string, boolean>>(() => {
    const m: Record<string, boolean> = {};
    phases.forEach((p) =>
      p.milestones?.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      })
    );
    return m;
  });

  // Sync done state when the phases prop identity changes (new dataset, async load, reset).
  useEffect(() => {
    setLocalPhaseDone(Object.fromEntries(phases.map((p) => [String(p.key), p.done ?? false])));
    const m: Record<string, boolean> = {};
    phases.forEach((p) =>
      p.milestones?.forEach((ms, i) => {
        m[`${p.key}-${i}`] = ms.done ?? false;
      })
    );
    setLocalMilestoneDone(m);
  }, [phases]);

  // Toggle-animation counters — incremented on every click so the icon wrapper
  // gets a new `key` and remounts, which restarts the CSS animation cleanly.
  const [phaseToggleCounts, setPhaseToggleCounts] = useState<Record<string, number>>({});

  // Accordion state: tracks which milestone index (if any) is expanded per phase.
  // null = all collapsed. Toggling a value auto-collapses the previously open card.
  const [expandedMilestoneMap, setExpandedMilestoneMap] = useState<Record<string, number | null>>(
    {}
  );

  // Which phase card (by key) is currently expanded. null = all collapsed.
  const [expandedPhaseKey, setExpandedPhaseKey] = useState<number | null>(null);

  const handleExpandMilestone = useCallback((phaseKey: number, milestoneIndex: number) => {
    const k = String(phaseKey);
    // Collapse any open phase card when a milestone opens.
    setExpandedPhaseKey(null);
    // Toggle: clicking the same milestone again collapses it.
    setExpandedMilestoneMap((prev) => ({
      ...prev,
      [k]: prev[k] === milestoneIndex ? null : milestoneIndex,
    }));
  }, []);

  const handleExpandPhaseCard = useCallback((phaseKey: number) => {
    // Collapse all milestones when a phase card opens.
    setExpandedMilestoneMap({});
    // Toggle: clicking the same phase card again collapses it.
    setExpandedPhaseKey((prev) => (prev === phaseKey ? null : phaseKey));
  }, []);

  const handleTogglePhase = useCallback(
    (key: number) => {
      setPhaseToggleCounts((prev) => ({ ...prev, [String(key)]: (prev[String(key)] ?? 0) + 1 }));
      const next = !localPhaseDone[String(key)];
      setLocalPhaseDone((prev) => ({ ...prev, [String(key)]: next }));
      onTogglePhaseDone?.(key, next);
    },
    [localPhaseDone, onTogglePhaseDone]
  );

  const handleToggleMilestone = useCallback(
    (phaseKey: number, milestoneIndex: number) => {
      const k = `${phaseKey}-${milestoneIndex}`;
      const next = !localMilestoneDone[k];
      const updated = { ...localMilestoneDone, [k]: next };
      setLocalMilestoneDone(updated);
      onToggleMilestoneDone?.(phaseKey, milestoneIndex, next);

      // Auto-done: if all milestones of this phase are now done, mark the phase done too.
      const phase = phases.find((p) => p.key === phaseKey);
      if (phase?.milestones?.length) {
        const allDone = phase.milestones.every((_, i) => updated[`${phaseKey}-${i}`] ?? false);
        if (allDone && !localPhaseDone[String(phaseKey)]) {
          setPhaseToggleCounts((prev) => ({
            ...prev,
            [String(phaseKey)]: (prev[String(phaseKey)] ?? 0) + 1,
          }));
          setLocalPhaseDone((prev) => ({ ...prev, [String(phaseKey)]: true }));
          onTogglePhaseDone?.(phaseKey, true);
        }
      }
    },
    [localMilestoneDone, phases, localPhaseDone, onToggleMilestoneDone, onTogglePhaseDone]
  );

  // Midnight today — used for auto-overdue detection.
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  // Sort: active ("Now") item always first, remaining items newest → oldest.
  const sorted = useMemo(() => sortPhasesByDate(phases), [phases]);

  const lastKey = sorted.at(-1)?.key;

  // True whenever any card (phase or milestone) is open anywhere in the timeline.
  // Used to blur every other card and dot globally.
  const anyExpanded = useMemo(
    () => expandedPhaseKey !== null || Object.values(expandedMilestoneMap).some((v) => v !== null),
    [expandedPhaseKey, expandedMilestoneMap]
  );

  // Collapse all when the user clicks anywhere outside the currently open card.
  // Only active while a card is expanded — no listener overhead when all collapsed.
  useEffect(() => {
    if (!anyExpanded) return undefined;
    const handler = () => {
      setExpandedMilestoneMap({});
      setExpandedPhaseKey(null);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [anyExpanded]);

  return (
    <Box sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Timeline
        sx={{
          p: 0,
          m: 0,
          '& .MuiTimelineItem-root:before': { flex: 0, padding: 0 },
        }}
      >
        {sorted.map((phase, i) => {
          const { isDone, isOverdue, dotColor, yearLabelValue, phaseMilestones, isLastPhase } =
            resolvePhaseState(phase, i, sorted, lastKey, checklist, localPhaseDone, today);

          const { dotClickAction, dotKeyDownHandler, dotAriaLabel } = resolvePhaseDotHandlers(
            phase,
            isDone,
            checklist,
            handleTogglePhase,
            onPhaseSelect
          );

          // ── Layout: nested flex rows ──────────────────────────────────────
          // Each phase renders as ONE <li data-testid="tl-item"> containing:
          //   Row 0 — phase row:  [card]  | [phase dot + spine↓] | [empty]  (or mirrored)
          //   Row 1..N — ms rows: [empty] | [ms dot + spine↓]    | [ms card (absolute)]
          //
          // Milestone cards are absolutely positioned within their column so card expansion
          // never shifts the spine dot positions. Accordion: at most one open per phase.

          const expandedMiIdx = expandedMilestoneMap[String(phase.key)] ?? null;
          const isThisPhaseExpanded = expandedPhaseKey === phase.key;

          // stopPropagation: only needed while the card is expanded, so the
          // document listener does not collapse it on clicks within the card.
          const phaseCardStopProp = isThisPhaseExpanded
            ? (e: React.MouseEvent) => e.stopPropagation()
            : undefined;

          // Single PhaseCard node — rendered in whichever column matches phase.side.
          const phaseCardNode = (
            <Box onClick={phaseCardStopProp}>
              <PhaseCard
                phase={phase}
                {...buildPhaseCardTsxProps(
                  checklist,
                  isDone,
                  isOverdue,
                  anyExpanded,
                  isThisPhaseExpanded
                )}
                isExpanded={isThisPhaseExpanded}
                onRequestExpand={() => handleExpandPhaseCard(phase.key)}
              />
            </Box>
          );

          const milestoneCtx: MilestoneRowCtx = {
            phaseKey: phase.key,
            phaseSide: phase.side,
            checklist,
            localMilestoneDone,
            expandedMiIdx,
            anyExpanded,
            dotColor,
            handleToggleMilestone,
            handleExpandMilestone,
          };

          const rows: ReactNode[] = [];

          // ── Phase row ──────────────────────────────────────────────────────
          rows.push(
            <Box
              key="phase-row"
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                // Blur this phase row when another card is expanded, but NOT
                // when this row's own phase card is the one that's expanded.
                transition: 'filter 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
                ...(anyExpanded &&
                  expandedPhaseKey !== phase.key && {
                    filter: 'blur(1.5px)',
                    opacity: 0.38,
                    transform: 'scale(0.97)',
                    pointerEvents: 'none',
                  }),
                // Always fill the li height so SpineConnector grows to match —
                // this keeps the spine continuous when phaseMinHeight adds extra space.
                flex: 1,
              }}
            >
              {/* Left column — shows cards for phases with side === 'right' */}
              <TimelineColumn
                columnSide="left"
                hasContent={phase.side === 'right'}
                bottomPadding={phaseCardGap}
              >
                {phase.side === 'right' && phaseCardNode}
              </TimelineColumn>

              {/* Centre: phase dot + spine */}
              <Box
                data-col="center"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  ...(isDone && { opacity: 0.35, filter: 'grayscale(1)' }),
                }}
              >
                <TimelineDot
                  icon={phase.icon}
                  color={dotColor}
                  size="phase"
                  {...buildPhaseDotTsxProps(
                    phase,
                    checklist,
                    isDone,
                    dotAriaLabel,
                    phaseToggleCounts,
                    selectedPhaseKey
                  )}
                  onClick={dotClickAction}
                  onKeyDown={dotKeyDownHandler}
                />
                {/* SpineConnector spans the full li height — milestone dots overlay it at % positions */}
                {!isLastPhase && (
                  <SpineConnector
                    dotColor={dotColor}
                    yearMilestone={yearLabelValue}
                    yearLabelMarginBottom={yearLabelMarginBottom}
                  />
                )}
              </Box>

              {/* Right column — shows cards for phases with side === 'left' */}
              <TimelineColumn
                columnSide="right"
                hasContent={phase.side === 'left'}
                bottomPadding={phaseCardGap}
              >
                {phase.side === 'left' && phaseCardNode}
              </TimelineColumn>
            </Box>
          );

          // ── Milestone rows ─────────────────────────────────────────────────
          // Cards are absolutely positioned within their column so expanding one
          // never displaces the spine dots below it.
          phaseMilestones.forEach((ms, mi) => {
            rows.push(buildMilestoneRow(ms, mi, phaseMilestones.length, milestoneCtx));
          });

          return (
            <Box
              key={phase.key}
              component="li"
              data-testid="tl-item"
              sx={{
                position: 'relative',
                overflow: 'visible',
                // Flex column so the phase row (flex: 1) can stretch to fill
                // the li — which makes SpineConnector grow with it.
                display: 'flex',
                flexDirection: 'column',
                // Raise z-index when a milestone card is expanded so it floats
                // above the next phase's row rather than being clipped behind it.
                zIndex: expandedMiIdx === null ? 1 : 2,
                // minHeight only applies when milestones are present — gives the spine
                // enough height for all milestone dots to be evenly spaced.
                // Phase card vertical gap is controlled by phaseCardGap (column paddingBottom)
                // which gives a consistent gap regardless of individual card height.
                ...(phaseMilestones.length > 0 && {
                  minHeight: (phaseMilestones.length + 1) * milestoneSlotHeight,
                }),
              }}
            >
              {rows}
            </Box>
          );
        })}
      </Timeline>
    </Box>
  );
}
