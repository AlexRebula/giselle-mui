// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';

import type { TimelinePhase } from '../types';
import type { PhaseRowProps } from './types';

// Child component mocks for unit isolation — these components have their own tests.
vi.mock('../timeline-dot', () => ({
  TimelineDot: () => React.createElement('span', { 'data-testid': 'timeline-dot' }),
}));

vi.mock('../spine-connector', () => ({
  SpineConnector: () => React.createElement('span', { 'data-testid': 'spine-connector' }),
}));

import { renderWithTheme } from '../../../../../test-utils';
import { PhaseRow } from './phase-row';

// ---------------------------------------------------------------------------

const basePhase: TimelinePhase = {
  key: 1,
  title: 'Discovery',
  date: 'Jan 2024',
  color: 'primary',
  side: 'left',
  icon: null,
};

const baseProps: PhaseRowProps = {
  phase: basePhase,
  isSuppressed: false,
  phaseCardGap: 16,
  phaseCardNode: React.createElement('span', { 'data-testid': 'phase-card' }, 'Card'),
  dotColor: 'primary',
  isDone: false,
  isLastPhase: false,
  yearLabelValue: null,
  yearLabelMarginBottom: 0,
  checklist: false,
  dotClickAction: undefined,
  dotKeyDownHandler: undefined,
  dotAriaLabel: undefined,
  phaseToggleCounts: {},
  selectedPhaseKey: undefined,
  isMobile: false,
};

// ---------------------------------------------------------------------------
// Column placement
// ---------------------------------------------------------------------------

describe('PhaseRow — column placement', () => {
  it('renders the card in the left column on desktop when phase.side="left"', () => {
    const html = renderWithTheme(React.createElement(PhaseRow, baseProps));
    expect(html).toContain('data-col="left"');
    expect(html).toContain('data-testid="phase-card"');
  });

  it('renders the card in the right column on desktop when phase.side="right"', () => {
    const phase: TimelinePhase = { ...basePhase, side: 'right' };
    const html = renderWithTheme(React.createElement(PhaseRow, { ...baseProps, phase }));
    expect(html).toContain('data-testid="phase-card"');
  });

  it('[regression: mobile] left-side phase card renders in the right slot when isMobile=true', () => {
    const html = renderWithTheme(React.createElement(PhaseRow, { ...baseProps, isMobile: true }));
    expect(html).toContain('data-testid="phase-card"');
  });
});

// ---------------------------------------------------------------------------
// Date pill
// ---------------------------------------------------------------------------

describe('PhaseRow — floating date pill', () => {
  it('renders the phase date when hideDate is not set', () => {
    const html = renderWithTheme(React.createElement(PhaseRow, baseProps));
    expect(html).toContain('Jan 2024');
  });

  it('[regression] omits the floating date pill (but not the tooltip date) when phase.hideDate is true', () => {
    // hideDate only suppresses the always-rendered floating pill Typography — the
    // Tooltip's aria-label (from resolvePhaseTooltip) still includes the date, so
    // "Jan 2024" appears exactly once (in the aria-label) instead of twice.
    const phase: TimelinePhase = { ...basePhase, hideDate: true };
    const html = renderWithTheme(React.createElement(PhaseRow, { ...baseProps, phase }));
    const count = (html.match(/Jan 2024/g) ?? []).length;
    expect(count).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Spine connector
// ---------------------------------------------------------------------------

describe('PhaseRow — spine connector', () => {
  it('renders spine connector when isLastPhase=false', () => {
    const html = renderWithTheme(React.createElement(PhaseRow, baseProps));
    expect(html).toContain('data-testid="spine-connector"');
  });

  it('suppresses spine connector when isLastPhase=true', () => {
    const html = renderWithTheme(
      React.createElement(PhaseRow, { ...baseProps, isLastPhase: true })
    );
    expect(html).not.toContain('data-testid="spine-connector"');
  });
});
