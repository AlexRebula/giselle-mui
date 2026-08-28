// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';

import { renderWithTheme } from '../../../../../test-utils';
import { FaqTopLines } from './faq-top-lines';
import { FAQ_FLOAT_LINE_LEFT } from './faq-top-lines.const';

// ----------------------------------------------------------------------

describe('FaqTopLines', () => {
  it('has a displayName', () => {
    expect(FaqTopLines.displayName).toBe('FaqTopLines');
  });

  it('renders two stacked triangles and one vertical float line', () => {
    const html = renderWithTheme(createElement(FaqTopLines));
    expect(html.match(/<svg/g)).toHaveLength(3);
  });

  it('[regression] FAQ_FLOAT_LINE_LEFT is a positive number', () => {
    expect(FAQ_FLOAT_LINE_LEFT).toBeGreaterThan(0);
  });
});
