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
 *   topPct     — removed. Milestones now render as proper TimelineItems in the
 *                document flow rather than being absolutely positioned on the
 *                spine connector. No percentage offset is needed.
 *   cardOnLeft — removed. Card placement is handled by TimelineColumn in
 *                timeline-two-column.tsx, not by MilestoneBadge itself.
 *   isInline   — removed. The `display` prop has been removed from the milestone
 *                type. All milestone cards are now full-width inline cards.
 */

import { it, expect, describe } from 'vitest';

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
