// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { phaseRowSx, phaseDotWrapperSx } from './phase-row.styles';

// ---------------------------------------------------------------------------
// phaseRowSx
// ---------------------------------------------------------------------------

describe('phaseRowSx — phase row', () => {
  it('is stretch-aligned flex row with transition', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['alignItems']).toBe('stretch');
    expect(String(styles['transition'])).toContain('filter');
  });

  it('has flex:1 to fill the li height', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['flex']).toBe(1);
  });

  it('applies blur when blurred=true', () => {
    const styles = phaseRowSx(true) as Record<string, unknown>;
    expect(styles['filter']).toBe('blur(1.5px)');
    expect(styles['opacity']).toBe(0.38);
    expect(styles['pointerEvents']).toBe('none');
  });

  it('does not apply blur when blurred=false', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['filter']).toBeUndefined();
    expect(styles['opacity']).toBeUndefined();
  });

  it('[regression] has minWidth:0 to prevent the phase row from overflowing its li', () => {
    const styles = phaseRowSx(false) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// phaseDotWrapperSx
// ---------------------------------------------------------------------------

describe('phaseDotWrapperSx — phase dot wrapper', () => {
  it('is relatively positioned inline-flex, so the floating date pill does not affect layout', () => {
    const sx = phaseDotWrapperSx as Record<string, unknown>;
    expect(sx['position']).toBe('relative');
    expect(sx['display']).toBe('inline-flex');
  });
});
