// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  avatarSx,
  profileSummaryCardPaperSx,
  roleSx,
  statCellSlotSx,
  statsRowSlotSx,
} from './profile-summary-card.styles';

// ----------------------------------------------------------------------

describe('profileSummaryCardPaperSx', () => {
  it('centres and pads the root card', () => {
    expect(profileSummaryCardPaperSx).toMatchObject({ p: 3, textAlign: 'center' });
  });
});

describe('avatarSx', () => {
  it('is centred above the name with a fixed 64px footprint', () => {
    expect(avatarSx).toMatchObject({ width: 64, height: 64, mx: 'auto' });
  });
});

describe('roleSx', () => {
  it('adds spacing below the role label before the stats row', () => {
    expect(roleSx).toMatchObject({ mb: 2 });
  });
});

describe('statsRowSlotSx', () => {
  it('centres the stat cells in a horizontal row', () => {
    expect(statsRowSlotSx).toMatchObject({ display: 'flex', justifyContent: 'center' });
  });
});

describe('statCellSlotSx', () => {
  it('adds horizontal padding around each stat cell', () => {
    expect(statCellSlotSx).toMatchObject({ px: 2 });
  });
});
