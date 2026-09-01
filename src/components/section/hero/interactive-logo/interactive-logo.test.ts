// @vitest-environment jsdom
import { it, expect, describe } from 'vitest';

import {
  getCursorStyle,
  getRandomPortraitSrc,
  buildPortraitSourceMap,
  getPortraitDirectionFromAngle,
} from './interactive-logo.utils';

// ----------------------------------------------------------------------
// getRandomPortraitSrc

describe('getRandomPortraitSrc', () => {
  it('returns a string value unchanged', () => {
    expect(getRandomPortraitSrc('foo')).toBe('foo');
  });

  it('returns the single element of a one-item array', () => {
    expect(getRandomPortraitSrc(['bar'])).toBe('bar');
  });

  it('returns a member of a multi-element array', () => {
    const variants = ['a', 'b', 'c'] as const;
    expect(variants).toContain(getRandomPortraitSrc(variants));
  });

  it('returns empty string for an empty array', () => {
    expect(getRandomPortraitSrc([])).toBe('');
  });
});

// ----------------------------------------------------------------------
// getPortraitDirectionFromAngle

describe('getPortraitDirectionFromAngle', () => {
  it('returns right for 0°', () => {
    expect(getPortraitDirectionFromAngle(0)).toBe('right');
  });

  it('returns down for 90°', () => {
    expect(getPortraitDirectionFromAngle(90)).toBe('down');
  });

  it('returns left for 180°', () => {
    expect(getPortraitDirectionFromAngle(180)).toBe('left');
  });

  it('returns left for −180°', () => {
    expect(getPortraitDirectionFromAngle(-180)).toBe('left');
  });

  it('returns up for −90°', () => {
    expect(getPortraitDirectionFromAngle(-90)).toBe('up');
  });

  it('returns down-right for 45°', () => {
    expect(getPortraitDirectionFromAngle(45)).toBe('down-right');
  });

  it('returns down-left for 135°', () => {
    expect(getPortraitDirectionFromAngle(135)).toBe('down-left');
  });

  it('returns up-right for −45°', () => {
    expect(getPortraitDirectionFromAngle(-45)).toBe('up-right');
  });

  it('returns up-left for −135°', () => {
    expect(getPortraitDirectionFromAngle(-135)).toBe('up-left');
  });

  it('[boundary] > 157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(158)).toBe('left');
  });

  it('[boundary] > −157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(-158)).toBe('left');
  });

  it('[boundary] exactly −157.5 classifies as left', () => {
    expect(getPortraitDirectionFromAngle(-157.5)).toBe('left');
  });
});

// ----------------------------------------------------------------------
// buildPortraitSourceMap

describe('buildPortraitSourceMap', () => {
  it('maps portraitSrc to the forward direction', () => {
    expect(buildPortraitSourceMap('face.jpg')).toEqual({ forward: 'face.jpg' });
  });

  it('maps portraitSources entries by direction', () => {
    expect(buildPortraitSourceMap(undefined, [{ direction: 'left', src: 'left.jpg' }])).toEqual({
      left: 'left.jpg',
    });
  });

  it('merges portraitSrc and portraitSources', () => {
    expect(buildPortraitSourceMap('face.jpg', [{ direction: 'right', src: 'right.jpg' }])).toEqual({
      forward: 'face.jpg',
      right: 'right.jpg',
    });
  });

  it('returns an empty map when neither argument is provided', () => {
    expect(buildPortraitSourceMap()).toEqual({});
  });

  it('skips portraitSources entries with an empty string src', () => {
    expect(buildPortraitSourceMap(undefined, [{ direction: 'up', src: '' }])).toEqual({});
  });
});

// ----------------------------------------------------------------------
// getCursorStyle

describe('getCursorStyle', () => {
  it('returns default when reducedMotion is true', () => {
    expect(getCursorStyle(true, false)).toBe('default');
  });

  it('returns default when reducedMotion is true even if pointer is down', () => {
    expect(getCursorStyle(true, true)).toBe('default');
  });

  it('returns grabbing when pointer is down and motion is not reduced', () => {
    expect(getCursorStyle(false, true)).toBe('grabbing');
  });

  it('returns grab when motion is not reduced and pointer is not down', () => {
    expect(getCursorStyle(false, false)).toBe('grab');
  });

  it('returns grab when reducedMotion is null (not yet determined)', () => {
    expect(getCursorStyle(null, false)).toBe('grab');
  });

  it('returns grabbing when reducedMotion is null and pointer is down', () => {
    expect(getCursorStyle(null, true)).toBe('grabbing');
  });
});
