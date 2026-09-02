// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { TimelinePhase } from '../types';
import type { PhaseRange } from './types';
import {
  applyOverrides,
  computeAxis,
  getConnectedOverlapGroup,
  hasRemainingOverlaps,
  mergeIntoAll,
  parsePhaseRange,
} from './phase-warning-popover.utils';

// ----------------------------------------------------------------------

function buildPhase(
  overrides: Partial<TimelinePhase> & { key: number; date: string }
): TimelinePhase {
  return {
    title: `Phase ${overrides.key}`,
    icon: null,
    side: 'left',
    ...overrides,
  };
}

// ----------------------------------------------------------------------

describe('parsePhaseRange', () => {
  it('parses a "Mon YYYY – Mon YYYY" range into start/end month indices', () => {
    const phase = buildPhase({ key: 1, date: 'Jan 2020 – Mar 2022' });
    const range = parsePhaseRange(phase);
    expect(range).not.toBeNull();
    expect(range!.startIdx).toBeLessThan(range!.endIdx);
  });

  it('treats a single "Mon YYYY" date as a zero-length range (start === end)', () => {
    const phase = buildPhase({ key: 1, date: 'Jan 2020' });
    const range = parsePhaseRange(phase);
    expect(range).not.toBeNull();
    expect(range!.startIdx).toBe(range!.endIdx);
  });

  it('returns null for a year-only date with no month (e.g. "~1994")', () => {
    const phase = buildPhase({ key: 1, date: '~1994' });
    expect(parsePhaseRange(phase)).toBeNull();
  });

  it('returns null for an open-ended date like "2022 – Now"', () => {
    const phase = buildPhase({ key: 1, date: '2022 – Now' });
    expect(parsePhaseRange(phase)).toBeNull();
  });
});

describe('getConnectedOverlapGroup', () => {
  it('returns only the phases transitively connected to the trigger phase', () => {
    const phases = [
      buildPhase({ key: 1, date: 'Jan 2020 – Jun 2020' }),
      buildPhase({ key: 2, date: 'May 2020 – Oct 2020' }), // overlaps 1
      buildPhase({ key: 3, date: 'Sep 2020 – Feb 2021' }), // overlaps 2, not 1 directly
      buildPhase({ key: 4, date: 'Jan 2022 – Jun 2022' }), // isolated, no overlap
    ];

    const group = getConnectedOverlapGroup(phases, 1);

    expect(group.map((p) => p.key).sort()).toEqual([1, 2, 3]);
  });

  it('returns just the trigger phase when it has no overlaps', () => {
    const phases = [
      buildPhase({ key: 1, date: 'Jan 2020 – Jun 2020' }),
      buildPhase({ key: 2, date: 'Jan 2022 – Jun 2022' }),
    ];

    const group = getConnectedOverlapGroup(phases, 1);

    expect(group.map((p) => p.key)).toEqual([1]);
  });

  it('excludes phases with unparseable dates from the adjacency graph', () => {
    const phases = [
      buildPhase({ key: 1, date: 'Jan 2020 – Jun 2020' }),
      buildPhase({ key: 2, date: '~1994' }),
    ];

    const group = getConnectedOverlapGroup(phases, 1);

    expect(group.map((p) => p.key)).toEqual([1]);
  });
});

describe('computeAxis', () => {
  it('pads the min/max bounds by 2 months on each side', () => {
    const overrides = new Map<number, PhaseRange>([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 90, endIdx: 120 }],
    ]);

    expect(computeAxis(overrides)).toEqual({ min: 88, max: 122 });
  });

  it('falls back to a 0–24 axis when overrides is empty', () => {
    expect(computeAxis(new Map())).toEqual({ min: 0, max: 24 });
  });
});

describe('hasRemainingOverlaps', () => {
  it('returns true when two ranges in the overrides still overlap', () => {
    const overrides = new Map<number, PhaseRange>([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 105, endIdx: 115 }],
    ]);

    expect(hasRemainingOverlaps(overrides)).toBe(true);
  });

  it('returns false when no ranges overlap', () => {
    const overrides = new Map<number, PhaseRange>([
      [1, { startIdx: 100, endIdx: 110 }],
      [2, { startIdx: 111, endIdx: 120 }],
    ]);

    expect(hasRemainingOverlaps(overrides)).toBe(false);
  });

  it('returns false for a single override or an empty map', () => {
    expect(hasRemainingOverlaps(new Map([[1, { startIdx: 0, endIdx: 5 }]]))).toBe(false);
    expect(hasRemainingOverlaps(new Map())).toBe(false);
  });
});

describe('applyOverrides', () => {
  it('rewrites the date string of each overridden phase, without mutating the input', () => {
    const original = buildPhase({ key: 1, date: 'Jan 2020 – Jun 2020' });
    const overrides = new Map<number, PhaseRange>([[1, { startIdx: 200, endIdx: 210 }]]);

    const result = applyOverrides([original], overrides);

    expect(result[0]!.date).not.toBe(original.date);
    expect(original.date).toBe('Jan 2020 – Jun 2020');
  });

  it('renders a single month (no dash) when startIdx === endIdx', () => {
    const original = buildPhase({ key: 1, date: 'Jan 2020 – Jun 2020' });
    const overrides = new Map<number, PhaseRange>([[1, { startIdx: 200, endIdx: 200 }]]);

    const result = applyOverrides([original], overrides);

    expect(result[0]!.date).not.toContain('–');
  });

  it('leaves phases with no matching override untouched', () => {
    const untouched = buildPhase({ key: 2, date: 'Jan 2020 – Jun 2020' });
    const overrides = new Map<number, PhaseRange>([[1, { startIdx: 200, endIdx: 210 }]]);

    const result = applyOverrides([untouched], overrides);

    expect(result[0]).toEqual(untouched);
  });
});

describe('mergeIntoAll', () => {
  it('replaces phases by key with their updated version', () => {
    const allPhases = [
      buildPhase({ key: 1, date: 'Jan 2020' }),
      buildPhase({ key: 2, date: 'Feb 2020' }),
    ];
    const updated = [buildPhase({ key: 1, date: 'Mar 2020' })];

    const result = mergeIntoAll(allPhases, updated);

    expect(result.find((p) => p.key === 1)!.date).toBe('Mar 2020');
    expect(result.find((p) => p.key === 2)!.date).toBe('Feb 2020');
  });

  it('preserves the original array order and length', () => {
    const allPhases = [
      buildPhase({ key: 1, date: 'Jan 2020' }),
      buildPhase({ key: 2, date: 'Feb 2020' }),
      buildPhase({ key: 3, date: 'Mar 2020' }),
    ];

    const result = mergeIntoAll(allPhases, []);

    expect(result.map((p) => p.key)).toEqual([1, 2, 3]);
  });
});
