// @vitest-environment jsdom
import React from 'react';
import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { ChevronDownIcon } from './chevron-down-icon';

describe('ChevronDownIcon', () => {
  it('renders a decorative svg marked aria-hidden', () => {
    const html = renderToStaticMarkup(React.createElement(ChevronDownIcon));

    expect(html).toContain('<svg');
    expect(html).toContain('aria-hidden="true"');
  });
});
