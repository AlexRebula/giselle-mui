// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { COMPACT_MILESTONE_DOT_SIZE, COMPACT_PHASE_DOT_SIZE } from '../compact.const';
import {
  checkHoverIconSx,
  milestoneDotSx,
  phaseDotSx,
  accordionSummaryOverrideSx,
} from './phase-accordion-row.styles';

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
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('phaseDotSx', () => {
  it('returns correct width and height from COMPACT_PHASE_DOT_SIZE', () => {
    const styles = (phaseDotSx('primary') as SxFn)(mockTheme);
    expect(styles.width).toBe(COMPACT_PHASE_DOT_SIZE);
    expect(styles.height).toBe(COMPACT_PHASE_DOT_SIZE);
  });

  it('uses theme.vars.palette when available', () => {
    const styles = (phaseDotSx('success') as SxFn)(mockTheme);
    expect(styles.bgcolor).toBe('var(--mui-palette-success-main)');
  });

  it('falls back to theme.palette when vars absent', () => {
    const themeNoVars = { palette: mockTheme.palette } as unknown as Theme;
    const styles = (phaseDotSx('warning') as SxFn)(themeNoVars);
    expect(styles.bgcolor).toBe('#F5A623');
  });

  it('returns borderRadius 50%', () => {
    const styles = (phaseDotSx('primary') as SxFn)(mockTheme);
    expect(styles.borderRadius).toBe('50%');
  });
});

// ----------------------------------------------------------------------

describe('milestoneDotSx', () => {
  it('returns correct width and height from COMPACT_MILESTONE_DOT_SIZE', () => {
    const styles = (milestoneDotSx('error') as SxFn)(mockTheme);
    expect(styles.width).toBe(COMPACT_MILESTONE_DOT_SIZE);
    expect(styles.height).toBe(COMPACT_MILESTONE_DOT_SIZE);
  });

  it('uses theme.vars.palette when available', () => {
    const styles = (milestoneDotSx('info') as SxFn)(mockTheme);
    expect(styles.bgcolor).toBe('var(--mui-palette-info-main)');
  });
});

// ----------------------------------------------------------------------

describe('accordionSummaryOverrideSx', () => {
  it('matches the compact row height on both the summary root and expanded state', () => {
    expect(accordionSummaryOverrideSx).toMatchObject({
      '& .MuiAccordionSummary-root': { minHeight: 56 },
      '& .MuiAccordionSummary-root.Mui-expanded': { minHeight: 56 },
    });
  });
});

describe('checkHoverIconSx', () => {
  it('uses the success color for the outlined check-circle icon', () => {
    expect(checkHoverIconSx(COMPACT_PHASE_DOT_SIZE)).toMatchObject({ color: 'success.main' });
  });

  it('sizes the icon glyph to the passed footprint', () => {
    expect(checkHoverIconSx(COMPACT_PHASE_DOT_SIZE)).toMatchObject({
      fontSize: COMPACT_PHASE_DOT_SIZE,
    });
    expect(checkHoverIconSx(COMPACT_MILESTONE_DOT_SIZE)).toMatchObject({
      fontSize: COMPACT_MILESTONE_DOT_SIZE,
    });
  });
});
