// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import {
  topTriangleStackSx,
  smallTriangleSx,
  primaryTriangleSx,
  verticalFloatLineSx,
} from './faq-top-lines.styles';
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

describe('primaryTriangleSx', () => {
  it('keeps default icon size at a faint opacity', () => {
    expect(primaryTriangleSx).toMatchObject({
      position: 'static',
      opacity: 0.12,
    });
  });
});

describe('verticalFloatLineSx', () => {
  it('pins the vertical line flush with the top at the shared float-line offset', () => {
    expect(verticalFloatLineSx).toMatchObject({
      top: 0,
      left: FAQ_FLOAT_LINE_LEFT,
    });
  });
});
