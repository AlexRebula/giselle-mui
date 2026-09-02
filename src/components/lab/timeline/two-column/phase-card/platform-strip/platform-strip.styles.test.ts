// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { platformStripItemSlotSx, platformStripItemLabelSx } from './platform-strip.styles';

describe('platformStripItemSlotSx — one platform item slot', () => {
  it('centers its icon or fallback label', () => {
    expect(platformStripItemSlotSx).toMatchObject({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });
});

describe('platformStripItemLabelSx — fallback text label', () => {
  it('uses a small, tightly-padded label style', () => {
    expect(platformStripItemLabelSx).toMatchObject({
      fontSize: 11,
      px: 0.5,
    });
  });
});
