// @vitest-environment jsdom

import { describe, it, expect, vi } from 'vitest';
import * as React from 'react';

import type { Milestone, MilestoneRowCtx } from '../types';
import type { MilestoneRowProps } from './types';

// Child component mocks for unit isolation — these components have their own tests.
vi.mock('../milestone-badge', () => ({
  MilestoneBadge: (props: { columnSide?: 'left' | 'right' }) =>
    React.createElement('span', {
      'data-testid': 'milestone-badge',
      'data-column-side': props.columnSide ?? 'right',
    }),
}));

vi.mock('../timeline-dot', () => ({
  TimelineDot: () => React.createElement('span', { 'data-testid': 'timeline-dot' }),
}));

import { renderWithTheme } from '../../../../../test-utils';
import { MilestoneRow } from './milestone-row';

// ---------------------------------------------------------------------------

const baseMilestone: Milestone = {
  key: 1,
  title: 'Beta release',
  date: 'Mar 2024',
  icon: null,
};

const baseCtx: MilestoneRowCtx = {
  phaseKey: 1,
  phaseSide: 'left',
  checklist: false,
  localMilestoneDone: {},
  localTaskDoneMap: {},
  expandedMiIdx: null,
  anyExpanded: false,
  dotColor: 'primary',
  expandableIcon: null,
  viewedKeys: new Set(),
  onMarkViewed: undefined,
  handleToggleMilestone: () => {},
  handleToggleTask: () => {},
  handleExpandMilestone: () => {},
  onMeasure: () => {},
};

const baseProps: MilestoneRowProps = {
  ms: baseMilestone,
  mi: 0,
  totalMilestones: 3,
  ctx: baseCtx,
  isMobile: false,
};

// ---------------------------------------------------------------------------
// Column placement
// ---------------------------------------------------------------------------

describe('MilestoneRow — column placement', () => {
  it('renders the card in the left column when the effective side is left', () => {
    const html = renderWithTheme(React.createElement(MilestoneRow, baseProps));
    expect(html).toContain('data-column-side="left"');
  });

  it('renders the card in the right column when the effective side is right', () => {
    const html = renderWithTheme(
      React.createElement(MilestoneRow, { ...baseProps, ctx: { ...baseCtx, phaseSide: 'right' } })
    );
    expect(html).toContain('data-testid="milestone-badge"');
    expect(html).not.toContain('data-column-side="left"');
  });

  it('explicit ms.side overrides the inherited phase side', () => {
    const html = renderWithTheme(
      React.createElement(MilestoneRow, {
        ...baseProps,
        ms: { ...baseMilestone, side: 'right' },
        ctx: { ...baseCtx, phaseSide: 'left' },
      })
    );
    expect(html).not.toContain('data-column-side="left"');
  });
});

// ---------------------------------------------------------------------------
// Dot rendering
// ---------------------------------------------------------------------------

describe('MilestoneRow — dot', () => {
  it('always renders the timeline dot', () => {
    const html = renderWithTheme(React.createElement(MilestoneRow, baseProps));
    expect(html).toContain('data-testid="timeline-dot"');
  });

  it('renders the floating date pill when ms.date is set', () => {
    const html = renderWithTheme(React.createElement(MilestoneRow, baseProps));
    expect(html).toContain('Mar 2024');
  });
});
