// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { artisticLogoSx } from './artistic-logo-layer.styles';

// ----------------------------------------------------------------------

describe('artisticLogoSx', () => {
  it('is positioned absolute', () => {
    expect(artisticLogoSx).toMatchObject({ position: 'absolute' });
  });

  it('has zIndex 2', () => {
    expect(artisticLogoSx).toMatchObject({ zIndex: 2 });
  });

  it('has pointerEvents none', () => {
    expect(artisticLogoSx).toMatchObject({ pointerEvents: 'none' });
  });
});
