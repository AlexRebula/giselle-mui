'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import { GiselleIcon } from '../../material/data-display/icon/giselle';
import { BasicSection } from '../../material/layout/basic-section';
import { FloatingSubNav } from '../../material/navigation/floating-sub-nav';
import { MotionViewport } from '../../motion/viewport';
import { HOVER_STEP_DELAY_MS } from './feature-flow-section.const';
import {
  featureFlowDescriptionGridSx,
  featureFlowGridContainerSx,
  featureFlowImageGridSx,
  featureFlowRootSx,
} from './feature-flow-section.styles';
import {
  hasExpansionData,
  useClientImagePrewarm,
  useImagePreloader,
  useImageRevealTransform,
  useScrollDirection,
} from './feature-flow-section.utils';
import { FeatureFlowDescriptionColumn } from './description-column';
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
      decoration = true,
      renderRightPanel,
      renderHighlightPanel,
      detailPanelColor,
      itemDetailSx,
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

    // Resets the previewed item back to the last-selected one, once the
    // pointer or keyboard focus leaves the row group entirely.
    const handleLeave = () => {
      setActiveItemIndex(selectedItemIndex);
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

    // `renderRightPanel`, when provided, fully replaces the default
    // image column — e.g. a skills-documentation consumer showing a
    // heading/description pair instead of an image. Falls back to `null`
    // rather than the default when `items` is empty (no active item to
    // hand the override), matching the default column's own behaviour.
    let rightPanel: React.ReactNode;
    if (renderRightPanel) {
      rightPanel = activeItem
        ? renderRightPanel(activeItem, activeItem.id === expandedItemId)
        : null;
    } else {
      rightPanel = (
        <FeatureFlowImageColumn
          ref={imageColumnRef}
          activeSrc={activeSrc}
          ghostSrc={initiallyVisibleSrc ?? image.src}
          allSrcs={allItemImageSrcs}
          alt={image.alt}
          revealStyle={imageRevealStyle}
          sx={image.sx}
        />
      );
    }

    return (
      <BasicSection
        ref={ref}
        decoration={decoration}
        containerSx={{ position: 'relative' }}
        containerPy={0}
        unconstrainedChildren={
          <>
            {pendingScrollItemId && (
              <LinearProgress
                aria-label="Loading item detail panel"
                aria-live="polite"
                aria-busy="true"
              />
            )}

            <FeatureFlowItemDetail
              item={expandedItem}
              onNodeRef={(itemId, node) => {
                if (node) {
                  detailPanelNodesRef.current.set(itemId, node);
                } else {
                  detailPanelNodesRef.current.delete(itemId);
                }
              }}
              renderHighlightPanel={renderHighlightPanel}
              detailPanelColor={detailPanelColor}
              sx={itemDetailSx}
            />

            {/* FloatingSubNav is deliberately a sibling of FeatureFlowItemDetail,
                not nested inside it (see #193 and FeatureFlowItemDetail's own
                JSDoc for the stacking-context mechanism): its explicit
                `zIndex: theme.zIndex.speedDial` needs to compete directly with
                the sticky image column, and FeatureFlowItemDetail's `layout`
                transition would otherwise trap it in a nested stacking context
                that can't escape to do that. */}
            <FloatingSubNav
              sticky
              items={subNavItems}
              activeId={expandedItemId}
              onSelect={handleSubNavSelect}
            />
          </>
        }
        sx={[featureFlowRootSx(Boolean(expandedItemId)), ...(Array.isArray(sx) ? sx : [sx])]}
        {...other}
      >
        <MotionViewport>
          <Grid
            container
            columnSpacing={columnSpacing}
            rowSpacing={{ xs: 5, md: 0 }}
            sx={featureFlowGridContainerSx(Boolean(expandedItemId))}
          >
            <Grid size={resolvedDescriptionGridSize} sx={featureFlowDescriptionGridSx(isLeft)}>
              <FeatureFlowDescriptionColumn
                caption={caption}
                title={title}
                txtGradient={txtGradient}
                description={description}
                items={items}
                selectedItemIndex={selectedItemIndex}
                activeItemIndex={activeItemIndex}
                expandedItemId={expandedItemId}
                onItemHover={handleItemHover}
                onItemSelect={handleItemClick}
                onLeave={handleLeave}
              />
            </Grid>

            <Grid size={resolvedImageGridSize} sx={featureFlowImageGridSx(isLeft)}>
              {rightPanel}
            </Grid>
          </Grid>
        </MotionViewport>
      </BasicSection>
    );
  }
);

FeatureFlowSection.displayName = 'FeatureFlowSection';
