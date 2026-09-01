import { describe, expect, it } from 'vitest';

import {
  highlightArrowButtonSx,
  highlightCarouselRootSx,
  highlightControlsRowSx,
  highlightDetailTextSx,
  highlightIndexLabelSx,
  highlightLearnMoreLinkSx,
  highlightScrimSx,
  highlightSlideImageSx,
  highlightTextSlotSx,
  highlightTitleSx,
  HIGHLIGHT_CAROUSEL_HEIGHT,
} from './feature-flow-highlight-carousel.styles';

// ----------------------------------------------------------------------

describe('highlightCarouselRootSx', () => {
  it('sets a fixed height matching HIGHLIGHT_CAROUSEL_HEIGHT', () => {
    expect(highlightCarouselRootSx).toMatchObject({ height: HIGHLIGHT_CAROUSEL_HEIGHT });
  });
});

describe('highlightSlideImageSx', () => {
  it('gives the active slide full opacity and a 0.5s transition', () => {
    expect(highlightSlideImageSx(true)).toMatchObject({
      opacity: 1,
      transition: 'opacity 0.5s ease',
      objectFit: 'cover',
    });
  });

  it('gives an inactive slide zero opacity', () => {
    expect(highlightSlideImageSx(false)).toMatchObject({ opacity: 0 });
  });
});

describe('highlightScrimSx', () => {
  it('is a pointer-events-none gradient overlay', () => {
    expect(highlightScrimSx).toMatchObject({ pointerEvents: 'none' });
    expect(String((highlightScrimSx as Record<string, unknown>)['background'])).toContain(
      'linear-gradient'
    );
  });
});

describe('highlightTextSlotSx', () => {
  it('anchors text to the bottom of the slot', () => {
    expect(highlightTextSlotSx).toMatchObject({ justifyContent: 'flex-end' });
  });
});

describe('highlightTitleSx', () => {
  it('adds bottom margin below the title', () => {
    expect(highlightTitleSx).toMatchObject({ mb: 1 });
  });
});

describe('highlightLearnMoreLinkSx', () => {
  it('renders inline and inherits the surrounding (white) text colour', () => {
    expect(highlightLearnMoreLinkSx).toMatchObject({
      display: 'inline-block',
      color: 'inherit',
    });
  });
});

describe('highlightControlsRowSx', () => {
  it('positions the controls row in the top-right corner', () => {
    expect(highlightControlsRowSx).toMatchObject({ position: 'absolute', top: 16, right: 16 });
  });
});

describe('highlightDetailTextSx', () => {
  it('uses a translucent white for legibility over the dark scrim', () => {
    expect(String((highlightDetailTextSx as Record<string, unknown>)['color'])).toContain('rgba(');
  });
});

describe('highlightIndexLabelSx', () => {
  it('reserves a minimum width so the "N/M" label does not shift the layout', () => {
    expect(highlightIndexLabelSx).toMatchObject({ minWidth: 32, textAlign: 'center' });
  });
});

describe('highlightArrowButtonSx', () => {
  it('uses a translucent white pill background', () => {
    expect(String((highlightArrowButtonSx as Record<string, unknown>)['bgcolor'])).toContain(
      'rgba('
    );
  });
});
