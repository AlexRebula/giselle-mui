// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  tooltipAlertListSx,
  tooltipAlertRowSx,
  tooltipAlertMessageSx,
  cornerBadgeCircleSx,
} from './card-corner-alert-badge.styles';

const mockTheme = {
  vars: {
    palette: {
      grey: { '900Channel': '33 43 54' },
    },
  },
} as unknown as Theme;

// ---------------------------------------------------------------------------
// tooltipAlertListSx — tooltip content column
// ---------------------------------------------------------------------------

describe('tooltipAlertListSx — tooltip alert list', () => {
  it('is a column flex with gap and padding', () => {
    const sx = tooltipAlertListSx as Record<string, unknown>;
    expect(sx['display']).toBe('flex');
    expect(sx['flexDirection']).toBe('column');
    expect(sx['gap']).toBe(1.25);
  });
});

describe('tooltipAlertRowSx — one alert row', () => {
  it('is a flex row with top-aligned icon and message', () => {
    expect(tooltipAlertRowSx).toMatchObject({
      display: 'flex',
      alignItems: 'flex-start',
      gap: 1,
    });
  });
});

describe('tooltipAlertMessageSx — alert message text', () => {
  it('uses a compact readable line height and weight', () => {
    expect(tooltipAlertMessageSx).toMatchObject({
      lineHeight: 1.55,
      fontSize: '0.8rem',
      fontWeight: 500,
    });
  });
});

// ---------------------------------------------------------------------------
// cornerBadgeCircleSx — corner alert badge circle (dynamic, theme callback)
// ---------------------------------------------------------------------------

describe('cornerBadgeCircleSx — corner alert badge', () => {
  it('positions absolutely with given transform', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: 'translate(50%, -50%)',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['position']).toBe('absolute');
    expect(styles['right']).toBe(0);
    expect(styles['transform']).toBe('translate(50%, -50%)');
  });

  it('applies error bg when hasError=true', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { left: 0 },
      transform: 'translate(-50%, -50%)',
      hasError: true,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    expect(sxFn(mockTheme)['bgcolor']).toBe('error.main');
  });

  it('applies warning bg when hasError=false', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: 'translate(50%, -50%)',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    expect(sxFn(mockTheme)['bgcolor']).toBe('warning.dark');
  });

  it('[regression] box-shadow uses theme grey-900 channel', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: '',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['boxShadow']).toContain('33 43 54');
  });

  it('defaults badge size to 26 (CORNER_ALERT_BADGE_SIZE)', () => {
    const sxFn = cornerBadgeCircleSx({
      positionOverride: { right: 0 },
      transform: '',
      hasError: false,
      hasClickHandler: false,
    }) as (theme: Theme) => Record<string, unknown>;
    const styles = sxFn(mockTheme);
    expect(styles['width']).toBe(26);
    expect(styles['height']).toBe(26);
  });
});
