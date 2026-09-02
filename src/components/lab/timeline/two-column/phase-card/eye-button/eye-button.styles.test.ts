// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { eyeButtonSx } from './eye-button.styles';

// ---------------------------------------------------------------------------
// eyeButtonSx — viewed eye button (dynamic)
// ---------------------------------------------------------------------------

describe('eyeButtonSx — viewed eye button', () => {
  it('positions right when columnSide=right', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['right']).toBe(0);
    expect(styles['left']).toBeUndefined();
  });

  it('positions left when columnSide=left', () => {
    const styles = eyeButtonSx({ columnSide: 'left', isViewed: false }) as Record<string, unknown>;
    expect(styles['left']).toBe(0);
    expect(styles['right']).toBeUndefined();
  });

  it('defaults minWidth/minHeight to 28 (EYE_BUTTON_MIN_SIZE)', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(28);
    expect(styles['minHeight']).toBe(28);
  });

  it('[regression] minimum button size is 28px (WCAG tap target)', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(Number(styles['minWidth'])).toBeGreaterThanOrEqual(28);
    expect(Number(styles['minHeight'])).toBeGreaterThanOrEqual(28);
  });

  it('uses success color when isViewed=true', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: true }) as Record<string, unknown>;
    expect(styles['color']).toBe('success.main');
  });

  it('uses text.secondary when isViewed=false', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['color']).toBe('text.secondary');
  });

  it('is absolutely positioned', () => {
    const styles = eyeButtonSx({ columnSide: 'right', isViewed: false }) as Record<string, unknown>;
    expect(styles['position']).toBe('absolute');
    expect(styles['bottom']).toBe(0);
  });
});
