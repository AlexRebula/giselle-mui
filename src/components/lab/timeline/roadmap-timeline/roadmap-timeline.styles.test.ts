// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import {
  scenarioBadgeSx,
  stepContentSx,
  stepDateSx,
  stepDescriptionSx,
  stepDetailItemSx,
  stepDetailListSx,
  stepOpacitySx,
  stepTitleRowSx,
  stepTitleSx,
} from './roadmap-timeline.styles';

// ----------------------------------------------------------------------

describe('stepTitleRowSx', () => {
  it('lays out title and scenario badge inline', () => {
    expect(stepTitleRowSx).toMatchObject({ display: 'flex', alignItems: 'center' });
  });
});

describe('stepTitleSx', () => {
  it('uses a semi-bold weight', () => {
    expect(stepTitleSx).toMatchObject({ fontWeight: 600 });
  });
});

describe('stepDateSx', () => {
  it('uses secondary text color', () => {
    expect(stepDateSx).toMatchObject({ color: 'text.secondary' });
  });
});

describe('stepDescriptionSx', () => {
  it('uses secondary text color with top margin', () => {
    expect(stepDescriptionSx).toMatchObject({ color: 'text.secondary', mt: 0.5 });
  });
});

describe('stepDetailListSx', () => {
  it('renders as an indented, unstyled list', () => {
    expect(stepDetailListSx).toMatchObject({ m: 0, pl: 2.5 });
  });
});

describe('stepDetailItemSx', () => {
  it('mutes the list bullet marker color', () => {
    expect(stepDetailItemSx).toMatchObject({ '&::marker': { color: 'text.disabled' } });
  });
});

describe('stepContentSx', () => {
  it('returns a plain padded box for a regular step', () => {
    const styles = stepContentSx(false) as Record<string, unknown>;
    expect(styles['border']).toBeUndefined();
    expect(styles['py']).toBe(1.5);
  });

  it('returns a dashed-border, tinted card for a scenario step', () => {
    const styles = stepContentSx(true) as Record<string, unknown>;
    expect(styles['border']).toBe('1px dashed');
    expect(styles['bgcolor']).toContain('rgba(');
  });
});

describe('scenarioBadgeSx', () => {
  it('renders as an uppercase, bordered pill', () => {
    expect(scenarioBadgeSx).toMatchObject({ textTransform: 'uppercase', borderRadius: 0.75 });
  });
});

describe('stepOpacitySx', () => {
  it('fades done steps', () => {
    expect(stepOpacitySx(true)).toEqual({ opacity: 0.72 });
  });

  it('keeps not-done steps fully opaque', () => {
    expect(stepOpacitySx(false)).toEqual({ opacity: 1 });
  });
});
