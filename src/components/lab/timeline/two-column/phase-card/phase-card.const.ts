/**
 * Named constants for `PhaseCard` and its internal sub-components.
 *
 * Every size, font-size, and minimum-touch-target value is exported as a named
 * constant so that:
 * - Components reference one authoritative value — no magic numbers.
 * - Regression tests can import the constant and assert it stays above the
 *   WCAG / readability minimum without rendering the full component.
 */

// ── Status badges ─────────────────────────────────────────────────────────────

/** Font size for all status badge labels (Overdue, Now, Date overlap, Scenario). */
export const STATUS_BADGE_FONT_SIZE = '0.75rem';

// ── Active pulsing dot ────────────────────────────────────────────────────────

/** Width and height (px) of the "Now" active pulsing dot. Never set below 12. */
export const ACTIVE_DOT_SIZE = 12;

// ── Expandable details pill ───────────────────────────────────────────────────

/** Width (px) of the subtask icon inside the expandable details count pill. */
export const PHASE_PILL_ICON_SIZE = 16;

/** Font size for the count label inside the expandable details count pill. */
export const PHASE_PILL_TEXT_FONT_SIZE = '0.75rem';
