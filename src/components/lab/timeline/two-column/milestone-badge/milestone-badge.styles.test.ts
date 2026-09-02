// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  milestoneNewBadgeRowSx,
  milestoneNewDotSx,
  milestoneNewLabelSx,
  milestoneDateSx,
  milestoneTitleRowSx,
  milestoneTitleSx,
  milestoneEyeButtonSx,
  milestoneDescriptionSx,
  milestoneDetailRowSx,
  milestonePillTextSx,
  milestonePaperSx,
  pillIconBoxSx,
  milestoneDetailPillSx,
  milestoneDetailListSx,
  taskRowSx,
  taskToggleButtonSx,
  taskIconStaticSx,
  taskTitleSx,
  taskToggleColorSx,
  taskIconColorSx,
} from './milestone-badge.styles';

// ---------------------------------------------------------------------------
// milestoneNewBadgeRowSx
// ---------------------------------------------------------------------------

describe('milestoneNewBadgeRowSx — "New" indicator row', () => {
  it('right-aligns content when rightAlign=true', () => {
    const styles = milestoneNewBadgeRowSx(true) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-end');
  });

  it('omits justifyContent when rightAlign=false', () => {
    const styles = milestoneNewBadgeRowSx(false) as Record<string, unknown>;
    expect(styles['justifyContent']).toBeUndefined();
  });

  it('is a flex row with bottom margin', () => {
    const styles = milestoneNewBadgeRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('center');
    expect(styles['mb']).toBe(0.5);
  });
});

// ---------------------------------------------------------------------------
// milestoneNewDotSx
// ---------------------------------------------------------------------------

describe('milestoneNewDotSx — "New" status dot', () => {
  it('is circular and success-green', () => {
    const sx = milestoneNewDotSx as Record<string, unknown>;
    expect(sx['borderRadius']).toBe('50%');
    expect(sx['bgcolor']).toBe('success.main');
    expect(sx['flexShrink']).toBe(0);
  });

  it('[regression] dot meets 12px minimum readability size', () => {
    const sx = milestoneNewDotSx as Record<string, unknown>;
    expect(Number(sx['width'])).toBeGreaterThanOrEqual(12);
    expect(Number(sx['height'])).toBeGreaterThanOrEqual(12);
  });
});

// ---------------------------------------------------------------------------
// milestoneNewLabelSx
// ---------------------------------------------------------------------------

describe('milestoneNewLabelSx — "New" label text', () => {
  it('is small, bold, and success-green', () => {
    const sx = milestoneNewLabelSx as Record<string, unknown>;
    expect(sx['fontWeight']).toBe(700);
    expect(sx['color']).toBe('success.main');
    expect(sx['lineHeight']).toBe(1);
  });

  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    const sx = milestoneNewLabelSx as Record<string, unknown>;
    expect(sx['fontSize']).toBe('0.75rem');
  });
});

// ---------------------------------------------------------------------------
// milestoneDateSx
// ---------------------------------------------------------------------------

describe('milestoneDateSx — date label', () => {
  it('uses the provided fontSize', () => {
    const styles = milestoneDateSx('0.875rem') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.875rem');
  });

  it('defaults to 0.875rem (MILESTONE_DATE_FONT_SIZE)', () => {
    const styles = milestoneDateSx() as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.875rem');
  });

  it('[regression] minimum readable size is 0.875rem', () => {
    // 0.875rem matches body2 — below this, dates become hard to read.
    const styles = milestoneDateSx() as Record<string, unknown>;
    const rem = Number.parseFloat(String(styles['fontSize']));
    expect(rem).toBeGreaterThanOrEqual(0.875);
  });

  it('is displayed as a block with bottom margin', () => {
    const styles = milestoneDateSx() as Record<string, unknown>;
    expect(styles['display']).toBe('block');
    expect(styles['mb']).toBe(0.5);
  });
});

// ---------------------------------------------------------------------------
// milestoneTitleRowSx
// ---------------------------------------------------------------------------

describe('milestoneTitleRowSx — title row container', () => {
  it('right-aligns when rightAlign=true', () => {
    const styles = milestoneTitleRowSx(true) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-end');
  });

  it('left-aligns when rightAlign=false', () => {
    const styles = milestoneTitleRowSx(false) as Record<string, unknown>;
    expect(styles['justifyContent']).toBe('flex-start');
  });

  it('is a flex row with gap', () => {
    const styles = milestoneTitleRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('center');
    expect(styles['gap']).toBe(0.75);
  });
});

// ---------------------------------------------------------------------------
// milestoneTitleSx
// ---------------------------------------------------------------------------

describe('milestoneTitleSx — milestone title typography', () => {
  it('is bold with a tight line height', () => {
    expect(milestoneTitleSx).toMatchObject({
      fontWeight: 700,
      lineHeight: 1.3,
    });
  });
});

// ---------------------------------------------------------------------------
// milestoneEyeButtonSx
// ---------------------------------------------------------------------------

describe('milestoneEyeButtonSx — viewed eye button', () => {
  it('[regression] default minimum size is 28px (WCAG tap target)', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false }) as Record<string, unknown>;
    expect(Number(styles['minWidth'])).toBeGreaterThanOrEqual(28);
    expect(Number(styles['minHeight'])).toBeGreaterThanOrEqual(28);
  });

  it('uses provided minSize', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false, minSize: 32 }) as Record<
      string,
      unknown
    >;
    expect(styles['minWidth']).toBe(32);
  });

  it('is success color when isViewed=true', () => {
    const styles = milestoneEyeButtonSx({ isViewed: true }) as Record<string, unknown>;
    expect(styles['color']).toBe('success.main');
  });

  it('is text.secondary when isViewed=false', () => {
    const styles = milestoneEyeButtonSx({ isViewed: false }) as Record<string, unknown>;
    expect(styles['color']).toBe('text.secondary');
  });
});

