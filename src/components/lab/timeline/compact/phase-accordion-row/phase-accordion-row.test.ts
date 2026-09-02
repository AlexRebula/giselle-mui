// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { PhaseAccordionRow } from './phase-accordion-row';

describe('PhaseAccordionRow', () => {
  it('renders the phase title and description when it has details', () => {
    const html = renderToStaticMarkup(
      React.createElement(PhaseAccordionRow, {
        phase: {
          key: 1,
          title: 'Discovery',
          description: 'Kick-off and requirements gathering.',
          date: 'Jan 2026',
          icon: null,
          side: 'left',
          milestones: [],
        },
        sortedMilestones: [],
        checklist: false,
        taskDoneMap: {},
        onTaskToggle: () => {},
        expandedPhaseKey: 1,
        onToggleExpanded: () => {},
      })
    );

    expect(html).toContain('Discovery');
    expect(html).toContain('Kick-off and requirements gathering.');
  });
});
