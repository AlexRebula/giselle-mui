// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import {
  quoteMarkSx,
  quoteTextSx,
  quoteCardRowSlotSx,
  quoteCardTextSlotSx,
  quoteAttributionRowSlotSx,
  quoteAuthorSx,
  quoteSeparatorSx,
  quoteSourceSx,
} from './quote-card.styles';

// ----------------------------------------------------------------------

describe('quoteMarkSx', () => {
  it('uses the passed color for the text color token', () => {
    const sx = quoteMarkSx('primary');
    expect(sx).toMatchObject({ color: 'primary.main' });
  });

  it('is visually reduced to not overpower the quote text', () => {
    const sx = quoteMarkSx('info');
    expect(sx).toMatchObject({ opacity: 0.4, flexShrink: 0 });
  });

  it('uses serif font for the decorative glyph', () => {
    const sx = quoteMarkSx('success');
    expect((sx as Record<string, unknown>).fontFamily).toContain('Georgia');
  });
});

describe('quoteTextSx', () => {
  it('uses italic light-weight styling for readability', () => {
    expect(quoteTextSx).toMatchObject({
      fontStyle: 'italic',
      fontWeight: 'fontWeightLight',
      color: 'text.secondary',
      lineHeight: 1.85,
    });
  });
});

describe('quoteCardRowSlotSx', () => {
  it('lays out the quote-mark column beside the text column', () => {
    expect(quoteCardRowSlotSx).toMatchObject({ display: 'flex', gap: 2 });
  });
});

describe('quoteCardTextSlotSx', () => {
  it('takes remaining width and allows text truncation next to the quote mark', () => {
    expect(quoteCardTextSlotSx).toMatchObject({ flex: 1, minWidth: 0 });
  });
});

describe('quoteAttributionRowSlotSx', () => {
  it('spaces the attribution row below the quote text', () => {
    expect(quoteAttributionRowSlotSx).toMatchObject({ mt: 2, color: 'text.disabled' });
  });
});

describe('quoteAuthorSx', () => {
  it('renders with medium font weight to stand out from the source', () => {
    expect(quoteAuthorSx).toMatchObject({ fontWeight: 'fontWeightMedium' });
  });
});

describe('quoteSeparatorSx', () => {
  it('is visually reduced — purely decorative punctuation', () => {
    expect(quoteSeparatorSx).toMatchObject({ opacity: 0.6 });
  });
});

describe('quoteSourceSx', () => {
  it('is visually lighter than the author name', () => {
    expect(quoteSourceSx).toMatchObject({ opacity: 0.72 });
  });
});
