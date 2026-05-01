import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { GiselleIcon } from '../giselle-icon/giselle-icon';
import { TimelineTwoColumn } from './timeline-two-column';
import type { TimelinePhase } from './types';

// ----------------------------------------------------------------------

const meta: Meta<typeof TimelineTwoColumn> = {
  component: TimelineTwoColumn,
  title: 'Components/TimelineTwoColumn',
};

export default meta;
type Story = StoryObj<typeof TimelineTwoColumn>;

// ----------------------------------------------------------------------
// Sample data — generic, non-personal
// ----------------------------------------------------------------------

/**
 * Read-only phases — column-placement invariant: at least one left and one right phase,
 * each with at least one milestone, so that the opposite-column positioning is verifiable.
 */
const READ_ONLY_PHASES: TimelinePhase[] = [
  {
    key: 1,
    title: 'Frontend Developer',
    description:
      'Built and maintained customer-facing e-commerce features in a fast-paced retail team.',
    date: 'Sep 2016 – May 2019',
    side: 'right',
    color: 'secondary',
    done: true,
    icon: <GiselleIcon icon="solar:cart-bold-duotone" width={20} />,
    details: [
      'React 15 → 16 migration',
      'Redux + Redux-Saga data layer',
      'Styled-components component library',
    ],
    platforms: [
      { icon: <GiselleIcon icon="logos:react" width={24} />, label: 'React' },
      { icon: <GiselleIcon icon="logos:redux" width={24} />, label: 'Redux' },
      { icon: <GiselleIcon icon="logos:sass" width={24} />, label: 'Sass' },
    ],
    milestones: [
      {
        date: 'Dec 2017',
        title: 'Checkout redesign shipped',
        icon: <GiselleIcon icon="solar:bag-bold" width={14} />,
        color: 'secondary',
        done: true,
      },
    ],
  },
  {
    key: 2,
    title: 'Senior Frontend Developer',
    description:
      'Delivered responsive dashboards and data-visualisation features for a fintech SaaS product.',
    date: 'Jun 2019 – Feb 2022',
    side: 'left',
    color: 'info',
    done: true,
    icon: <GiselleIcon icon="solar:chart-bold-duotone" width={20} />,
    details: ['Vue 3 + Composition API', 'D3.js for charts', 'Jest + Cypress test suite'],
    platforms: [
      { icon: <GiselleIcon icon="logos:vue" width={24} />, label: 'Vue' },
      { icon: <GiselleIcon icon="logos:d3" width={24} />, label: 'D3' },
      { icon: <GiselleIcon icon="logos:jest" width={24} />, label: 'Jest' },
    ],
    milestones: [
      {
        date: 'Mar 2020',
        title: 'Real-time analytics dashboard',
        icon: <GiselleIcon icon="solar:graph-bold" width={14} />,
        color: 'info',
        done: true,
      },
      {
        date: 'Nov 2021',
        title: 'Cypress coverage to 80 %',
        icon: <GiselleIcon icon="solar:shield-check-bold" width={14} />,
        color: 'success',
        done: true,
      },
    ],
  },
  {
    key: 3,
    title: 'Lead Frontend Engineer',
    description: 'Leading a cross-functional team building a patient-facing telehealth platform.',
    date: 'Mar 2022 – present',
    side: 'right',
    color: 'primary',
    active: true,
    activeLabel: 'Now',
    icon: <GiselleIcon icon="solar:user-bold-duotone" width={20} />,
    details: [
      'TypeScript + React 18',
      'Micro-frontend architecture (Module Federation)',
      'WCAG AA accessibility audit',
    ],
    platforms: [
      { icon: <GiselleIcon icon="logos:react" width={24} />, label: 'React' },
      { icon: <GiselleIcon icon="logos:typescript-icon" width={24} />, label: 'TypeScript' },
      { icon: <GiselleIcon icon="logos:aws" width={24} />, label: 'AWS' },
    ],
    milestones: [
      {
        date: 'Jan 2023',
        title: 'Patient portal v2 launched',
        icon: <GiselleIcon icon="solar:rocket-bold" width={14} />,
        color: 'success',
      },
      {
        date: 'Aug 2024',
        title: 'Design system open-sourced',
        icon: <GiselleIcon icon="solar:code-bold" width={14} />,
        color: 'primary',
      },
    ],
  },
];

