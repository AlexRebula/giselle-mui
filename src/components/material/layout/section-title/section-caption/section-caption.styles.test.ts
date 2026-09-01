// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import { sectionCaptionSx } from './section-caption.styles';

// ----------------------------------------------------------------------

describe('sectionCaptionSx', () => {
  it('uses the overline typography variant', () => {
    expect(sectionCaptionSx).toMatchObject({ typography: 'overline' });
  });

  it('uses the disabled text color', () => {
    expect(sectionCaptionSx).toMatchObject({ color: 'text.disabled' });
  });
});
