import { describe, expect, it } from 'vitest';

import { itemRowTextSlotSx } from './feature-flow-item-row.styles';

// ----------------------------------------------------------------------

describe('itemRowTextSlotSx', () => {
  it('takes remaining width and allows text truncation next to the leading icon', () => {
    expect(itemRowTextSlotSx).toMatchObject({
      flex: 1,
      minWidth: 0,
    });
  });
});
