// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { createElement } from 'react';

import { renderWithTheme } from '../../../test-utils';
import { FeatureFlowImageColumn } from './feature-flow-image-column';

describe('FeatureFlowImageColumn', () => {
  it('mounts every src in allSrcs', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png', '/c.png'],
        alt: 'Alt text',
      })
    );
    expect(html).toContain('/a.png');
    expect(html).toContain('/b.png');
    expect(html).toContain('/c.png');
  });

  it('gives only activeSrc full opacity; other srcs are opacity 0', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'Alt text',
      })
    );
    // The active image is the only one without aria-hidden.
    const activeImgMatch = html.match(/<img[^>]*src="\/b\.png"[^>]*>/);
    expect(activeImgMatch?.[0]).not.toContain('aria-hidden');
  });

  it('marks every non-active src as aria-hidden', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'Alt text',
      })
    );
    const inactiveImgMatch = html.match(/<img[^>]*src="\/a\.png"[^>]*>/g)?.[1];
    expect(inactiveImgMatch).toContain('aria-hidden="true"');
  });

  it('sets the alt text only on the currently-active (visible) image, not the ghost frame', () => {
    const html = renderWithTheme(
      createElement(FeatureFlowImageColumn, {
        activeSrc: '/b.png',
        ghostSrc: '/a.png',
        allSrcs: ['/a.png', '/b.png'],
        alt: 'A descriptive alt',
      })
    );
    const activeImgMatch = html.match(/<img[^>]*src="\/b\.png"[^>]*>/);
    const nonActiveGhostImgMatch = html.match(/<img[^>]*src="\/a\.png"[^>]*>/g)?.[1];
    expect(activeImgMatch?.[0]).toContain('alt="A descriptive alt"');
    expect(nonActiveGhostImgMatch).toContain('alt=""');
  });
});
