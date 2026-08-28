import { useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../material/data-display/icon/giselle';
import {
  highlightArrowButtonSx,
  highlightCarouselRootSx,
  highlightControlsRowSx,
  highlightDetailTextSx,
  highlightIndexLabelSx,
  highlightScrimSx,
  highlightSlideImageSx,
  highlightTextSlotSx,
} from './feature-flow-highlight-carousel.styles';
import type { FeatureFlowHighlightCarouselProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowHighlightCarousel` — internal, self-contained carousel for one
 * item's `highlightCards`. Not exported from the package barrel: it is an
 * implementation detail of `FeatureFlowSection`'s detail panel.
 *
 * Images crossfade only (never slide); the headline/detail text below fades
 * with the selected slide. A fixed gradient scrim sits above the images so
 * text stays legible regardless of slide content.
 */
export function FeatureFlowHighlightCarousel({ cards }: FeatureFlowHighlightCarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!cards.length) return null;

  const goTo = (index: number) => setSelectedIndex((index + cards.length) % cards.length);
  const selectedCard = cards[selectedIndex];

  return (
    <Box sx={highlightCarouselRootSx}>
      {/* Images: absolutely stacked, crossfade only — never slide */}
      {cards.map((card, index) => (
        <Box
          key={card.headline}
          component="img"
          alt={card.headline}
          src={card.src ?? ''}
          loading={index === selectedIndex ? 'eager' : 'lazy'}
          sx={highlightSlideImageSx(index === selectedIndex)}
        />
      ))}

      {/* Fixed gradient scrim — sits above images, never slides */}
      <Box aria-hidden sx={highlightScrimSx} />

      {/* Text slide for the selected card only */}
      <Box sx={highlightTextSlotSx}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          {selectedCard?.headline}
        </Typography>
        <Typography variant="body1" sx={highlightDetailTextSx}>
          {selectedCard?.detail}
        </Typography>
      </Box>

      {cards.length > 1 && (
        <Box sx={highlightControlsRowSx}>
          <Typography variant="caption" sx={highlightIndexLabelSx}>
            {selectedIndex + 1}/{cards.length}
          </Typography>
          <IconButton
            aria-label="Previous highlight"
            size="small"
            onClick={() => goTo(selectedIndex - 1)}
            sx={highlightArrowButtonSx}
          >
            <GiselleIcon icon="solar:alt-arrow-left-bold" width={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            aria-label="Next highlight"
            size="small"
            onClick={() => goTo(selectedIndex + 1)}
            sx={highlightArrowButtonSx}
          >
            <GiselleIcon icon="solar:alt-arrow-right-bold" width={18} aria-hidden="true" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
}
