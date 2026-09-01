// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';

import type { Theme } from '@mui/material/styles';

import { rootBoxSx, innerContainerSx, logoStack3dWrapperSx } from './interactive-logo.styles';

// ----------------------------------------------------------------------

const mockTheme = {} as unknown as Theme;

/**
 * Helper: call an SxProps factory with the mock theme to get a plain object.
 */
function callSx(sx: unknown): Record<string, unknown> {
  return typeof sx === 'function'
    ? (sx as (t: Theme) => Record<string, unknown>)(mockTheme)
    : (sx as Record<string, unknown>);
}

// ----------------------------------------------------------------------

describe('rootBoxSx', () => {
  it('sets perspective to 1200', () => {
    const styles = callSx(rootBoxSx('grab'));
    expect(styles.perspective).toBe(1200);
  });

  it('forwards the cursor value', () => {
    expect(callSx(rootBoxSx('grab')).cursor).toBe('grab');
    expect(callSx(rootBoxSx('grabbing')).cursor).toBe('grabbing');
    expect(callSx(rootBoxSx('default')).cursor).toBe('default');
  });

  it('sets overflow to visible', () => {
    expect(callSx(rootBoxSx('grab')).overflow).toBe('visible');
  });
});

describe('innerContainerSx', () => {
  it('has position relative', () => {
    expect(callSx(innerContainerSx).position).toBe('relative');
  });

  it('uses preserve-3d transformStyle', () => {
    expect(callSx(innerContainerSx).transformStyle).toBe('preserve-3d');
  });
});

describe('logoStack3dWrapperSx', () => {
  it('has position relative', () => {
    expect(callSx(logoStack3dWrapperSx).position).toBe('relative');
  });
});
