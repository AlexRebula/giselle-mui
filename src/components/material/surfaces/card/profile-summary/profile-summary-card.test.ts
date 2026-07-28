// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';

import { renderWithTheme } from '../../../../../test-utils';
import { ProfileSummaryCard } from './profile-summary-card';

// ----------------------------------------------------------------------

describe('ProfileSummaryCard', () => {
  it('renders the name', () => {
    const html = renderWithTheme(
      React.createElement(ProfileSummaryCard, {
        name: 'Nami',
        stats: [{ label: 'Tasks done', value: 12 }],
      })
    );
    expect(html).toContain('Nami');
  });

  it('renders stat labels and values', () => {
    const html = renderWithTheme(
      React.createElement(ProfileSummaryCard, {
        name: 'Nami',
        stats: [
          { label: 'Tasks done', value: 12 },
          { label: 'Earned', value: '$240' },
        ],
      })
    );
    expect(html).toContain('Tasks done');
    expect(html).toContain('$240');
  });

  it('renders role when provided', () => {
    const html = renderWithTheme(
      React.createElement(ProfileSummaryCard, {
        name: 'Nami',
        role: 'Navigator',
        stats: [],
      })
    );
    expect(html).toContain('Navigator');
  });

  it('omits role when not provided', () => {
    const html = renderWithTheme(
      React.createElement(ProfileSummaryCard, {
        name: 'Nami',
        stats: [],
      })
    );
    expect(html).not.toContain('Navigator');
  });
});
