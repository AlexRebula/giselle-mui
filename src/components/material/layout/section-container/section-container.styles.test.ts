// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { sectionContainerSx } from './section-container.styles';

// ----------------------------------------------------------------------

describe('sectionContainerSx', () => {
  it('forwards a single numeric py value', () => {
    expect(sectionContainerSx(10)).toMatchObject({ py: 10 });
  });

  it('forwards a responsive py object', () => {
    expect(sectionContainerSx({ xs: 8, md: 12 })).toMatchObject({
      py: { xs: 8, md: 12 },
    });
  });
});
