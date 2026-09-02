// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { labeledIconStripLabelSx, labeledIconStripWrapperSx } from './labeled-icon-strip.styles';

// ---------------------------------------------------------------------------
// labeledIconStripLabelSx — section overline label
// ---------------------------------------------------------------------------

describe('labeledIconStripLabelSx — section overline label', () => {
  it('uses display:block with bottom margin', () => {
    const sx = labeledIconStripLabelSx as Record<string, unknown>;
    expect(sx['display']).toBe('block');
    expect(sx['mb']).toBe(1);
  });

  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    const sx = labeledIconStripLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });
});

describe('labeledIconStripWrapperSx — root wrapper', () => {
  it('separates the strip from the previous section with top margin', () => {
    expect(labeledIconStripWrapperSx).toMatchObject({
      mt: 2.5,
    });
  });
});
