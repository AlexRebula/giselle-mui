// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { resolveStepColor } from './roadmap-timeline.utils';

describe('resolveStepColor', () => {
  it('returns success when done=true, regardless of color', () => {
    expect(resolveStepColor({ color: 'error', done: true })).toBe('success');
    expect(resolveStepColor({ color: undefined, done: true })).toBe('success');
  });

  it('returns the step color when not done', () => {
    expect(resolveStepColor({ color: 'warning', done: false })).toBe('warning');
  });

  it('defaults to primary when not done and no color is set', () => {
    expect(resolveStepColor({ color: undefined, done: false })).toBe('primary');
    expect(resolveStepColor({ color: undefined, done: undefined })).toBe('primary');
  });
});
