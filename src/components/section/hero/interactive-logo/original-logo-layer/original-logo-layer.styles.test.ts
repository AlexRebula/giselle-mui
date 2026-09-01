// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { activeFrameImageSx, originalLayerSx } from './original-logo-layer.styles';

// ----------------------------------------------------------------------

describe('originalLayerSx', () => {
  it('has zIndex 1', () => {
    expect(originalLayerSx).toMatchObject({ zIndex: 1 });
  });

  it('occupies full width and height', () => {
    expect(originalLayerSx).toMatchObject({ width: 1, height: 1 });
  });
});

describe('activeFrameImageSx', () => {
  it('fills the parent layer box exactly', () => {
    expect(activeFrameImageSx).toMatchObject({
      width: 1,
      height: 1,
    });
  });
});
