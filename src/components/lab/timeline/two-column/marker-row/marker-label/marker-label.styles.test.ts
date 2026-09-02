// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { markerCaptionSx, markerDateSpanSx } from './marker-label.styles';

// ---------------------------------------------------------------------------
// markerCaptionSx
// ---------------------------------------------------------------------------

describe('markerCaptionSx — marker label caption', () => {
  it('uses secondary text colour, semi-bold weight, and nowrap to prevent label wrapping', () => {
    const sx = markerCaptionSx as Record<string, unknown>;
    expect(sx['color']).toBe('text.secondary');
    expect(sx['fontWeight']).toBe(600);
    expect(sx['whiteSpace']).toBe('nowrap');
  });
});

// ---------------------------------------------------------------------------
// markerDateSpanSx
// ---------------------------------------------------------------------------

describe('markerDateSpanSx — marker inline date span', () => {
  it('has left margin, reduced weight, and partial opacity', () => {
    const sx = markerDateSpanSx as Record<string, unknown>;
    expect(sx['ml']).toBe(0.75);
    expect(sx['fontWeight']).toBe(400);
    expect(sx['opacity']).toBe(0.7);
  });
});
