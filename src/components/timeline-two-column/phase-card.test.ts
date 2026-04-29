// @vitest-environment jsdom

/**
 * Pure-logic unit tests for the helper functions inside PhaseCard.
 *
 * None of these tests mount the component — they extract and verify the exact
 * decision functions in isolation. If the component logic changes, update the
 * mirror functions below to match and the tests will catch any unintentional
 * behavioural drift.
 *
 * ## Derivations under test
 *
 *   isHighlightedVariant    — gates the highlighted card border/bg treatment
 *   buildCardClickHandler   — calls toggle only when hasDetails is true
 *   buildCardKeyDownHandler — fires toggle on Enter/Space when hasDetails is true
 *   resolveCardExpansion    — selects controlled vs. uncontrolled expand mode
 *   CardStatusBadge logic   — priority: overdue (not done) > active > scenario
 */

import { it, vi, expect, describe } from 'vitest';

// ---------------------------------------------------------------------------
// Mirror functions — exact copies of the inline helpers in phase-card.tsx
// ---------------------------------------------------------------------------

function isHighlightedVariant(variant?: string): boolean {
  return variant === 'scenario' || variant === 'life-event';
}

function buildCardClickHandler(hasDetails: boolean, toggle: () => void): () => void {
  return () => {
    if (hasDetails) toggle();
  };
}

function buildCardKeyDownHandler(
  hasDetails: boolean,
  toggle: () => void
): (e: { key: string; preventDefault: () => void }) => void {
  return (e) => {
    if (hasDetails && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      toggle();
    }
  };
}

function resolveCardExpansion(
  onRequestExpand: (() => void) | undefined,
  isExpanded: boolean | undefined,
  internalExpanded: boolean,
  setInternalExpanded: (updater: (v: boolean) => boolean) => void
): { expanded: boolean; toggle: () => void } {
  if (onRequestExpand === undefined) {
    return { expanded: internalExpanded, toggle: () => setInternalExpanded((v) => !v) };
  }
  return { expanded: isExpanded ?? false, toggle: onRequestExpand };
}

/** Mirrors CardStatusBadge priority rules — returns which badge type fires. */
function resolveStatusBadge(opts: {
  isOverdue: boolean;
  isDone: boolean;
  isActive: boolean;
  isScenario: boolean;
  scenarioLabel?: string;
}): 'overdue' | 'active' | 'scenario' | null {
  if (opts.isOverdue && !opts.isDone) return 'overdue';
  if (opts.isActive) return 'active';
  if (opts.isScenario && opts.scenarioLabel) return 'scenario';
  return null;
}

// ---------------------------------------------------------------------------
// isHighlightedVariant
// ---------------------------------------------------------------------------