/** Phases for the checklist demo — with a past-overdue entry and a future goal. */
const CHECKLIST_PHASES: TimelinePhase[] = [
  {
    key: 1,
    title: 'Discovery & Research',
    description: 'User interviews, competitor audit, and problem-space definition.',
    date: 'Jan 2024 – Feb 2024',
    side: 'left',
    color: 'secondary',
    icon: <GiselleIcon icon="solar:telescope-bold-duotone" width={20} />,
    milestones: [
      {
        date: 'Jan 2024',
        title: '12 user interviews',
        icon: <GiselleIcon icon="solar:users-group-rounded-bold" width={14} />,
        color: 'secondary',
      },
      {
        date: 'Feb 2024',
        title: 'Competitive audit report',
        icon: <GiselleIcon icon="solar:document-bold" width={14} />,
        color: 'info',
      },
    ],
  },
  {
    key: 2,
    title: 'Design & Prototype',
    description: 'Information architecture, wireframes, and interactive prototype sign-off.',
    date: 'Mar 2024 – Apr 2024',
    side: 'right',
    color: 'info',
    icon: <GiselleIcon icon="solar:pen-new-round-bold-duotone" width={20} />,
    milestones: [
      {
        date: 'Mar 2024',
        title: 'Wireframes approved',
        icon: <GiselleIcon icon="solar:layers-minimalistic-bold" width={14} />,
        color: 'info',
      },
    ],
  },
  {
    key: 3,
    title: 'Build & Ship',
    description: 'Engineering sprint, QA, and production release.',
    date: 'May 2024 – Jun 2024',
    side: 'left',
    color: 'primary',
    icon: <GiselleIcon icon="solar:rocket-bold-duotone" width={20} />,
    milestones: [
      {
        date: 'Jun 2024',
        title: 'Beta launch',
        icon: <GiselleIcon icon="solar:flag-bold" width={14} />,
        color: 'success',
      },
    ],
  },
];

// ----------------------------------------------------------------------

/**
 * Read-only timeline — left/right column mix, one active phase with pulsing ring,
 * milestones on each side to verify column-opposite placement.
 */
export const ReadOnly: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn phases={READ_ONLY_PHASES} />
    </Box>
  ),
  argTypes: {
    phases: { control: false },
    sx: { control: false },
  },
};

/**
 * Checklist mode — dots become interactive checkboxes.
 * Click phase or milestone dots to toggle done state.
 * Undone past-due items highlight in red automatically (dates in the past + checklist=true).
 */
export const ChecklistMode: Story = {
  render: () => (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn phases={CHECKLIST_PHASES} checklist />
    </Box>
  ),
  argTypes: {
    phases: { control: false },
    sx: { control: false },
  },
};

// ----------------------------------------------------------------------

/**
 * Viewed-state demo.
 *
 * Click the eye icon next to any phase card or milestone title to toggle its viewed state.
 * The icon fills green when viewed; clicking again marks it as not viewed.
 * State is managed locally — no external persistence.
 *
 * Uses a named component helper because the render function uses React hooks.
 */
function ViewedStateDemo() {
  const [viewedKeys, setViewedKeys] = useState<Set<string>>(new Set());

  function handleMarkViewed(key: string) {
    setViewedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', p: 3 }}>
      <TimelineTwoColumn
        phases={READ_ONLY_PHASES}
        viewedKeys={viewedKeys}
        onMarkViewed={handleMarkViewed}
      />
    </Box>
  );
}

/**
 * Viewed state — click the eye icon on any phase card or milestone to toggle viewed.
 * The icon turns green when viewed; clicking again un-marks it.
 */
export const ViewedState: Story = {
  render: () => <ViewedStateDemo />,
  argTypes: {
    phases: { control: false },
    sx: { control: false },
    viewedKeys: { control: false },
    onMarkViewed: { control: false },
  },
};

// ----------------------------------------------------------------------

const BREAKPOINTS = [
  { label: 'xs — 360px', width: 360 },
  { label: 'sm — 600px', width: 600 },
  { label: 'md — 900px', width: 900 },
  { label: 'lg — 1200px', width: 1200 },
];

/**
 * Timeline constrained to each MUI standard breakpoint width (xs → lg).
 * Shows how the layout adapts — or overflows — as available space shrinks.
 */
export const Responsive: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {BREAKPOINTS.map(({ label, width }) => (
        <Box key={width}>
          <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
            {label}
          </Typography>
          <Box sx={{ width, overflow: 'auto', border: '1px dashed', borderColor: 'divider' }}>
            <TimelineTwoColumn phases={READ_ONLY_PHASES} />
          </Box>
        </Box>
      ))}
    </Box>
  ),
  argTypes: {
    phases: { control: false },
    sx: { control: false },
  },
};
