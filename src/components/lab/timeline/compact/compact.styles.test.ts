// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { COMPACT_MILESTONE_DOT_SIZE, COMPACT_PHASE_DOT_SIZE } from './compact.const';
import { accordionRootSx } from './compact.styles';

// Narrow type used to call theme-function sx values in tests.
type SxFn = (theme: Theme) => Record<string, unknown>;

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      primary: { main: 'var(--mui-palette-primary-main)', mainChannel: '46 125 50' },
      success: { main: 'var(--mui-palette-success-main)', mainChannel: '46 125 50' },
      warning: { main: 'var(--mui-palette-warning-main)', mainChannel: '245 166 35' },
      error: { main: 'var(--mui-palette-error-main)', mainChannel: '211 47 47' },
      secondary: { main: 'var(--mui-palette-secondary-main)', mainChannel: '245 166 35' },
      info: { main: 'var(--mui-palette-info-main)', mainChannel: '2 136 209' },
      grey: { '500Channel': '145 158 171' },
    },
  },
  palette: {
    primary: { main: '#2E7D32' },
    success: { main: '#2E7D32' },
    warning: { main: '#F5A623' },
    error: { main: '#d32f2f' },
    secondary: { main: '#F5A623' },
    info: { main: '#0288d1' },
  },
  transitions: {
    create: () => 'opacity 200ms, background-color 200ms',
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('accordionRootSx', () => {
  it('returns opacity 0.65 when done=true', () => {
    const styles = (accordionRootSx(true) as SxFn)(mockTheme);
    expect(styles['opacity']).toBe(0.65);
  });

  it('returns opacity 1 when done=false', () => {
    const styles = (accordionRootSx(false) as SxFn)(mockTheme);
    expect(styles['opacity']).toBe(1);
  });

  it('has no border (FAQ-style)', () => {
    const styles = (accordionRootSx(false) as SxFn)(mockTheme);
    expect(styles['border']).toBe('none');
  });

  it('sets boxShadow to none', () => {
    const styles = (accordionRootSx(false) as SxFn)(mockTheme);
    expect(styles['boxShadow']).toBe('none');
  });

  it('uses a color-tinted background for active rows', () => {
    const styles = (accordionRootSx(false, true, true, 'warning') as SxFn)(mockTheme);
    expect(styles['backgroundColor']).toBe('rgba(245, 166, 35, 0.12)');
    expect(styles['border']).toBe('1px solid rgba(245, 166, 35, 0.24)');
  });

  it('keeps non-expanded active rows uncolored', () => {
    const styles = (accordionRootSx(false, true, false, 'warning') as SxFn)(mockTheme);
    expect(styles['backgroundColor']).toBe('transparent');
    expect(styles['border']).toBe('none');
  });
});

// ----------------------------------------------------------------------

describe('readability — minimum dot size constants (regression)', () => {
  it('[regression] COMPACT_PHASE_DOT_SIZE >= 12px', () => {
    expect(COMPACT_PHASE_DOT_SIZE).toBeGreaterThanOrEqual(12);
  });

  it('[regression] COMPACT_MILESTONE_DOT_SIZE >= 18px', () => {
    expect(COMPACT_MILESTONE_DOT_SIZE).toBeGreaterThanOrEqual(18);
  });
});
