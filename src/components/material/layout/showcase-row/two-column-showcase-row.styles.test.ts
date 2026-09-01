// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  controlsGridItemSx,
  controlsSlotSx,
  controlsStackSx,
  overlineSx,
  showcaseRowRootSx,
  textColumnSx,
} from './two-column-showcase-row.styles';

// ----------------------------------------------------------------------

describe('showcaseRowRootSx', () => {
  it('always stacks at xs regardless of orientation', () => {
    expect(showcaseRowRootSx('row-reverse')).toMatchObject({
      flexDirection: { xs: 'column', md: 'row-reverse' },
    });
  });

  it('mirrors orientation into the md breakpoint', () => {
    expect(showcaseRowRootSx('column')).toMatchObject({
      flexDirection: { xs: 'column', md: 'column' },
    });
  });
});

describe('textColumnSx', () => {
  it('caps width at a comfortable reading length', () => {
    expect(textColumnSx).toMatchObject({ maxWidth: 520 });
  });
});

describe('overlineSx', () => {
  it('mutes the overline label colour', () => {
    expect(overlineSx).toMatchObject({ color: 'text.secondary' });
  });
});

describe('controlsGridItemSx', () => {
  it('allows the controls column to shrink below intrinsic width', () => {
    expect(controlsGridItemSx).toMatchObject({ minWidth: 0 });
  });
});

describe('controlsStackSx', () => {
  it('forwards the controlsAlign value and fills the column width', () => {
    expect(controlsStackSx('center')).toMatchObject({
      alignItems: 'center',
      width: 1,
      minWidth: 0,
    });
  });

  it('forwards a different alignment value', () => {
    expect(controlsStackSx('flex-end')).toMatchObject({ alignItems: 'flex-end' });
  });
});

describe('controlsSlotSx', () => {
  it('fills the width and allows shrinking', () => {
    expect(controlsSlotSx).toMatchObject({ width: 1, minWidth: 0 });
  });
});
