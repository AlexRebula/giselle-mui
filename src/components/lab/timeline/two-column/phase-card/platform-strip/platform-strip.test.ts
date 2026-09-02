// @vitest-environment jsdom

import * as React from 'react';
import { it, expect, describe } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';

import { buildPlatformStripItems } from './platform-strip';

// ---------------------------------------------------------------------------

describe('buildPlatformStripItems — { icon, label } platform (icon slot)', () => {
  it('icon node renders and suppresses the fallback text label', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon', alt: 'PHP' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    // The icon element is rendered
    expect(html).toContain('data-testid="php-icon"');
    // The label is NOT rendered as a text span when an icon is provided
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });

  it('{ icon, label } never renders label as inner text when icon is provided', () => {
    const iconEl = React.createElement('svg', { 'data-testid': 'ts-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'TypeScript' }]);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="ts-icon"');
    expect(html).not.toMatch(/<span[^>]*>TypeScript<\/span>/);
  });
});

describe('buildPlatformStripItems — mixed string and object platforms', () => {
  it('icon items and string items can coexist in one array', () => {
    const iconEl = React.createElement('img', { 'data-testid': 'php-icon' });
    const nodes = buildPlatformStripItems([{ icon: iconEl, label: 'PHP' }, 'Smarty', 'jQuery']);
    const html = renderToStaticMarkup(React.createElement(React.Fragment, null, ...nodes));
    expect(html).toContain('data-testid="php-icon"');
    expect(html).toContain('>Smarty<');
    expect(html).toContain('>jQuery<');
    // PHP label must NOT appear as inner text (it has an icon)
    expect(html).not.toMatch(/<span[^>]*>PHP<\/span>/);
  });
});
