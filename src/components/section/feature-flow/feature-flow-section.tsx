'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

import { GiselleIcon } from '../../material/data-display/icon/giselle';
import { SectionTitle } from '../../material/layout/section-title';
import { FloatingSubNav } from '../../material/navigation/floating-sub-nav';
import { MotionViewport } from '../../motion/viewport';
import { HOVER_STEP_DELAY_MS } from './feature-flow-section.const';
import { featureFlowItemSx, featureFlowRootSx } from './feature-flow-section.styles';
import {
  hasExpansionData,
  useClientImagePrewarm,
  useImagePreloader,
  useScrollDirection,
} from './feature-flow-section.utils';
import { FeatureFlowImageColumn } from './feature-flow-image-column';
import { FeatureFlowItemDetail } from './feature-flow-item-detail';
import type { FeatureFlowItem, FeatureFlowSectionProps, FeatureFlowSubNavItem } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowSection` — a scrollable list of expandable feature items paired
 * with a sticky image column that reacts to hover and scroll direction.
 * Clicking an item with expansion data (metrics, technologies, highlight
 * cards, or a long description) opens a detail panel below the grid; a
 * floating sub-nav appears once any item is expanded and tracks which one
 * is active.
 *
 * @example
 * ```tsx
 * <FeatureFlowSection
 *   title="What I work on"
 *   items={[
 *     {
 *       id: 'design-systems',
 *       icon: 'solar:widget-bold-duotone',
 *       title: 'Design systems',
 *       description: 'Consistent, accessible UI at scale.',
 *       technologies: [{ name: 'React', icon: 'logos:react' }],
 *       metrics: [{ value: '20+', label: 'Components shipped' }],
 *     },
 *   ]}
 *   image={{ src: '/images/design-systems.png', alt: 'Design systems preview' }}
 * />
 * ```
 *
 * **Quality status (28 Aug 2026):** DoD 19/20 · Best practices 10/13
 */
export function FeatureFlowSection({
  caption,
  title,
  txtGradient,
  description,
  items,
  image,
  layoutDirection = 'left',
  columnSpacing = { xs: 0, md: 8 },
  descriptionGridSize,
  imageGridSize,
  sx,
  ...other
}: FeatureFlowSectionProps) {
  const isLeft = layoutDirection === 'left';
  const resolvedDescriptionGridSize = descriptionGridSize ?? {
    xs: 12,
    md: 6,
    lg: isLeft ? 7 : 5,
  };
  const resolvedImageGridSize = imageGridSize ?? { xs: 12, md: 6, lg: isLeft ? 5 : 7 };

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);
  const [userHasSelected, setUserHasSelected] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [hoverImageIndex, setHoverImageIndex] = useState(0);

  const hoverImageIndexRef = useRef(0);

  const { direction: scrollDirection, isScrolling } = useScrollDirection();

  const activeItem = items[activeItemIndex] ?? items[0];

  const setHoverPhase = useCallback((phase: number) => {
    hoverImageIndexRef.current = phase;
    setHoverImageIndex(phase);
  }, []);

  const scrollAwareSrc = useMemo(() => {
    if (image.scrollImages?.length === 2) {
      return image.scrollImages[scrollDirection === 'down' ? 0 : 1];
    }
    return image.src;
  }, [image.scrollImages, image.src, scrollDirection]);

  // While actively scrolling (and the user hasn't clicked an item), show the
  // scroll-direction image. Otherwise, show the active item's own image
  // sequence, falling back to the shared stack sources, then the base src.
  const hoverSequenceSources = useMemo(() => {
    if (image.scrollImages?.length === 2 && isScrolling && !userHasSelected) {
      return [scrollAwareSrc];
    }
    if (activeItem?.imgUrl?.length) return [...activeItem.imgUrl];
    if (image.stackSources?.length) return [...image.stackSources];
    return image.src ? [image.src] : [];
  }, [
    activeItem,
    image.scrollImages,
    image.src,
    image.stackSources,
    isScrolling,
    scrollAwareSrc,
    userHasSelected,
  ]);

  // Hover-stack crossfade sequence: whenever the active item (or its image
  // sequence) changes, restart the step-through from the first frame and
  // advance one step every HOVER_STEP_DELAY_MS until the last frame.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets the step-through synchronously when the active item changes
    setHoverPhase(0);
    if (hoverSequenceSources.length <= 1) return undefined;

    const interval = globalThis.setInterval(() => {
      const next = hoverImageIndexRef.current + 1;
      if (next >= hoverSequenceSources.length) {
        globalThis.clearInterval(interval);
        return;
      }
      setHoverPhase(next);
    }, HOVER_STEP_DELAY_MS);

    return () => globalThis.clearInterval(interval);
  }, [activeItemIndex, hoverSequenceSources, setHoverPhase]);

  // Once scrolling goes idle, snap the displayed image back to the selected
  // (clicked) item — mouse movement during scroll may have hovered a
  // different item without the user clicking it.
  useEffect(() => {
    if (!isScrolling) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs the image index back to the click-selected item once scrolling goes idle
      setActiveItemIndex(selectedItemIndex);
      setHoverPhase(0);
    }
  }, [isScrolling, selectedItemIndex, setHoverPhase]);

  const activeSrc = hoverSequenceSources[hoverImageIndex] ?? hoverSequenceSources[0] ?? '';

  const initiallyVisibleSrc =
    items[0]?.imgUrl?.[0] ?? image.scrollImages?.[0] ?? image.stackSources?.[0] ?? image.src;

  const allItemImageSrcs = useMemo(
    () =>
      Array.from(
        new Set(
          [
            image.src,
            ...(image.scrollImages ?? []),
            ...(image.stackSources ?? []),
            ...items.flatMap((item) => item.imgUrl ?? []),
          ].filter((src): src is string => !!src)
        )
      ),
    [image.src, image.scrollImages, image.stackSources, items]
  );

  useImagePreloader(allItemImageSrcs, initiallyVisibleSrc);
  useClientImagePrewarm(allItemImageSrcs);

  const handleItemHover = (index: number) => {
    setActiveItemIndex(index);
    setHoverPhase(0);
  };

  const handleItemClick = (item: FeatureFlowItem, index: number) => {
    if (!hasExpansionData(item)) return;
    setActiveItemIndex(index);
    setSelectedItemIndex(index);
    setUserHasSelected(true);
    setExpandedItemId((current) => (current === item.id ? null : item.id));
  };

  const subNavItems: FeatureFlowSubNavItem[] = useMemo(
    () =>
      items.filter(hasExpansionData).map((item) => ({
        id: item.id,
        label: item.title,
        icon: <GiselleIcon icon={item.icon} width={22} aria-hidden="true" />,
      })),
    [items]
  );

  // The sub-nav always switches to the pressed item — it never toggles.
  const handleSubNavSelect = useCallback(
    (id: string) => {
      const index = items.findIndex((item) => item.id === id);
      if (index !== -1) {
        setActiveItemIndex(index);
        setSelectedItemIndex(index);
        setUserHasSelected(true);
      }
      setExpandedItemId(id);
    },
    [items]
  );

  const expandedItem = items.find((item) => item.id === expandedItemId) ?? null;

  return (
    <Box
      component="section"
      sx={[featureFlowRootSx, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <MotionViewport>
        <Container sx={{ position: 'relative' }}>
          <Grid
            container
            columnSpacing={columnSpacing}
            rowSpacing={{ xs: 5, md: 0 }}
            sx={{ position: 'relative' }}
          >
            <Grid
              size={resolvedDescriptionGridSize}
              sx={{ order: { xs: 1, md: isLeft ? 1 : 2 }, pl: { md: isLeft ? 0 : 4 } }}
            >
              {title && (
                <SectionTitle
                  caption={caption}
                  title={title}
                  txtGradient={txtGradient}
                  description={description}
                  sx={{ mb: { xs: 5, md: 8 }, textAlign: { xs: 'center', md: 'left' } }}
                />
              )}

              <Stack
                spacing={1.5}
                sx={{ maxWidth: { sm: 560, md: 400 }, mx: { xs: 'auto', md: 'unset' } }}
                onMouseLeave={() => {
                  setActiveItemIndex(selectedItemIndex);
                  setHoverPhase(0);
                }}
              >
                {items.map((item, index) => {
                  const interactive = hasExpansionData(item);
                  const isSelected = index === selectedItemIndex;
                  const isActive = index === activeItemIndex;
                  const isExpanded = item.id === expandedItemId;

                  const rowContent = (
                    <>
                      <GiselleIcon icon={item.icon} width={48} aria-hidden="true" />
                      <Stack spacing={1} sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="h4" component="h6" color="inherit">
                          {item.title}
                        </Typography>
                        <Typography color="inherit">{item.description}</Typography>
                      </Stack>
                    </>
                  );

                  if (!interactive) {
                    return (
                      <Box
                        key={item.id}
                        onMouseEnter={() => handleItemHover(index)}
                        sx={featureFlowItemSx({
                          isSelected,
                          isActive,
                          isExpanded,
                          interactive: false,
                        })}
                      >
                        {rowContent}
                      </Box>
                    );
                  }

                  return (
                    <ButtonBase
                      key={item.id}
                      disableRipple
                      type="button"
                      aria-pressed={isSelected}
                      onMouseEnter={() => handleItemHover(index)}
                      onFocus={() => handleItemHover(index)}
                      onClick={() => handleItemClick(item, index)}
                      sx={featureFlowItemSx({
                        isSelected,
                        isActive,
                        isExpanded,
                        interactive: true,
                      })}
                    >
                      {rowContent}
                    </ButtonBase>
                  );
                })}
              </Stack>
            </Grid>

            <Grid size={resolvedImageGridSize} sx={{ order: { xs: 2, md: isLeft ? 2 : 1 } }}>
              <FeatureFlowImageColumn
                activeSrc={activeSrc}
                ghostSrc={initiallyVisibleSrc ?? image.src}
                allSrcs={allItemImageSrcs}
                alt={image.alt}
                sx={image.sx}
              />
            </Grid>
          </Grid>
        </Container>
      </MotionViewport>

      <AnimatePresence mode="wait">
        {expandedItem && (
          <motion.div
            key={expandedItem.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <FeatureFlowItemDetail item={expandedItem} />
          </motion.div>
        )}
      </AnimatePresence>

      <FloatingSubNav
        sticky
        items={subNavItems}
        activeId={expandedItemId}
        onSelect={handleSubNavSelect}
      />
    </Box>
  );
}
