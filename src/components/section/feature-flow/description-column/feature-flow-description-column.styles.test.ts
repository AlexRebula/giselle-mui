import { describe, expect, it } from 'vitest';

import {
  descriptionColumnRowListSx,
  descriptionColumnTitleSx,
} from './feature-flow-description-column.styles';

// ----------------------------------------------------------------------

describe('descriptionColumnTitleSx', () => {
  it('centers the title on mobile and left-aligns it from md up', () => {
    expect(descriptionColumnTitleSx).toMatchObject({
      textAlign: { xs: 'center', md: 'left' },
    });
  });
});

describe('descriptionColumnRowListSx', () => {
  it('caps the row-list width and centers it on mobile', () => {
    expect(descriptionColumnRowListSx).toMatchObject({
      maxWidth: { sm: 560, md: 400 },
      mx: { xs: 'auto', md: 'unset' },
    });
  });
});
