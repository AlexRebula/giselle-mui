import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Decorator } from '@storybook/react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { demoNavBarRowSx, demoNavBarSx, navSentinelSx } from './nav-adjacent-decorator.styles';

// ----------------------------------------------------------------------
//
// STORY-ONLY DEMONSTRATION HARNESS — issue #171.
//
// giselle-mui must never depend on any consuming app's own code, so this is
// NOT a port of any specific app's real nav component. It only mimics the
// general *shape* of "a page-level nav appears once you scroll past a
// sentinel, and highlights whichever section is currently active" — a
// pattern a consuming app's own home-page scroll provider would typically
// expose — so that `FeatureFlowSection`'s canonical story can be exercised
// inside a comparable context. It is intentionally:
//
//   - colocated with the story (not exported from `src/index.ts`)
//   - a minimal, clearly giselle-mui-owned context — not a replica of any
//     specific app's internal provider API
//
// Do not import this outside `feature-flow-section.stories.tsx`.
//
// ----------------------------------------------------------------------

export interface NavAdjacentContextValue {
  /** True once the sentinel above the story content has scrolled out of view. */
  isNavVisible: boolean;
  /** id of whichever demo "section" is currently marked active. */
  activeSectionId: string | null;
  setActiveSectionId: (id: string | null) => void;
}

/** id assigned to the one demo "section" this harness ever tracks as active. */
const DEMO_SECTION_ID = 'feature-flow';

const NavAdjacentContext = createContext<NavAdjacentContextValue | null>(null);

/** Reads the demo nav/scroll context. Throws outside `NavAdjacentDecorator`. */
export function useNavAdjacentContext(): NavAdjacentContextValue {
  const value = useContext(NavAdjacentContext);
  if (!value) {
    throw new Error('useNavAdjacentContext must be used within NavAdjacentDecorator');
  }
  return value;
}

// ----------------------------------------------------------------------

/**
 * Sentinel element — a consuming app's real nav typically appears once the
 * hero/header has scrolled out of view. This zero-height marker stands in
 * for that trigger point: an `IntersectionObserver` toggles visibility
 * whenever it leaves the viewport.
 */
function NavSentinel({
  onVisibilityChange,
}: {
  onVisibilityChange: (pastSentinel: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => onVisibilityChange(entry ? !entry.isIntersecting : false),
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [onVisibilityChange]);

  return (
    <Box ref={ref} data-testid="nav-adjacent-sentinel" aria-hidden="true" sx={navSentinelSx} />
  );
}
NavSentinel.displayName = 'NavSentinel';

/**
 * A small floating bar driven entirely by `NavAdjacentContext` — the
 * nav-like UI element the sentinel above toggles. Deliberately simple: this
 * demonstrates the shape of "nav appears + highlights the active section",
 * nothing more.
 */
function DemoFloatingNav() {
  const { isNavVisible, activeSectionId } = useNavAdjacentContext();

  if (!isNavVisible) return null;

  return (
    <Box data-testid="nav-adjacent-bar" sx={demoNavBarSx}>
      <Stack direction="row" spacing={1.5} sx={demoNavBarRowSx}>
        <Typography variant="overline" color="text.disabled">
          Demo nav (giselle-mui story harness)
        </Typography>
        <Chip
          size="small"
          label={activeSectionId ? `active: ${activeSectionId}` : 'no active section'}
          color={activeSectionId ? 'primary' : 'default'}
          variant="outlined"
        />
      </Stack>
    </Box>
  );
}
DemoFloatingNav.displayName = 'DemoFloatingNav';

function NavAdjacentProvider({ children }: { children: ReactNode }) {
  const [isNavVisible, setIsNavVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // Once the sentinel scrolls out of view, the demo nav appears AND marks the
  // one section this harness knows about as active — mirroring the shape a
  // real scroll provider exposes (nav visibility and active-section tracking
  // move together), without requiring any change to `FeatureFlowSection`'s
  // own API.
  const handleSentinelVisibilityChange = (pastSentinel: boolean) => {
    setIsNavVisible(pastSentinel);
    setActiveSectionId(pastSentinel ? DEMO_SECTION_ID : null);
  };

  return (
    <NavAdjacentContext.Provider value={{ isNavVisible, activeSectionId, setActiveSectionId }}>
      <NavSentinel onVisibilityChange={handleSentinelVisibilityChange} />
      <DemoFloatingNav />
      {children}
    </NavAdjacentContext.Provider>
  );
}
NavAdjacentProvider.displayName = 'NavAdjacentProvider';

/**
 * Storybook decorator applying the nav-adjacent demonstration harness around
 * a story. Attach it only to the specific story that needs it (the
 * canonical story) rather than `meta.decorators`, so every other story in
 * this file is unaffected.
 *
 * @example
 * ```tsx
 * export const Canonical: Story = {
 *   decorators: [withNavAdjacentContext],
 *   render: () => <FeatureFlowSection ... />,
 * };
 * ```
 */
export const withNavAdjacentContext: Decorator = (Story) => (
  <NavAdjacentProvider>
    <Story />
  </NavAdjacentProvider>
);
