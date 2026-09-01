// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { sparklineFallbackSx, sparklineRootSx } from './sparkline-bar-chart.styles';

// ----------------------------------------------------------------------

describe('sparklineRootSx', () => {
  it('sizes the root to the requested width and height, clipping overflow', () => {
    expect(sparklineRootSx(84, 56)).toMatchObject({
      width: 84,
      height: 56,
      overflow: 'hidden',
    });
  });

  it('forwards a different width/height pair', () => {
    expect(sparklineRootSx(120, 40)).toMatchObject({
      width: 120,
      height: 40,
    });
  });
});

describe('sparklineFallbackSx', () => {
  it('matches the fallback size to the requested width and height', () => {
    expect(sparklineFallbackSx(84, 56)).toMatchObject({
      width: 84,
      height: 56,
    });
  });
});
