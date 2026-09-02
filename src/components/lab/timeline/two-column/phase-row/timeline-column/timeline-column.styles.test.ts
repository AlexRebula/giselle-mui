// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';

import { timelineColumnSx } from './timeline-column.styles';

describe('timelineColumnSx — column layout', () => {
  it('left column: right text-align, right padding', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    expect(styles['textAlign']).toBe('right');
    expect(styles['pr']).toBe(2);
    expect(styles['pl']).toBe(0);
  });

  it('right column: left text-align, left padding', () => {
    const styles = timelineColumnSx('right', true, 40) as Record<string, unknown>;
    expect(styles['textAlign']).toBe('left');
    expect(styles['pl']).toBe(2);
    expect(styles['pr']).toBe(0);
  });

  it('applies paddingBottom from the argument', () => {
    const styles = timelineColumnSx('left', true, 48) as Record<string, unknown>;
    expect(styles['paddingBottom']).toBe('48px');
  });

  it('[regression] left column always hidden on xs (cards move to right slot on mobile)', () => {
    const styles = timelineColumnSx('left', false, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('[regression] left column hidden on xs even when hasContent=true', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('none');
    expect(display['md']).toBe('block');
  });

  it('shows on xs when hasContent=true', () => {
    const styles = timelineColumnSx('right', true, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
  });

  it('[regression] right column always visible on xs even when hasContent=false (receives all cards on mobile)', () => {
    const styles = timelineColumnSx('right', false, 40) as Record<string, unknown>;
    const display = styles['display'] as { xs: string; md: string };
    expect(display['xs']).toBe('block');
    // Empty column must stay display:block on md — hiding it removes the column from
    // the flex row and shifts the centre spine off-centre.
    expect(display['md']).toBe('block');
  });

  it('[regression] has minWidth:0 so the flex child can shrink at narrow widths', () => {
    const styles = timelineColumnSx('left', true, 40) as Record<string, unknown>;
    expect(styles['minWidth']).toBe(0);
  });
});
