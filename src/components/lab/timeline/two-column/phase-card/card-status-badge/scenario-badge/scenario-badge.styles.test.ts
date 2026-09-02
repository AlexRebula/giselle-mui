// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { scenarioBadgeSx } from './scenario-badge.styles';

// ---------------------------------------------------------------------------
// scenarioBadgeSx — scenario pill badge
// ---------------------------------------------------------------------------

describe('scenarioBadgeSx — scenario pill badge', () => {
  it('[regression] font size is at least 0.75rem (badge minimum)', () => {
    const styles = scenarioBadgeSx('info') as Record<string, unknown>;
    expect(styles['fontSize']).toBe('0.75rem');
  });

  it('uses dark variant of the color for text', () => {
    const styles = scenarioBadgeSx('warning') as Record<string, unknown>;
    expect(styles['color']).toBe('warning.dark');
  });

  it('uses CSS var channel for soft background tint', () => {
    const styles = scenarioBadgeSx('success') as Record<string, unknown>;
    expect(String(styles['bgcolor'])).toContain('--mui-palette-success-mainChannel');
  });
});
