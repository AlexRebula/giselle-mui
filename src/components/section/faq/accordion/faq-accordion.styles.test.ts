// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import type { Theme } from '@mui/material/styles';

import {
  accordionItemSx,
  contactSectionSx,
  motionViewportSx,
  sectionTitleSx,
  footerWrapperSx,
  contactDescriptionSx,
} from './faq-accordion.styles';

// ----------------------------------------------------------------------

const mockTheme = {
  transitions: {
    create: () => 'background-color 200ms',
    duration: { shorter: 200 },
  },
} as unknown as Theme;

// ----------------------------------------------------------------------

describe('accordionItemSx', () => {
  it('returns hover bgcolor using channelAlpha at 0.08', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    // Uses SSR-safe CSS custom property string — not resolved at build time
    expect((styles['&:hover'] as Record<string, unknown>)['bgcolor']).toBe(
      'rgba(var(--mui-palette-grey-500Channel) / 0.08)'
    );
  });

  it('returns expanded bgcolor using the same channel value', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    const expanded = styles['&.MuiAccordion-expanded'] as Record<string, unknown>;
    expect(expanded['bgcolor']).toBe('rgba(var(--mui-palette-grey-500Channel) / 0.08)');
  });

  it('hover and expanded bgcolors are identical', () => {
    const styles = (accordionItemSx as (theme: Theme) => Record<string, unknown>)(mockTheme);
    const hoverBg = (styles['&:hover'] as Record<string, unknown>)['bgcolor'];
    const expandedBg = (styles['&.MuiAccordion-expanded'] as Record<string, unknown>)['bgcolor'];
    expect(hoverBg).toBe(expandedBg);
  });
});

// ----------------------------------------------------------------------

describe('contactSectionSx', () => {
  it('produces a linear-gradient background using the grey 500 channel', () => {
    const styles = contactSectionSx as Record<string, unknown>;
    expect(String(styles['background'])).toContain('linear-gradient');
    expect(String(styles['background'])).toContain('var(--mui-palette-grey-500Channel)');
    expect(String(styles['background'])).toContain('transparent');
  });

  it('uses left-to-right gradient direction', () => {
    const styles = contactSectionSx as Record<string, unknown>;
    expect(String(styles['background'])).toContain('to left');
  });
});

// ----------------------------------------------------------------------

describe('motionViewportSx', () => {
  it('gives the viewport a relative positioning context with top padding', () => {
    expect(motionViewportSx).toMatchObject({
      pt: 10,
      position: 'relative',
    });
  });
});

describe('sectionTitleSx', () => {
  it('centres the section title', () => {
    expect(sectionTitleSx).toMatchObject({
      textAlign: 'center',
    });
  });
});

describe('footerWrapperSx', () => {
  it('gives the footer wrapper a relative positioning context', () => {
    expect(footerWrapperSx).toMatchObject({
      position: 'relative',
    });
  });
});

describe('contactDescriptionSx', () => {
  it('spaces and mutes the contact description text', () => {
    expect(contactDescriptionSx).toMatchObject({
      mt: 2,
      mb: 3,
      color: 'text.secondary',
    });
  });
});
