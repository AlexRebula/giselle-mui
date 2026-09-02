// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { msRowSx, msColumnBoxSx, msDotWrapperSx, msCardWrapperSx } from './milestone-row.styles';

// ---------------------------------------------------------------------------
// msRowSx
// ---------------------------------------------------------------------------

describe('msRowSx — milestone row wrapper', () => {
  it('positions absolutely at the given percentage', () => {
    const styles = msRowSx(25) as Record<string, unknown>;
    expect(styles['position']).toBe('absolute');
    expect(styles['top']).toBe('25%');
    expect(styles['left']).toBe(0);
    expect(styles['right']).toBe(0);
  });

  it('is a horizontal flex row', () => {
    const styles = msRowSx(50) as Record<string, unknown>;
    expect(styles['display']).toBe('flex');
    expect(styles['flexDirection']).toBe('row');
  });
});

// ---------------------------------------------------------------------------
// msColumnBoxSx
// ---------------------------------------------------------------------------

describe('msColumnBoxSx — milestone column box', () => {
  it('[regression] right column always visible on xs (receives all milestone cards on mobile)', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    expect(display['md']).toBe('block');
  });

  it('[regression] right column visible on xs even when visible=false', () => {
    const styles = msColumnBoxSx('right', false) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    // Column must stay display:block on md even when no content — keeps spine centred.
    expect(display['md']).toBe('block');
  });

  it('[regression] left column always hidden on xs (milestone cards shift to right slot on mobile)', () => {
    const styles = msColumnBoxSx('left', true) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('is relatively positioned with overflow:visible', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    expect(styles['position']).toBe('relative');
    expect(styles['overflow']).toBe('visible');
    expect(styles['flex']).toBe(1);
  });

  it('[regression] has minWidth:0 so the milestone column can shrink at narrow widths', () => {
    const styles = msColumnBoxSx('right', true) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// msDotWrapperSx
// ---------------------------------------------------------------------------

describe('msDotWrapperSx — milestone dot blur wrapper', () => {
  it('has transition defined (not blurred)', () => {
    const styles = msDotWrapperSx(false) as Record<string, unknown>;
    expect(String(styles['transition'])).toContain('filter');
    expect(styles['filter']).toBeUndefined();
  });

  it('applies blur and dim when blurred=true', () => {
    const styles = msDotWrapperSx(true) as Record<string, unknown>;
    expect(styles['filter']).toBe('blur(1.5px)');
    expect(styles['opacity']).toBe(0.38);
    expect(styles['pointerEvents']).toBe('none');
  });

  it('is inline-flex positioned relatively', () => {
    const styles = msDotWrapperSx(false) as Record<string, unknown>;
    expect(styles['display']).toBe('inline-flex');
    expect(styles['position']).toBe('relative');
  });
});

// ---------------------------------------------------------------------------
// msCardWrapperSx
// ---------------------------------------------------------------------------

// `msCardWrapperSx` returns a theme-callback `SxProps<Theme>` — cast the factory to a
// concrete callable signature so tests can invoke it with a minimal mock theme.
type SxThemeFactory = (theme: { spacing: (n: number) => string }) => Record<string, unknown>;
const callMsCardWrapperSx = msCardWrapperSx as unknown as (
  ...args: Parameters<typeof msCardWrapperSx>
) => SxThemeFactory;
const mockTheme = { spacing: (n: number) => `${n * 8}px` };

describe('msCardWrapperSx — milestone card wrapper', () => {
  it('raises z-index when expanded', () => {
    const styles = callMsCardWrapperSx(true, false, 'left')(mockTheme);
    expect(styles['zIndex']).toBe(1000);
  });

  it('keeps a low z-index when not expanded', () => {
    const styles = callMsCardWrapperSx(false, false, 'left')(mockTheme);
    expect(styles['zIndex']).toBe(1);
  });

  it('applies blur, dim, and translate when suppressElevation=true', () => {
    const styles = callMsCardWrapperSx(false, true, 'left')(mockTheme);
    expect(styles['filter']).toBe('blur(1.5px)');
    expect(styles['opacity']).toBe(0.38);
    expect(styles['transform']).toBe('scale(0.97) translateY(-50%)');
  });

  it('insets from the right edge when side="left"', () => {
    const styles = callMsCardWrapperSx(false, false, 'left')(mockTheme);
    expect(styles['left']).toBe(0);
    expect(styles['right']).toBe('16px');
  });

  it('insets from the left edge when side="right"', () => {
    const styles = callMsCardWrapperSx(false, false, 'right')(mockTheme);
    expect(styles['left']).toBe('16px');
    expect(styles['right']).toBe(0);
  });
});
