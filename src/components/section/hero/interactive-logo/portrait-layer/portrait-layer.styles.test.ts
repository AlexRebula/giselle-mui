// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { portraitImageSx, portraitWrapperSx } from './portrait-layer.styles';

// ----------------------------------------------------------------------

describe('portraitWrapperSx', () => {
  it('is positioned absolute', () => {
    expect(portraitWrapperSx).toMatchObject({ position: 'absolute' });
  });

  it('has zIndex 3 (highest layer)', () => {
    expect(portraitWrapperSx).toMatchObject({ zIndex: 3 });
  });

  it('has pointerEvents none', () => {
    expect(portraitWrapperSx).toMatchObject({ pointerEvents: 'none' });
  });
});

describe('portraitImageSx', () => {
  it('uses objectFit contain', () => {
    expect(portraitImageSx).toMatchObject({ objectFit: 'contain' });
  });
});
