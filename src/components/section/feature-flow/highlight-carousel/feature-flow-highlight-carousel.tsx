import React, { useState } from 'react';
import { m, AnimatePresence, useReducedMotion } from 'framer-motion';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../material/data-display/icon/giselle';
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
} from './feature-flow-highlight-carousel.styles';
import {
  HIGHLIGHT_TEXT_SLIDE_DISTANCE,
  highlightTextVariants,
} from './feature-flow-highlight-carousel.animations';
import type { FeatureFlowHighlightCarouselProps } from './types';

// Re-export — keeps `import { FeatureFlowHighlightCarouselProps } from
// './feature-flow-highlight-carousel'` working alongside the folder barrel.
export type { FeatureFlowHighlightCarouselProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowHighlightCarousel` — internal, self-contained carousel for one
 * item's `highlightCards`. Not exported from the package barrel: it is an
 * implementation detail of `FeatureFlowSection`'s detail panel.
 *
 * Images crossfade only (never slide); the title/description text below slides
 * in directionally with the selected slide. A fixed gradient scrim sits
 * above the images so text stays legible regardless of slide content.
 *
 * **Quality status (02 Sep 2026):** DoD 11/12 · Best practices not re-audited — SonarQube not verified
 */
export const FeatureFlowHighlightCarousel = React.forwardRef<
  HTMLDivElement,
  FeatureFlowHighlightCarouselProps
>(function FeatureFlowHighlightCarousel({ cards, sx, ...other }, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [step, setStep] = useState<1 | -1>(1);
  const reducedMotion = useReducedMotion();

  if (!cards.length) return null;

  const goTo = (index: number, direction: 1 | -1) => {
    setStep(direction);
    setSelectedIndex((index + cards.length) % cards.length);
  };
  const selectedCard = cards[selectedIndex];
  const textVariants = highlightTextVariants(reducedMotion ? 0 : HIGHLIGHT_TEXT_SLIDE_DISTANCE);

  return (
    <Box ref={ref} sx={[highlightCarouselRootSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      {/* Images: absolutely stacked, crossfade only — never slide.
          Purely decorative backdrop: the title/description below already
          convey the same content as real text, so every frame (including
          the active one) is aria-hidden to avoid a duplicate announcement. */}
      {cards.map((card, index) => (
        <Box
          key={card.title}
          component="img"
          alt=""
          aria-hidden="true"
          src={card.media ?? ''}
          loading={index === selectedIndex ? 'eager' : 'lazy'}
          sx={highlightSlideImageSx(index === selectedIndex)}
        />
      ))}

      {/* Fixed gradient scrim — sits above images, never slides */}
      <Box aria-hidden sx={highlightScrimSx} />

      {/* Text slide for the selected card only — slides in directionally,
          keyed by index so a slide change swaps the whole text block. */}
      <Box sx={highlightTextSlotSx}>
        <AnimatePresence mode="wait" custom={step}>
          <m.div
            key={selectedIndex}
            custom={step}
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <Typography variant="h4" sx={highlightTitleSx}>
              {selectedCard?.title}
            </Typography>
            <Typography variant="body1" sx={highlightDetailTextSx}>
              {selectedCard?.description}
            </Typography>
            {selectedCard?.href && (
              <Link href={selectedCard.href} variant="body2" sx={highlightLearnMoreLinkSx}>
                Learn more
              </Link>
            )}
          </m.div>
        </AnimatePresence>
      </Box>

      {cards.length > 1 && (
        <Box sx={highlightControlsRowSx}>
          <Typography variant="caption" sx={highlightIndexLabelSx}>
            {selectedIndex + 1}/{cards.length}
          </Typography>
          <IconButton
            aria-label="Previous highlight"
            size="small"
            onClick={() => goTo(selectedIndex - 1, -1)}
            sx={highlightArrowButtonSx}
          >
            <GiselleIcon icon="solar:alt-arrow-left-bold" width={18} aria-hidden="true" />
          </IconButton>
          <IconButton
            aria-label="Next highlight"
            size="small"
            onClick={() => goTo(selectedIndex + 1, 1)}
            sx={highlightArrowButtonSx}
          >
            <GiselleIcon icon="solar:alt-arrow-right-bold" width={18} aria-hidden="true" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
});

FeatureFlowHighlightCarousel.displayName = 'FeatureFlowHighlightCarousel';
