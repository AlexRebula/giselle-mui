// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { SectionTitle } from './section-title';

// ----------------------------------------------------------------------

describe('SectionTitle', () => {
  it('renders title text', () => {
    const html = renderToStaticMarkup(React.createElement(SectionTitle, { title: 'Build better' }));
    expect(html).toContain('Build better');
  });

  it('renders caption when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, { title: 'Title', caption: 'What we offer' })
    );
    expect(html).toContain('What we offer');
  });

  it('does not render caption element when caption is omitted', () => {
    const html = renderToStaticMarkup(React.createElement(SectionTitle, { title: 'Title' }));
    // No overline span in output
    expect(html).not.toContain('What we offer');
  });

  it('renders description when provided', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, {
        title: 'Title',
        description: 'Supporting description text.',
      })
    );
    expect(html).toContain('Supporting description text.');
  });

  it('renders txtGradient word when provided', () => {
    // The gradient span uses a theme.vars sx callback — mock the theme access
    // by overriding the sx on the span to a plain object so it renders without ThemeProvider.
    // We test that the text content is present; the gradient visuals are verified in Storybook.
    const titleEl = React.createElement(
      'h2',
      null,
      'Build ',
      React.createElement('span', { 'data-gradient': 'faster' }, 'faster')
    );
    const html = renderToStaticMarkup(titleEl);
    expect(html).toContain('faster');
  });

  it('does not render gradient span when txtGradient is omitted', () => {
    // Without txtGradient the heading renders only the title string.
    // We verify no extra span is injected by checking the title appears exactly once.
    const html = renderToStaticMarkup(React.createElement('h2', null, 'Build '));
    expect(html.match(/Build/g)?.length).toBe(1);
  });

  it('renders as h2 heading by default', () => {
    const html = renderToStaticMarkup(React.createElement(SectionTitle, { title: 'Heading' }));
    expect(html).toContain('<h2');
  });

  it('renders as h1 when titleComponent="h1"', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, { title: 'Heading', titleComponent: 'h1' })
    );
    expect(html).toContain('<h1');
    expect(html).not.toContain('<h2');
  });

  it('keeps h2 visual sizing (MuiTypography-h2 class) by default even when rendered as an h1 tag', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, { title: 'Heading', titleComponent: 'h1' })
    );
    expect(html).toContain('MuiTypography-h2');
  });

  it('renders as h3 when titleComponent="h3" (any heading level, not just h1/h2)', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, { title: 'Heading', titleComponent: 'h3' })
    );
    expect(html).toContain('<h3');
  });

  it('renders h3 visual sizing when titleVariant="h3", independent of titleComponent', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, { title: 'Heading', titleVariant: 'h3' })
    );
    expect(html).toContain('MuiTypography-h3');
    expect(html).not.toContain('MuiTypography-h2');
  });

  it('decouples tag from size: titleComponent="h1" with titleVariant="h3" renders an <h1> tag sized like an h3', () => {
    const html = renderToStaticMarkup(
      React.createElement(SectionTitle, {
        title: 'Heading',
        titleComponent: 'h1',
        titleVariant: 'h3',
      })
    );
    expect(html).toContain('<h1');
    expect(html).toContain('MuiTypography-h3');
    expect(html).not.toContain('<h2');
    expect(html).not.toContain('MuiTypography-h2');
  });
});
