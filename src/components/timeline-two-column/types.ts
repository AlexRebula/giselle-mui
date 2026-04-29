import type { ReactElement, ReactNode } from 'react';
import type { BoxProps } from '@mui/material/Box';
import type { TimelineDotProps } from '@mui/lab/TimelineDot';

// ----------------------------------------------------------------------

/** MUI palette keys that carry mainChannel — derived from TimelineDot's own color prop. */
export type HighlightedPaletteKey = Exclude<
  NonNullable<TimelineDotProps['color']>,
  'inherit' | 'grey'
>;

// ----------------------------------------------------------------------

export type TimelinePhase = {
  /** Numeric sort key. Fractional keys (e.g. 4.5) interleave life events between roles. */
  key: number;
  /** Display title of the phase — shown as the card heading. */
  title: string;
  /** Short summary paragraph shown below the title on the default card view. */
  description: string;
  /** Human-readable date range (e.g. `'Jan 2020 – Mar 2022'`). Also used for automatic overdue detection in checklist mode. */
  date: string;
  /** Icon rendered inside the TimelineDot. Accepts a width prop for resizing (e.g. via cloneElement). */
  icon: ReactElement<{ width?: number }>;
  /** MUI TimelineDot color. */
  color?: TimelineDotProps['color'];
  /** Which column this item appears in. */
  side: 'left' | 'right';
  /** Dims the card and separator — used for completed/past steps. */
  done?: boolean;
  /** Optional expandable bullet-point details. */
  details?: string[];
  /**
   * Tech stack icons for this entry. Each item provides a `ReactNode` icon and an accessible label.
   * Renders as a horizontal strip of icon slots with a tooltip per item.
   * Use `<GiselleIcon icon={...} width={24} />` or any icon element.
   */
  platforms?: Array<{ icon: ReactNode; label: string }>;
  /**
   * Label displayed above the tech stack strip.
   * @default 'Tech Stack'
   */
  platformsLabel?: string;
  /**
   * 'scenario' — coloured left border + badge label (used in case-001 for departure scenarios).
   * 'life-event' — coloured left border + tinted background (used in career timeline).
   */
  variant?: 'scenario' | 'life-event';
  /** Label shown as a badge above the card when variant='scenario'. */
  scenarioLabel?: string;
  /**
   * Marks this phase as past-due without being done.
   * Renders the dot and connector in error (red) colour as a visual warning.
   */
  overdue?: boolean;
  /**
   * Nested milestone keypoints on the connector spine between this phase and the next.
   * Each milestone renders as a coloured badge dot on the spine.
   */
  milestones?: Array<{
    date: string;
    title: string;
    icon: ReactElement<{ width?: number }>;
    color?: TimelineDotProps['color'];
    /** Short bullet-point facts shown when the card is expanded. */
    details?: string[];
    /** Dims the milestone badge and card — mirrors the phase-level `done` flag. */
    done?: boolean;
    /** Renders the milestone badge in error (red) colour when not done. */
    overdue?: boolean;
  }>;
  /**
   * Client logos shown as a horizontal strip directly in the card (always visible).
   * Each entry is a public path (e.g. '/assets/icons/clients/nbn.svg') plus an accessible name.
   */
  clients?: Array<{ name: string; logo: string }>;
  /** Label displayed above the client logo strip. Set this to something meaningful, e.g. 'Delivered for' or 'Trusted by'. */
  clientsLabel?: string;
  /**
   * Project/product logos shown as a horizontal strip — for showcasing your own work, side-projects, or open-source.
   * Each entry is a public path plus an accessible name.
   */
  projects?: Array<{ name: string; logo: string }>;
  /** Label displayed above the projects logo strip. E.g. 'Building in public' or 'Current projects'. */
  projectsLabel?: string;
  /**
   * Marks this entry as currently active (ongoing).
   * Renders a pulsing badge above the card and a pulsing ring on the timeline dot.
   */
  active?: boolean;
  /**
   * Label for the pulsing active badge above the card.
   * @default 'Now'
   */
  activeLabel?: string; /** Suppress the date label inside the card. Useful when the date is obvious from context (e.g. active/"Now" entries). */
  hideDate?: boolean;
  /**
   * Suppress the `MetricCardDecoration` and corner icon for this specific step.
   * By default both are shown on all non-highlighted cards regardless of `side`.
   */
  hideDecoration?: boolean;
  /**
   * Optional personal photo rendered as a small rounded thumbnail below the description.
   * Use for historic snapshots, childhood photos, or other memorable moments on the timeline.
   */
  photo?: { src: string; alt: string };
  /**
   * Text alignment for card content. Defaults to `'left'` regardless of which column the card
   * sits in. Set to `'right'` from the data layer when right-aligned content is intentional.
   * @default 'left'
   */
  textAlign?: 'left' | 'right';
};

export type TimelineTwoColumnProps = Omit<BoxProps, 'children'> & {
  /** The ordered list of phases to render. Sorted internally by date (active first, then newest → oldest). */
  phases: TimelinePhase[];
  /**
   * Enables interactive checklist behaviour:
   * - Phase and milestone dots become clickable to toggle done state.
   * - Done items are dimmed with a grayscale filter and a checkmark icon.
   * - Past-due items (date in the past, not done, not active) are highlighted in red.
   * - Manual `overdue: true` on a phase forces the red state regardless of date.
   *
   * When omitted (default), the timeline is read-only: no click-to-done, no overdue
   * detection. Hover effects on cards are limited to items with expandable details.
   */
  checklist?: boolean;
  /**
   * Called when the user clicks a phase dot to toggle its done state.
   * Only fires when `checklist` is true.
   * Receives the phase `key` and the new `done` value.
   */
  onTogglePhaseDone?: (key: number, done: boolean) => void;
  /**
   * Called when the user clicks a milestone dot to toggle its done state.
   * Only fires when `checklist` is true.
   * Receives the parent phase `key`, the milestone `index`, and the new `done` value.
   */
  onToggleMilestoneDone?: (phaseKey: number, milestoneIndex: number, done: boolean) => void;
  /**
   * Controlled selection — the key of the currently selected phase.
   * When set, the matching phase dot is shown in its active (enlarged) state.
   * Intended for hero navigation use: the parent controls which phase is focused.
   */
  selectedPhaseKey?: number;
  /**
   * Called when the user clicks a phase dot while `checklist` is false.
   * Receives the phase `key`. Use together with `selectedPhaseKey` for
   * controlled hero navigation.
   */
  onPhaseSelect?: (key: number) => void;
  /**
   * Minimum vertical space (px) allocated per milestone slot on the spine.
   * Controls the breathing room between collapsed milestone cards.
   * Increase when cards are too close; decrease when the timeline feels too tall.
   * @default 60
   */
  milestoneSlotHeight?: number;
  /**
   * Gap (px) added below each phase card — appended as `paddingBottom` on the card column.
   * Because it is measured from the bottom edge of every card (not the top of the li),
   * the visual gap between consecutive phase cards is always exactly
   * `phaseCardGap + column top padding (~6px)`, regardless of individual card height.
   * @default 90
   */
  phaseCardGap?: number;
  /**
   * Bottom offset (px) of the year-boundary label chip from the end of the spine connector.
   * Controls the breathing room between the year label and the next phase dot below it.
   * @default 30
   */
  yearLabelMarginBottom?: number;
};
