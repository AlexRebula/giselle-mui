import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  detailPanelSx,
  featureFlowItemSx,
  featureFlowRootSx,
  highlightSlideImageSx,
  imageColumnCardSx,
  imageColumnFrameSx,
} from './feature-flow-section.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  vars: {
    palette: {
      grey: { '500Channel': '145 158 171' },
      common: { blackChannel: '0 0 0' },
      primary: {
        main: 'rgb(25 118 210)',
        mainChannel: '25 118 210',
      },
    },
  },
  transitions: {
    create: () => 'all 200ms',
    duration: { shorter: 200 },
  },
  applyStyles: (_mode: string, styles: Record<string, unknown>) => styles,
} as unknown as Theme;

type StyleFn = (theme: Theme) => Record<string, unknown>;

function resolve<T>(sx: T) {
  return (sx as unknown as StyleFn)(mockTheme);
}

// ----------------------------------------------------------------------

describe('featureFlowRootSx', () => {
  it('clips horizontal overflow without creating a scroll container', () => {
    expect(featureFlowRootSx).toMatchObject({ overflowX: 'clip', position: 'relative' });
  });
});

describe('imageColumnCardSx', () => {
  it('applies a palette-tinted drop shadow using channelAlpha', () => {
    const styles = resolve(imageColumnCardSx);
    expect(String(styles['boxShadow'])).toContain('rgba(');
    expect(String(styles['boxShadow'])).toContain('0.16');
  });
});

describe('detailPanelSx', () => {
  it('tints the background using the primary channel', () => {
    expect(String((detailPanelSx as Record<string, unknown>)['bgcolor'])).toContain(
      'rgba(var(--mui-palette-primary-mainChannel)'
    );
  });
});

describe('featureFlowItemSx', () => {
  it('non-interactive items get cursor: default and no hover styles', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        interactive: false,
      })
    );
    expect(styles['cursor']).toBe('default');
    expect(styles['&:hover']).toBeUndefined();
  });

  it('interactive, non-selected items get cursor: pointer and a hover style', () => {
    const styles = resolve(
      featureFlowItemSx({
        isSelected: false,
        isActive: false,
        isExpanded: false,
        interactive: true,
      })
    );
    expect(styles['cursor']).toBe('pointer');
    expect(styles['&:hover']).toBeDefined();
  });

  it('selected items get a persistent elevated background', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: true, isActive: false, isExpanded: false, interactive: true })
    );
    expect(styles['bgcolor']).toBe('background.paper');
    expect(String(styles['boxShadow'])).toContain('rgba(');
  });

  it('expanded items get an inset accent border colour', () => {
    const styles = resolve(
      featureFlowItemSx({ isSelected: false, isActive: false, isExpanded: true, interactive: true })
    );
    expect(String(styles['borderColor'])).toContain('rgba(var(--mui-palette-primary-mainChannel)');
    expect(String(styles['boxShadow'])).toContain('inset 3px 0 0');
  });
});

describe('imageColumnFrameSx', () => {
  it('gives the active frame full opacity and a 0.4s transition', () => {
    expect(imageColumnFrameSx(true)).toMatchObject({ opacity: 1, transition: 'opacity 0.4s ease' });
  });

  it('gives an inactive frame zero opacity', () => {
    expect(imageColumnFrameSx(false)).toMatchObject({ opacity: 0 });
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
