import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../../../material/data-display/icon/giselle';
import { MetricCard } from '../../../material/surfaces/card/metric';
import { TechIconStrip } from '../../../material/data-display/icon/tech-strip';
import { detailPanelSx } from '../feature-flow-section.styles';
import { isRichLongDescription } from '../feature-flow-section.utils';
import { FeatureFlowHighlightCarousel } from '../highlight-carousel';
import type { FeatureFlowItemDetailProps } from './types';

// Re-export — keeps `import { FeatureFlowItemDetailProps } from
// './feature-flow-item-detail'` working alongside the folder barrel.
export type { FeatureFlowItemDetailProps } from './types';

// ----------------------------------------------------------------------

/**
 * `FeatureFlowItemDetail` — the expanded 2-column panel rendered below the
 * main grid when an item with expansion data is clicked. Not exported from
 * the package barrel: an implementation detail of `FeatureFlowSection`.
 *
 * Left column: icon + title, metrics grid, long description, technology
 * chips. Right column: the highlight-card carousel (when present).
 */
export const FeatureFlowItemDetail = React.forwardRef<HTMLDivElement, FeatureFlowItemDetailProps>(
  function FeatureFlowItemDetail({ item, sx, ...other }, ref) {
    const cards = item.highlightCards ?? [];

    return (
      <Box ref={ref} sx={[detailPanelSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
        <Container>
          <Grid container spacing={{ xs: 4, md: 8 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack spacing={4}>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <GiselleIcon
                    icon={item.icon}
                    width={44}
                    sx={{ color: 'primary.main' }}
                    aria-hidden="true"
                  />
                  <Typography variant="h3">{item.title}</Typography>
                </Stack>

                {item.metrics?.length ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2,
                      gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: `repeat(${Math.min(item.metrics.length, 3)}, 1fr)`,
                      },
                    }}
                  >
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
                      />
                    ))}
                  </Box>
                ) : null}

                {isRichLongDescription(item) ? (
                  item.longDescription
                ) : (
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
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

            {cards.length > 0 && (
              <Grid size={{ xs: 12, md: 6 }}>
                <FeatureFlowHighlightCarousel cards={cards} />
              </Grid>
            )}
          </Grid>
        </Container>
      </Box>
    );
  }
);

FeatureFlowItemDetail.displayName = 'FeatureFlowItemDetail';
