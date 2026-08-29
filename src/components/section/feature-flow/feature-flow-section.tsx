'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import LinearProgress from '@mui/material/LinearProgress';

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
  useImageRevealTransform,
  useScrollDirection,
} from './feature-flow-section.utils';
import { FeatureFlowImageColumn } from './image-column';
import { FeatureFlowItemDetail } from './item-detail';
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
export const FeatureFlowSection = React.forwardRef<HTMLElement, FeatureFlowSectionProps>(
  function FeatureFlowSection(
    {
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
    },
    ref
  ) {
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
    // Non-null while waiting for the newly-expanded item's detail panel to
    // exist in the DOM (it may not be mounted yet — see the effect below).
    const [pendingScrollItemId, setPendingScrollItemId] = useState<string | null>(null);

    const hoverImageIndexRef = useRef(0);
    // Keyed by item id rather than a single ref: `AnimatePresence mode="wait"`
    // means at most one detail panel is ever mounted at a time, but the ref
    // callback for the outgoing item can fire (with `null`) after the
    // incoming item's effect has already scheduled its own poll — keying by
    // id keeps each lookup unambiguous regardless of that ordering.
    const detailPanelNodesRef = useRef<Map<string, HTMLDivElement>>(new Map());

    const { direction: scrollDirection, isScrolling } = useScrollDirection();
    const { ref: imageColumnRef, style: imageRevealStyle } = useImageRevealTransform();

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

    // Restores the "opening an item jumps the viewer to its detail panel"
    // behavior: on expand, poll (via requestAnimationFrame) until the panel
    // actually exists in the DOM — `AnimatePresence mode="wait"` delays its
    // mount until any previously-expanded item's exit transition finishes —
    // then scroll it into view. `pendingScrollItemId` drives a loading
    // indicator for that gap; collapsing (expandedItemId → null) clears it
    // without scrolling anywhere.
    useEffect(() => {
      if (!expandedItemId) {
        setPendingScrollItemId(null);
        return undefined;
      }

      let rafId: number | undefined;
      let cancelled = false;

      const attemptScroll = () => {
        if (cancelled) return;
        const node = detailPanelNodesRef.current.get(expandedItemId);
        if (node) {
          node.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
          setPendingScrollItemId((current) => (current === expandedItemId ? null : current));
          return;
        }
        rafId = globalThis.requestAnimationFrame(attemptScroll);
      };

      setPendingScrollItemId(expandedItemId);
      attemptScroll();

      return () => {
        cancelled = true;
        if (rafId !== undefined) globalThis.cancelAnimationFrame(rafId);
      };
    }, [expandedItemId]);

    return (
      <Box
        ref={ref}
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
                  ref={imageColumnRef}
                  activeSrc={activeSrc}
                  ghostSrc={initiallyVisibleSrc ?? image.src}
                  allSrcs={allItemImageSrcs}
                  alt={image.alt}
                  revealStyle={imageRevealStyle}
                  sx={image.sx}
                />
              </Grid>
            </Grid>
          </Container>
        </MotionViewport>

        {pendingScrollItemId && (
          <LinearProgress
            aria-label="Loading item detail panel"
            aria-live="polite"
            aria-busy="true"
          />
        )}

        <AnimatePresence mode="wait">
          {expandedItem && (
            <m.div
              key={expandedItem.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <FeatureFlowItemDetail
                item={expandedItem}
                ref={(node) => {
                  if (node) {
                    detailPanelNodesRef.current.set(expandedItem.id, node);
                  } else {
                    detailPanelNodesRef.current.delete(expandedItem.id);
                  }
                }}
              />
            </m.div>
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
);

FeatureFlowSection.displayName = 'FeatureFlowSection';
