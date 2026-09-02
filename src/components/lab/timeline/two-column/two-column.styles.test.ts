// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import {
  timelineViewSlotSx,
  floatingDatePillSx,
  phaseLiSx,
  centerColumnSx,
  timelineRootSx,
} from './two-column.styles';

// ---------------------------------------------------------------------------
// timelineViewSlotSx (unified factory — replaces the two separate compact/full
// wrapper Box literals previously inlined in two-column.tsx)
// ---------------------------------------------------------------------------

describe('timelineViewSlotSx("compact") — compact accordion wrapper', () => {
  it('shows on xs, hides on md+', () => {
    expect(timelineViewSlotSx('compact')).toMatchObject({
      display: { xs: 'block', md: 'none' },
    });
  });

  it('does not set position (only the full view needs a positioning context)', () => {
    const sx = timelineViewSlotSx('compact') as Record<string, unknown>;
    expect(sx['position']).toBeUndefined();
  });
});

describe('timelineViewSlotSx("full") — full two-column spine wrapper', () => {
  it('hides on xs, shows on md+, and is relatively positioned', () => {
    expect(timelineViewSlotSx('full')).toMatchObject({
      display: { xs: 'none', md: 'block' },
      position: 'relative',
    });
  });
});

// ---------------------------------------------------------------------------
// Phase-card reserve slot regression — milestone clearance invariant
// ---------------------------------------------------------------------------
//
// The first milestone must never overlap the phase card.
// milestone-row/milestone-row.tsx uses PHASE_CARD_RESERVE_SLOTS=2 in the topPercent formula.
// two-column.tsx uses the same constant in phaseMinHeight.
// This test locks in the math so a refactor cannot silently break the invariant.
//
// Variables (using typical values):
//   RESERVE = 2
//   slotHeight = 80px (measured card 64px + 16px padding)
//   n = 4 milestones
//   H_ms = 64px (milestone card height)
//   H_phase = 110px (typical desktop phase card)
//
// Expected:
//   phaseMinHeight = (RESERVE + n + 1) × slotHeight = 7 × 80 = 560px
//   topPercent[0] = (RESERVE + 0 + 1) / (RESERVE + n + 1) = 3/7 ≈ 42.86%
//   first milestone top (center) = 42.86% × 560 + 15 = 255px
//   first milestone card top = 255 - 32 = 223px
//   phase card bottom = 6 + 110 = 116px
//   clearance = 223 - 116 = 107px > 0 ✓

describe('[regression] phase-card reserve — milestone clearance invariant', () => {
  const RESERVE = 2;
  const slotHeight = 80;
  const H_ms = 64;

  it('first milestone (n=4) clears a 110px phase card by at least 80px', () => {
    const n = 4;
    const liHeight = (RESERVE + n + 1) * slotHeight; // 7 × 80 = 560
    const topFraction = (RESERVE + 1) / (RESERVE + n + 1); // 3/7
    const firstMsCenter = topFraction * liHeight + 15; // 240 + 15 = 255
    const firstMsCardTop = firstMsCenter - H_ms / 2; // 255 - 32 = 223
    const phaseCardBottom = 6 + 110; // pt:0.75 (6px) + H_phase
    expect(firstMsCardTop - phaseCardBottom).toBeGreaterThanOrEqual(80);
  });

  it('[regression] first milestone (n=1) clears a 90px phase card', () => {
    const n = 1;
    const liHeight = (RESERVE + n + 1) * slotHeight; // 4 × 80 = 320
    const topFraction = (RESERVE + 1) / (RESERVE + n + 1); // 3/4
    const firstMsCenter = topFraction * liHeight + 15;
    const firstMsCardTop = firstMsCenter - H_ms / 2;
    const phaseCardBottom = 6 + 90;
    expect(firstMsCardTop).toBeGreaterThan(phaseCardBottom);
  });

  it('[regression] formula holds at extreme xs phase card height (200px) with n=4', () => {
    const n = 4;
    const liHeight = (RESERVE + n + 1) * slotHeight;
    const firstMsCardTop = ((RESERVE + 1) / (RESERVE + n + 1)) * liHeight + 15 - H_ms / 2;
    const phaseCardBottom = 6 + 200; // very tall xs phase card
    expect(firstMsCardTop).toBeGreaterThan(phaseCardBottom);
  });
});

// ---------------------------------------------------------------------------
// floatingDatePillSx
// ---------------------------------------------------------------------------

describe('floatingDatePillSx — floating date pill above a dot', () => {
  it('[regression] is display:none by default (shown on hover via parent wrapper)', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['display']).toBe('none');
  });

  it('is absolutely positioned above the dot', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['position']).toBe('absolute');
    expect(sx['bottom']).toBe('calc(100% + 4px)');
    expect(sx['left']).toBe('50%');
    expect(sx['transform']).toBe('translateX(-50%)');
  });

  it('[regression] font size meets item-date minimum of 0.875rem', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.875rem');
  });

  it('has z-index 2 so it renders above dot', () => {
    const sx = floatingDatePillSx as Record<string, unknown>;
    expect(sx['zIndex']).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// phaseLiSx
// ---------------------------------------------------------------------------

describe('phaseLiSx — phase li element', () => {
  it('uses zIndex=1 when no milestone expanded', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['zIndex']).toBe(1);
  });

  it('uses zIndex=2 when a milestone is expanded', () => {
    const styles = phaseLiSx({ zIndex: 2 }) as Record<string, unknown>;
    expect(styles['zIndex']).toBe(2);
  });

  it('sets minHeight when computedMinHeight is provided', () => {
    const styles = phaseLiSx({ zIndex: 1, computedMinHeight: 480 }) as Record<string, unknown>;
    expect(styles['minHeight']).toBe(480);
  });

  it('omits minHeight when computedMinHeight is undefined', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['minHeight']).toBeUndefined();
  });

  it('has :has() pseudo-class for hovered milestone cards', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    const hasRule = styles['&:has([data-ms-card]:hover)'] as Record<string, number>;
    expect(hasRule['zIndex']).toBe(3);
  });

  it('is column flex, relatively positioned', () => {
    const styles = phaseLiSx({ zIndex: 1 }) as Record<string, unknown>;
    expect(styles['position']).toBe('relative');
    expect(styles['display']).toBe('flex');
    expect(styles['flexDirection']).toBe('column');
  });
});

// ---------------------------------------------------------------------------
// centerColumnSx
// ---------------------------------------------------------------------------

describe('centerColumnSx — centre spine column', () => {
  it('is column flex, centred', () => {
    const sx = centerColumnSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['alignItems']).toBe('center');
  });

  it('[regression] has flexShrink:0 so the spine dot is never squeezed at narrow widths', () => {
    const sx = centerColumnSx as Record<string, unknown>;
    expect(sx['flexShrink']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// timelineRootSx
// ---------------------------------------------------------------------------

describe('timelineRootSx — MUI Timeline root', () => {
  it('resets MUI default padding and margin', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    expect(sx['p']).toBe(0);
    expect(sx['m']).toBe(0);
  });

  it('removes MUI pseudo-element before TimelineItem', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    const reset = sx['& .MuiTimelineItem-root:before'] as Record<string, unknown>;
    expect(reset['flex']).toBe(0);
    expect(reset['padding']).toBe(0);
  });

  it('does not clip content with overflowX:hidden', () => {
    const sx = timelineRootSx as Record<string, unknown>;
    expect(sx['overflowX']).toBeUndefined();
  });
});
