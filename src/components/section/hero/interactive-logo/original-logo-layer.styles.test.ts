// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { activeFrameImageSx } from './original-logo-layer.styles';

// ----------------------------------------------------------------------

describe('activeFrameImageSx', () => {
  it('fills the parent layer box exactly', () => {
    expect(activeFrameImageSx).toMatchObject({
      width: 1,
      height: 1,
    });
  });
});