describe('isHighlightedVariant', () => {
  it('scenario → true', () => {
    expect(isHighlightedVariant('scenario')).toBe(true);
  });

  it('life-event → true', () => {
    expect(isHighlightedVariant('life-event')).toBe(true);
  });

  it('undefined → false', () => {
    expect(isHighlightedVariant()).toBe(false);
  });

  it('unknown variant string → false', () => {
    expect(isHighlightedVariant('custom-variant')).toBe(false);
  });

  it('empty string → false', () => {
    expect(isHighlightedVariant('')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// buildCardClickHandler
// ---------------------------------------------------------------------------

describe('buildCardClickHandler', () => {
  it('hasDetails=true → toggle called on click', () => {
    const toggle = vi.fn();
    const handler = buildCardClickHandler(true, toggle);
    handler();
    expect(toggle).toHaveBeenCalledOnce();
  });

  it('hasDetails=false → toggle NOT called on click', () => {
    const toggle = vi.fn();
    const handler = buildCardClickHandler(false, toggle);
    handler();
    expect(toggle).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// buildCardKeyDownHandler
// ---------------------------------------------------------------------------

function makeEvent(key: string) {
  return { key, preventDefault: vi.fn() };
}

describe('buildCardKeyDownHandler', () => {
  it('Enter + hasDetails=true → toggle called + default prevented', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent('Enter');
    handler(e);
    expect(toggle).toHaveBeenCalledOnce();
    expect(e.preventDefault).toHaveBeenCalledOnce();
  });

  it('Space + hasDetails=true → toggle called + default prevented', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent(' ');
    handler(e);
    expect(toggle).toHaveBeenCalledOnce();
    expect(e.preventDefault).toHaveBeenCalledOnce();
  });

  it('Enter + hasDetails=false → no-op', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(false, toggle);
    const e = makeEvent('Enter');
    handler(e);
    expect(toggle).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });

  it('Tab + hasDetails=true → no-op (only Enter/Space are activation keys)', () => {
    const toggle = vi.fn();
    const handler = buildCardKeyDownHandler(true, toggle);
    const e = makeEvent('Tab');
    handler(e);
    expect(toggle).not.toHaveBeenCalled();
    expect(e.preventDefault).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// resolveCardExpansion
// ---------------------------------------------------------------------------

describe('resolveCardExpansion — uncontrolled mode', () => {
  it('no onRequestExpand → expanded = internalExpanded', () => {
    const setter = vi.fn();
    const { expanded } = resolveCardExpansion(undefined, undefined, false, setter);
    expect(expanded).toBe(false);
  });

  it('no onRequestExpand, internalExpanded=true → expanded = true', () => {
    const setter = vi.fn();
    const { expanded } = resolveCardExpansion(undefined, undefined, true, setter);
    expect(expanded).toBe(true);
  });

  it('uncontrolled toggle calls setter with toggler function', () => {
    const setter = vi.fn();
    const { toggle } = resolveCardExpansion(undefined, undefined, false, setter);
    toggle();
    expect(setter).toHaveBeenCalledOnce();
    // The setter receives a function that inverts the current value
    const updater = setter.mock.calls[0]![0] as (v: boolean) => boolean;
    expect(updater(false)).toBe(true);
    expect(updater(true)).toBe(false);
  });
});

describe('resolveCardExpansion — controlled mode', () => {
  it('onRequestExpand provided → expanded = isExpanded', () => {
    const handler = vi.fn();
    const { expanded } = resolveCardExpansion(handler, true, false, vi.fn());
    expect(expanded).toBe(true);
  });

  it('isExpanded undefined in controlled mode → expanded defaults to false', () => {
    const handler = vi.fn();
    const { expanded } = resolveCardExpansion(handler, undefined, false, vi.fn());
    expect(expanded).toBe(false);
  });

  it('controlled toggle calls onRequestExpand', () => {
    const handler = vi.fn();
    const { toggle } = resolveCardExpansion(handler, false, false, vi.fn());
    toggle();
    expect(handler).toHaveBeenCalledOnce();
  });
});

// ---------------------------------------------------------------------------
// CardStatusBadge priority rules
// ---------------------------------------------------------------------------

describe('CardStatusBadge priority rules', () => {
  it('overdue + not done → overdue badge (highest priority)', () => {
    expect(
      resolveStatusBadge({
        isOverdue: true,
        isDone: false,
        isActive: false,
        isScenario: false,
      })
    ).toBe('overdue');
  });

  it('[regression] overdue + done → overdue suppressed (done phase is no longer pending)', () => {
    // A completed phase cannot simultaneously be overdue — the done flag wins.
    expect(
      resolveStatusBadge({
        isOverdue: true,
        isDone: true,
        isActive: false,
        isScenario: false,
      })
    ).toBeNull();
  });

  it('active phase → active badge', () => {
    expect(
      resolveStatusBadge({
        isOverdue: false,
        isDone: false,
        isActive: true,
        isScenario: false,
      })
    ).toBe('active');
  });

  it('scenario + scenarioLabel → scenario badge', () => {
    expect(
      resolveStatusBadge({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: true,
        scenarioLabel: 'Departure scenario',
      })
    ).toBe('scenario');
  });

  it('scenario without scenarioLabel → null (no empty badge)', () => {
    expect(
      resolveStatusBadge({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: true,
        scenarioLabel: undefined,
      })
    ).toBeNull();
  });

  it('none of the conditions met → null', () => {
    expect(
      resolveStatusBadge({
        isOverdue: false,
        isDone: false,
        isActive: false,
        isScenario: false,
      })
    ).toBeNull();
  });

  it('[regression] overdue wins over active when both are set', () => {
    // In practice a phase can't be both overdue and active, but if it were,
    // overdue must win so the warning is never silently hidden.
    expect(
      resolveStatusBadge({
        isOverdue: true,
        isDone: false,
        isActive: true,
        isScenario: false,
      })
    ).toBe('overdue');
  });
});
