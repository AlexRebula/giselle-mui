// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { topTriangleStackSx, smallTriangleSx } from './faq-top-lines.styles';
import { FAQ_FLOAT_LINE_LEFT } from './faq-top-lines.const';

// ----------------------------------------------------------------------

describe('topTriangleStackSx', () => {
  it('positions the stack absolutely at the float-line left offset', () => {
    expect(topTriangleStackSx).toMatchObject({
      position: 'absolute',
      left: FAQ_FLOAT_LINE_LEFT,
    });
  });
});

describe('smallTriangleSx', () => {
  it('reduces size and opacity relative to the primary triangle', () => {
    expect(smallTriangleSx).toMatchObject({
      width: 30,
      height: 15,
      opacity: 0.24,
    });
  });
});
