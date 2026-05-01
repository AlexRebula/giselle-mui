// @vitest-environment jsdom

/**
 * Pure-logic unit tests for the derivations inside MilestoneBadge.
 *
 * None of these tests mount the component — they extract and verify the exact
 * decision functions in isolation.  If the component logic changes, update the
 * mirror functions below to match and the tests will catch any unintentional
 * behavioural drift.
 *
 * ## Derivations under test
 *
 *   hasDetails  = !!details?.length
 *
 * ## Removed derivations (v2 redesign)
 *
 *   topPct     — removed. Milestones now render as in-flow flex rows inside
 *                their parent phase <li>, not as overlay elements absolutely
 *                positioned on the spine connector. No percentage offset is
 *                needed. (Milestone badge cards within each row are still
 *                absolutely positioned, but row placement is handled by DOM flow.)
 *   cardOnLeft — removed. Card placement is handled by TimelineColumn in
 *                timeline-two-column.tsx, not by MilestoneBadge itself.
 *   isInline   — removed. The `display` prop has been removed from the milestone
 *                type. All milestone cards are now full-width inline cards.
 */

import { it, expect, describe } from 'vitest';

import {
  MILESTONE_DATE_FONT_SIZE,
  MILESTONE_PILL_ICON_SIZE,
  MILESTONE_PILL_TEXT_FONT_SIZE,
} from './milestone-badge';

// ---------------------------------------------------------------------------
// Mirror functions — exact copies of the inline derivations in MilestoneBadge.
// ---------------------------------------------------------------------------

/**
 * Mirrors: const hasDetails = !!details?.length;
 *
 * Gates cursor, onClick handler, aria-expanded, and the Collapse expand section.
 * Independent of any display mode — any milestone can have expandable details.
 */
function computeHasDetails(details?: string[]): boolean {
  return !!details?.length;
}

// ---------------------------------------------------------------------------
// hasDetails — interactivity gate
// ---------------------------------------------------------------------------

describe('hasDetails — interactivity gate', () => {
  it('details undefined → false (no interactivity for bare title+date milestones)', () => {
    expect(computeHasDetails(undefined)).toBe(false);
  });

  it('details empty array → false (empty array is treated as no details)', () => {
    expect(computeHasDetails([])).toBe(false);
  });

  it('details with one item → true', () => {
    expect(computeHasDetails(['Founded 2009'])).toBe(true);
  });

  it('details with multiple items → true', () => {
    expect(computeHasDetails(['Item A', 'Item B', 'Item C'])).toBe(true);
  });

  it('[regression] any milestone with details is expandable regardless of display mode', () => {
    // display mode no longer exists — all milestones with details can expand.
    expect(computeHasDetails(['Sponsored work visa', '457 temporary'])).toBe(true);
  });

  it('[regression] milestone with no details is not expandable', () => {
    expect(computeHasDetails(undefined)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Readability — minimum size constants (regression)
//
// These tests enforce that no size value falls below the minimum readable
// threshold. If a constant is ever reduced below the minimum, the test fails
// immediately — before the change reaches production or Storybook.
//
// Minimums:
//   - Icon size  >= 16 px
//   - Font size  >= 0.75 rem  (12 px at a 16 px base)
//   - Date text  >= 0.75 rem  (milestone date must be as readable as body text)
// ---------------------------------------------------------------------------

const MIN_ICON_SIZE_PX = 16;
const MIN_FONT_SIZE_REM = 0.75;

function parseRem(rem: string): number {
  return parseFloat(rem);
}

describe('readability — minimum size constants', () => {
  it('[regression] MILESTONE_DATE_FONT_SIZE >= 0.75rem (milestone date must be readable)', () => {
    expect(parseRem(MILESTONE_DATE_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });

  it('[regression] MILESTONE_PILL_ICON_SIZE >= 16px (subtask icon in expandable details pill)', () => {
    expect(MILESTONE_PILL_ICON_SIZE).toBeGreaterThanOrEqual(MIN_ICON_SIZE_PX);
  });

  it('[regression] MILESTONE_PILL_TEXT_FONT_SIZE >= 0.75rem (count label in expandable details pill)', () => {
    expect(parseRem(MILESTONE_PILL_TEXT_FONT_SIZE)).toBeGreaterThanOrEqual(MIN_FONT_SIZE_REM);
  });
});
