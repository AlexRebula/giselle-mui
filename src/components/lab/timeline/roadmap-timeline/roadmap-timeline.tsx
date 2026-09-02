'use client';

import { forwardRef } from 'react';

import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { resolveStepColor } from './roadmap-timeline.utils';
import {
  scenarioBadgeSx,
  stepContentSx,
  stepDateSx,
  stepDescriptionSx,
  stepDetailItemSx,
  stepDetailListSx,
  stepOpacitySx,
  stepTitleRowSx,
  stepTitleSx,
} from './roadmap-timeline.styles';
import type { RoadmapTimelineProps } from './types';

// ----------------------------------------------------------------------

/**
 * A lightweight, single-column timeline built directly on `@mui/lab`'s Timeline primitives — the documentation-page counterpart to `TimelineTwoColumn`.
 *
 * **Quality status (03 Sep 2026):** DoD 20/22 · Best practices not re-audited — SonarQube not verified (no tool access in this environment) · consuming-app validation not performed
 */
export const RoadmapTimeline = forwardRef<HTMLUListElement, RoadmapTimelineProps>(
  function RoadmapTimeline({ steps, ...other }, ref) {
    return (
      <Timeline ref={ref} {...other}>
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <TimelineItem key={step.key} position={step.side}>
              <TimelineSeparator>
                <TimelineDot color={resolveStepColor(step)} sx={stepOpacitySx(Boolean(step.done))}>
                  {step.icon}
                </TimelineDot>
                {!isLast && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent sx={stepContentSx(Boolean(step.isScenario))}>
                <Box sx={stepTitleRowSx}>
                  <Typography variant="subtitle2" sx={stepTitleSx}>
                    {step.title}
                  </Typography>
                  {step.isScenario && step.scenarioLabel && (
                    <Typography component="span" sx={scenarioBadgeSx}>
                      {step.scenarioLabel}
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" sx={stepDateSx}>
                  {step.date}
                </Typography>
                <Typography variant="body2" sx={stepDescriptionSx}>
                  {step.description}
                </Typography>
                {step.details && step.details.length > 0 && (
                  <Box component="ul" sx={stepDetailListSx}>
                    {step.details.map((detail, detailIndex) => (
                      <Box component="li" key={detailIndex} sx={stepDetailItemSx}>
                        {detail}
                      </Box>
                    ))}
                  </Box>
                )}
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  }
);

RoadmapTimeline.displayName = 'RoadmapTimeline';
