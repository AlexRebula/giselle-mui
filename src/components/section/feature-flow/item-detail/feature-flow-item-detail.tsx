import React from 'react';

import { m, AnimatePresence, useReducedMotion } from 'framer-motion';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import { MetricCard, MetricCardDecoration } from '../../../material/surfaces/card/metric';
import { TechIconStrip } from '../../../material/data-display/icon/tech-strip';
import { DETAIL_PANEL_LAYOUT_TRANSITION } from '../feature-flow-section.const';
import { detailPanelSx } from '../feature-flow-section.styles';
import { isRichLongDescription } from '../feature-flow-section.utils';
import { FeatureFlowHighlightCarousel } from '../highlight-carousel';
import {
  itemDetailHeaderIconSx,
  itemDetailHeaderSlotSx,
  itemDetailLongDescriptionSx,
  itemDetailMetricsGridSx,
} from './feature-flow-item-detail.styles';
import type { FeatureFlowItemDetailProps } from './types';

// Re-export — keeps `import { FeatureFlowItemDetailProps } from
// './feature-flow-item-detail'` working alongside the folder barrel.
export type { FeatureFlowItemDetailProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowItemDetail` — the expanded 2-column panel shown below the main
 * grid when an item with expansion data is clicked. Not exported from the
 * package barrel: an implementation detail of `FeatureFlowSection`.
 *
 * Always mounted, regardless of `item`: owns its own `AnimatePresence`
 * enter/exit crossfade and the outer `m.div layout` height transition
 * between different items' panel heights. Deliberately NOT nested inside
 * `FeatureFlowSection`'s `MotionViewport`/`BasicSection` tree (see #193):
 * framer-motion's `layout` prop keeps a persistent, non-`'none'` `transform`
 * on that node even at rest, which makes it establish its own CSS stacking
 * context. `FloatingSubNav`'s `zIndex: theme.zIndex.speedDial` would then
 * only out-rank content *inside* that context (like this panel) — it
 * couldn't escape to out-rank the sticky image column, which lives entirely
 * outside it. Rendering this as a sibling in the parent keeps it in the same
 * stacking context as the image column, so `FloatingSubNav`'s explicit
 * `zIndex` still wins where it needs to.
 *
 * Left column: icon + title, metrics grid, long description, technology
 * chips. Right column: the highlight-card carousel (when present), or
 * `renderHighlightPanel`'s own content when provided.
 *
 * `ref` is forwarded to the outer `m.div layout` wrapper: the one node that
 * stays mounted regardless of which item (or none) is currently showing.
 * This is distinct from `onNodeRef`, which targets the inner, per-item
 * content `Box` for scroll-into-view purposes — both coexist.
 */
export const FeatureFlowItemDetail = React.forwardRef<HTMLDivElement, FeatureFlowItemDetailProps>(
  function FeatureFlowItemDetail({ item, onNodeRef, renderHighlightPanel, sx, ...other }, ref) {
    const reducedMotion = useReducedMotion();
    const slideDistance = reducedMotion ? 0 : 8;

    return (
      <m.div ref={ref} layout transition={DETAIL_PANEL_LAYOUT_TRANSITION}>
        <AnimatePresence mode="wait">
          {item && (
            <m.div
              key={item.id}
              initial={{ opacity: 0, y: slideDistance }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -slideDistance }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Box
                ref={(node: HTMLDivElement | null) => onNodeRef?.(item.id, node)}
                sx={[detailPanelSx, ...(Array.isArray(sx) ? sx : [sx])]}
                {...other}
              >
                <Container>
                  <Grid container spacing={{ xs: 4, md: 8 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Stack spacing={4}>
                        <Stack direction="row" spacing={2} sx={itemDetailHeaderSlotSx}>
                          <GiselleIcon
                            icon={item.icon}
                            width={44}
                            sx={itemDetailHeaderIconSx}
                            aria-hidden="true"
                          />
                          <Typography variant="h3">{item.title}</Typography>
                        </Stack>

                        {item.metrics?.length ? (
                          <Box sx={itemDetailMetricsGridSx(item.metrics.length)}>
                            {item.metrics.map(({ value, label, sublabel, icon }) => (
                              <MetricCard
                                key={label}
                                value={value}
                                label={label}
                                sublabel={sublabel}
                                icon={
                                  icon ? (
                                    <GiselleIcon icon={icon} width={36} aria-hidden="true" />
                                  ) : undefined
                                }
                                color="primary"
                                decoration={<MetricCardDecoration color="primary" />}
                              />
                            ))}
                          </Box>
                        ) : null}

                        {isRichLongDescription(item) ? (
                          item.longDescription
                        ) : (
                          <Typography variant="body1" sx={itemDetailLongDescriptionSx}>
                            {item.longDescription ?? item.description}
                          </Typography>
                        )}

                        {item.technologies?.length ? (
                          <TechIconStrip
                            heading="Technologies"
                            centeredWrap={false}
                            items={item.technologies.map((tech) => ({
                              label: tech.name,
                              icon: <GiselleIcon icon={tech.icon} width={32} aria-hidden="true" />,
                            }))}
                          />
                        ) : null}
                      </Stack>
                    </Grid>

                    {renderHighlightPanel ? (
                      <Grid size={{ xs: 12, md: 6 }}>{renderHighlightPanel(item)}</Grid>
                    ) : (
                      (item.highlightCards ?? []).length > 0 && (
                        <Grid size={{ xs: 12, md: 6 }}>
                          <FeatureFlowHighlightCarousel cards={item.highlightCards ?? []} />
                        </Grid>
                      )
                    )}
                  </Grid>
                </Container>
              </Box>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    );
  }
);

FeatureFlowItemDetail.displayName = 'FeatureFlowItemDetail';
