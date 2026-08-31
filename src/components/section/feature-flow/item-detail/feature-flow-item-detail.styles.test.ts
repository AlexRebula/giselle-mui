import { describe, expect, it } from 'vitest';

import {
  itemDetailHeaderIconSx,
  itemDetailHeaderSlotSx,
  itemDetailLongDescriptionSx,
  itemDetailMetricsGridSx,
} from './feature-flow-item-detail.styles';

// ----------------------------------------------------------------------

describe('itemDetailHeaderSlotSx', () => {
  it('centers the icon and title on the same row', () => {
    expect(itemDetailHeaderSlotSx).toMatchObject({ alignItems: 'center' });
  });
});

describe('itemDetailHeaderIconSx', () => {
  it('tints the header icon with the primary palette colour', () => {
    expect(itemDetailHeaderIconSx).toMatchObject({ color: 'primary.main' });
  });
});

describe('itemDetailMetricsGridSx', () => {
  it('caps the sm+ column count at the metrics count when below 3', () => {
    expect(itemDetailMetricsGridSx(2)).toMatchObject({
      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
    });
  });

  it('caps the sm+ column count at 3 when there are more than 3 metrics', () => {
    expect(itemDetailMetricsGridSx(5)).toMatchObject({
      gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' },
    });
  });
});

describe('itemDetailLongDescriptionSx', () => {
  it('uses secondary text colour and relaxed line height', () => {
    expect(itemDetailLongDescriptionSx).toMatchObject({
      color: 'text.secondary',
      lineHeight: 1.8,
    });
  });
});
