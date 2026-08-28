// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';

import { renderWithTheme } from '../../../../../test-utils';
import { FaqBottomLines } from './faq-bottom-lines';
import { FAQ_PLUS_ICON_LEFT } from './faq-bottom-lines.const';

// ----------------------------------------------------------------------

describe('FaqBottomLines', () => {
  it('has a displayName', () => {
    expect(FaqBottomLines.displayName).toBe('FaqBottomLines');
  });

  it('renders two float lines and two plus icons', () => {
    const html = renderWithTheme(createElement(FaqBottomLines));
    expect(html.match(/<svg/g)).toHaveLength(4);
  });

  it('[regression] FAQ_PLUS_ICON_LEFT is a positive number', () => {
    expect(FAQ_PLUS_ICON_LEFT).toBeGreaterThan(0);
  });
});
