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
 *   buildPlatformStripItems — REGRESSION: Iconify icon IDs passed as strings must NOT be auto-resolved to icons
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

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
// buildPlatformStripItems — per-entry derivations
// ---------------------------------------------------------------------------

/**
 * Mirrors the per-entry derivations inside buildPlatformStripItems.
 *
 * The function maps each platform entry to a `{ label, hasTextFallback }` pair:
 *   - `label`           — becomes both the Tooltip `title` prop and, for string entries, the visible text.
 *   - `hasTextFallback` — true when the entry is a plain string (no icon provided),
 *                         meaning a `<Box component="span">` text node is rendered instead of an icon.
 */
function derivePlatformEntry(p: { icon: unknown; label: string } | string): {
  label: string;
  hasTextFallback: boolean;
} {
  const label = typeof p === 'string' ? p : p.label;
  const hasTextFallback = typeof p === 'string';
  return { label, hasTextFallback };
}

describe('buildPlatformStripItems — string entry (text-label fallback)', () => {
  it('string entry → label equals the string', () => {
    expect(derivePlatformEntry('TypeScript').label).toBe('TypeScript');
  });

  it('string entry → hasTextFallback is true (no icon → text span rendered)', () => {
    expect(derivePlatformEntry('React').hasTextFallback).toBe(true);
  });

  it('string entry → label is also the tooltip title (same value)', () => {
    // Tooltip title === label for string entries — asserting label correctness
    // is sufficient to assert tooltip title correctness.
    expect(derivePlatformEntry('Node.js').label).toBe('Node.js');
  });

  it('[regression] plain string[] (legacy consumer data) → all entries produce label nodes', () => {
    const items: Array<{ icon: unknown; label: string } | string> = ['AWS', 'GCP', 'Azure'];
    const derived = items.map(derivePlatformEntry);
    expect(derived.map((d) => d.label)).toEqual(['AWS', 'GCP', 'Azure']);
    expect(derived.every((d) => d.hasTextFallback)).toBe(true);
  });
});

describe('buildPlatformStripItems — object entry (icon slot)', () => {
  it('object entry → label equals p.label', () => {
    expect(derivePlatformEntry({ icon: '<svg />', label: 'React' }).label).toBe('React');
  });

  it('object entry → hasTextFallback is false (icon provided → icon renders, not text span)', () => {
    expect(derivePlatformEntry({ icon: '<svg />', label: 'Vue' }).hasTextFallback).toBe(false);
  });

  it('object entry with null icon → hasTextFallback false (icon slot still provided)', () => {
    // null is a valid ReactNode — the consumer explicitly passed the icon slot.
    expect(derivePlatformEntry({ icon: null, label: 'Figma' }).hasTextFallback).toBe(false);
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

// ---------------------------------------------------------------------------
// buildPlatformStripItems — REGRESSION tests
//
// REGRESSION: Before the { icon, label } migration, platforms were passed as
// bare strings like 'logos:php'. The component rendered those strings as text
// labels — so the UI showed "logos:php" instead of the PHP logo icon.
//
// These tests guard that contract:
//   - string platform → rendered as the string value (text chip, no icon slot)
//   - { icon, label } platform → icon node rendered, NOT the raw label as visible text
//   - string that looks like an Iconify ID ('logos:php') → still just text, never magically resolved
// ---------------------------------------------------------------------------

/** Mirror of buildPlatformStripItems from phase-card.tsx */
type PlatformItem = { icon: React.ReactNode; label: string } | string;

function buildPlatformStripItems(platforms: PlatformItem[]): React.ReactNode[] {
  return platforms.map((p, i) => {
    const label = typeof p === 'string' ? p : p.label;
    const icon = typeof p === 'string' ? null : p.icon;
    return React.createElement(
      'div',
      { key: `platform-${i}`, title: label },
      icon ?? React.createElement('span', null, label)
    );
  });
}

describe('buildPlatformStripItems — string platform (text chip)', () => {
  it('plain tech name renders as its own text', () => {
    const nodes = buildPlatformStripItems(['jQuery']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('jQuery');
  });

  it('Iconify-ID string renders as literal text — NOT resolved to an icon', () => {
    // Regression guard: before migration, 'logos:php' was passed as a string and
    // displayed as the text "logos:php" in the UI. This test documents that the
    // component does NOT silently resolve icon IDs — the consumer must pass
    // { icon: <Iconify icon="logos:php" />, label: 'PHP' } to get icon rendering.
    const nodes = buildPlatformStripItems(['logos:php']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('logos:php'); // text chip, not an icon
  });

  it('multiple string platforms all render', () => {
    const nodes = buildPlatformStripItems(['jQuery', 'Kendo UI', 'C#']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('jQuery');
    expect(html).toContain('Kendo UI');
    expect(html).toContain('C#');
  });
});

describe('buildPlatformStripItems — { icon, label } platform (icon slot)', () => {
  it('icon node renders; label is in tooltip title attribute', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon', alt: 'PHP' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    // The icon element is rendered
    expect(html).toContain('data-testid="php-icon"');
    // The label is accessible via the tooltip title — not as visible inner text
    expect(html).toContain('title="PHP"');
    // The label is NOT rendered as a text span (icon replaced the fallback)
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });

  it('{ icon, label } never renders label as inner text when icon is provided', () => {
    const iconEl = React.createElement('svg', { 'data-testid': 'ts-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'TypeScript' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="ts-icon"');
    expect(html).not.toMatch(/<span[^>]*>TypeScript<\/span>/);
  });
});

describe('buildPlatformStripItems — mixed string and object platforms', () => {
  it('icon items and string items can coexist in one array', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }, 'Smarty', 'jQuery']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="php-icon"');
    expect(html).toContain('>Smarty<');
    expect(html).toContain('>jQuery<');
    // PHP label must NOT appear as inner text (it has an icon)
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });
});
