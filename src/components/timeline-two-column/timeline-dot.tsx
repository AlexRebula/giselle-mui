import type { ReactNode } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import type { HighlightedPaletteKey } from './types';

import Box from '@mui/material/Box';

import { checkPop, pulseRing } from './animations';

// ----------------------------------------------------------------------

export type TimelineDotComponentProps = {
  /** Icon to render inside the dot. Accepts a `width` prop for sizing. */
  icon?: ReactNode;
  /** MUI palette key — controls background colour and shadow tint. @default 'primary' */
  color?: HighlightedPaletteKey;
  /**
   * Size variant.
   * - `'phase'`: 32px default, 40px when active.
   * - `'milestone'`: fixed 30px regardless of active state.
   * @default 'phase'
   */
  size?: 'phase' | 'milestone';
  /** Shows pulsing ring halo and enlarges to 40px (phase size only). */
  active?: boolean;
  /**
   * Done state — replaces icon with animated checkmark.
   * In checklist mode only; in read-only mode leave `undefined`.
   */
  done?: boolean;
  /**
   * Increment on each done/undone toggle to remount the icon wrapper
   * and restart the spring-pop animation cleanly.
   */
  animationKey?: number;
  /** Makes the dot clickable. Omit for decorative (read-only) dots. */
  onClick?: () => void;
  /** Adds keyboard interaction (Enter/Space) mirroring `onClick`. */
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  /** role for the dot element — e.g. `"checkbox"` in checklist mode. */
  role?: string;
  /** aria-checked value for checkbox role. */
  'aria-checked'?: boolean;
  /** Accessible label. */
  'aria-label'?: string;
  /** tabIndex — set to `0` when interactive. */
  tabIndex?: number;
  /** Forwarded to the root Box element. */
  className?: string;
  /** Additional styles forwarded to the root Box. Supports the sx-array-spread pattern. */
  sx?: SxProps<Theme>;
};

// ----------------------------------------------------------------------

function getDotSize(isMilestone: boolean, active: boolean): number {
  if (isMilestone) return 30;
  if (active) return 40;
  return 32;
}

function getIconSize(isMilestone: boolean, active: boolean): number {
  if (isMilestone) return 16;
  if (active) return 22;
  return 18;
}

function normaliseSx(sx: SxProps<Theme> | undefined): SxProps<Theme>[] {
  if (!sx) return [];
  return Array.isArray(sx) ? (sx as SxProps<Theme>[]) : [sx];
}

function DotInner({
  done,
  icon,
  animationKey,
  iconSize,
}: {
  done: boolean;
  icon: ReactNode;
  animationKey: number;
  iconSize: number;
}) {
  if (done) {
    return (
      <Box
        key={animationKey}
        component="svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        sx={{
          width: iconSize,
          height: iconSize,
          flexShrink: 0,
          animation: `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)`,
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </Box>
    );
  }

  return (
    <Box
      key={animationKey}
      sx={{
        display: 'flex',
        animation:
          animationKey > 0 ? `${checkPop} 0.36s cubic-bezier(0.34, 1.56, 0.64, 1)` : undefined,
      }}
    >
      {icon}
    </Box>
  );
}

// ----------------------------------------------------------------------

/**
 * Unified dot circle for the timeline component.
 *
 * Replaces both the inner content of MUI `<TimelineDot>` in `timeline-two-column.tsx`
 * and the badge circle in `MilestoneBadge`. The outer separator / positioning wrapper
 * remains in the parent.
 *
 * Two mutually exclusive inner states:
 * 1. `done` → animated checkmark SVG
 * 2. default → `icon` prop
 *
 * Active dots show a pulsing ring halo via `::after`.
 * In checklist mode pass `onClick`, `role`, `aria-checked`, `aria-label`, `tabIndex`.
 *
 * ## Overflow strategy
 *
 * The outer Box has `overflow: visible` so the `::after` ring (which extends 5 px
 * outside via `inset: -5`) is not clipped. An inner clip Box with `overflow: hidden`
 * and `border-radius: 50%` keeps the icon inside the circle shape.
 */
export function TimelineDot({
  icon,
  color = 'primary',
  size = 'phase',
  active = false,
  done = false,
  animationKey = 0,
  onClick,
  onKeyDown,
  role,
  'aria-checked': ariaChecked,
  'aria-label': ariaLabel,
  tabIndex,
  className,
  sx,
}: TimelineDotComponentProps) {
  const isMilestone = size === 'milestone';
  const dotSize = getDotSize(isMilestone, active);
  const iconSize = getIconSize(isMilestone, active);
  // Phase dot done = outlined (transparent + border). Milestone dots stay filled.
  const isDonePhase = done && !isMilestone;

  return (
    // Outer Box: controls size, position context, pulsing ::after ring, interaction.
    // overflow: visible is mandatory — the ring extends 5 px outside via inset: -5
    // and would be clipped by overflow: hidden.
    <Box
      className={className}
      role={role}
      aria-checked={ariaChecked}
      aria-label={ariaLabel}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
      data-active={active && !isMilestone ? 'true' : undefined}
      sx={
        [
          (theme) => ({
            position: 'relative',
            width: dotSize,
            height: dotSize,
            flexShrink: 0,
            overflow: 'visible',
            ...(onClick && {
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.75 },
            }),
            ...(tabIndex !== undefined && {
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main,
                outlineOffset: 3,
              },
            }),
          }),
          // Pulsing halo — phase dots only, active state.
          ...(active && !isMilestone
            ? [
                {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    inset: -5,
                    borderRadius: '50%',
                    border: '2px solid',
                    borderColor: `${color}.main`,
                    animation: `${pulseRing} 1.5s ease-in-out infinite`,
                  },
                },
              ]
            : []),
          ...normaliseSx(sx),
        ] as SxProps<Theme>
      }
    >
      {/* Inner clip Box: clips icon to circle shape; separate from outer so ::after ring is visible. */}
      <Box
        sx={(theme) => ({
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Always fill with palette color; phase dots go transparent+bordered when done.
          bgcolor: isDonePhase
            ? 'transparent'
            : (theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main),
          color: isDonePhase
            ? (theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main)
            : '#fff',
          // Phase done: outlined border (mirrors MUI TimelineDot variant="outlined").
          ...(isDonePhase && {
            border: '2px solid',
            borderColor: theme.vars!.palette[color]?.main ?? theme.vars!.palette.primary.main,
          }),
          // Milestone: white separator border + colored drop shadow.
          ...(isMilestone && {
            border: '2px solid',
            borderColor: 'background.paper',
            boxShadow: `0 2px 8px rgba(${
              theme.vars!.palette[color]?.mainChannel ??
              (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
            } / 0.5)`,
          }),
          ...(onClick &&
            isMilestone && {
              '&:hover': {
                boxShadow: `0 6px 20px rgba(${
                  theme.vars!.palette[color]?.mainChannel ??
                  (theme.vars!.palette.grey as unknown as Record<string, string>)['500Channel']
                } / 0.6)`,
              },
            }),
        })}
      >
        <DotInner done={done} icon={icon} animationKey={animationKey} iconSize={iconSize} />
      </Box>
    </Box>
  );
}