// ---------------------------------------------------------------------------
// milestoneDetailRowSx
// ---------------------------------------------------------------------------

describe('milestoneDetailRowSx — individual bullet row', () => {
  it('is flex row with left-aligned text', () => {
    const sx = milestoneDetailRowSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['alignItems']).toBe('flex-start');
    expect(sx['textAlign']).toBe('left');
  });
});

// ---------------------------------------------------------------------------
// milestoneDescriptionSx
// ---------------------------------------------------------------------------

describe('milestoneDescriptionSx — expanded description text', () => {
  it('uses secondary text color with top margin', () => {
    expect(milestoneDescriptionSx).toMatchObject({
      color: 'text.secondary',
      mt: 0.5,
    });
  });
});

// ---------------------------------------------------------------------------
// milestonePillTextSx
// ---------------------------------------------------------------------------

describe('milestonePillTextSx — details-count pill label', () => {
  it('[regression] font size meets badge-label minimum of 0.75rem', () => {
    expect(milestonePillTextSx).toMatchObject({
      fontWeight: 600,
      lineHeight: 1,
      fontSize: '0.75rem',
    });
  });
});

describe('[regression] done milestone hover styles from milestonePaperSx', () => {
  const mockTheme = {
    vars: {
      palette: {
        primary: { main: '#2E7D32', mainChannel: '46 125 50' },
        grey: { '500Channel': '145 158 171' },
      },
    },
  } as unknown as Theme;

  it('done milestone uses dimmed base state and restores on hover', () => {
    const sxFactory = milestonePaperSx({
      isExpanded: false,
      colorKey: 'primary',
      rightAlign: false,
      done: true,
      hasDetails: true,
      suppressElevation: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const sx = sxFactory(mockTheme);

    expect(sx['opacity']).toBe(0.45);
    expect(sx['filter']).toBe('grayscale(1)');
    expect(sx['pointerEvents']).toBe('auto');

    const hover = sx['&:hover'] as Record<string, unknown>;
    expect(hover['opacity']).toBe(1);
    expect(hover['filter']).toBe('none');
  });

  it('not-done milestone does not set pointerEvents override', () => {
    const sxFactory = milestonePaperSx({
      isExpanded: false,
      colorKey: 'primary',
      rightAlign: false,
      done: false,
      hasDetails: true,
      suppressElevation: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const sx = sxFactory(mockTheme);
    expect(sx['pointerEvents']).toBeUndefined();
  });
});

describe('pillIconBoxSx — inline icon slot inside pill badges', () => {
  it('forces the inner svg to the exact requested icon size', () => {
    const styles = pillIconBoxSx(16) as Record<string, unknown>;
    expect(styles['& svg']).toEqual({ width: 16, height: 16 });
  });

  it('never shrinks inside its flex container', () => {
    const styles = pillIconBoxSx(16) as Record<string, unknown>;
    expect(styles['flexShrink']).toBe(0);
  });
});

describe('milestoneDetailPillSx — collapsed detail-count pill', () => {
  it('lays out icon and label inline with a rounded, muted background', () => {
    expect(milestoneDetailPillSx).toMatchObject({
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 0.75,
      bgcolor: 'action.hover',
      color: 'text.secondary',
    });
  });
});

describe('milestoneDetailListSx — expanded detail bullet list', () => {
  it('separates from the content above with a top border and stacks bullets vertically', () => {
    expect(milestoneDetailListSx).toMatchObject({
      borderTop: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
    });
  });
});

describe('taskRowSx — individual task bullet row', () => {
  it('lays out the toggle/icon and title side by side', () => {
    expect(taskRowSx).toMatchObject({
      display: 'flex',
      alignItems: 'center',
    });
  });
});

describe('taskToggleButtonSx — interactive task toggle button', () => {
  it('resets native button styling and shows a pointer cursor', () => {
    expect(taskToggleButtonSx).toMatchObject({
      all: 'unset',
      cursor: 'pointer',
    });
  });

  it('never shrinks inside its flex row', () => {
    expect(taskToggleButtonSx).toMatchObject({ flexShrink: 0 });
  });
});

describe('taskIconStaticSx — read-only task icon', () => {
  it('never shrinks inside its flex row', () => {
    expect(taskIconStaticSx).toMatchObject({ flexShrink: 0 });
  });
});

describe('taskTitleSx — task title typography', () => {
  it('strikes through and dims the title when done', () => {
    expect(taskTitleSx(true)).toMatchObject({
      color: 'text.disabled',
      textDecoration: 'line-through',
    });
  });

  it('uses secondary color with no strikethrough when not done', () => {
    expect(taskTitleSx(false)).toMatchObject({
      color: 'text.secondary',
      textDecoration: 'none',
    });
  });
});

describe('taskToggleColorSx — interactive task toggle color', () => {
  it('uses success color when done', () => {
    expect(taskToggleColorSx(true)).toMatchObject({ color: 'success.main' });
  });

  it('uses disabled color when not done', () => {
    expect(taskToggleColorSx(false)).toMatchObject({ color: 'text.disabled' });
  });
});

describe('taskIconColorSx — read-only task icon color', () => {
  it('uses success color when done', () => {
    expect(taskIconColorSx(true)).toMatchObject({ color: 'success.main' });
  });

  it('uses disabled color when not done', () => {
    expect(taskIconColorSx(false)).toMatchObject({ color: 'text.disabled' });
  });
});
