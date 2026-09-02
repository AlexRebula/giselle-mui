import type { SxProps, Theme } from '@mui/material/styles';

// ── ScenarioBadge ─────────────────────────────────────────────────────────────

/** Pill label for scenario cards — soft tint of the phase color. */
export const scenarioBadgeSx = (color: string): SxProps<Theme> => ({
  display: 'inline-block',
  mb: 1,
  px: 1,
  py: 0.25,
  borderRadius: 0.75,
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: 0.8,
  color: `${color}.dark`,
  bgcolor: `rgba(var(--mui-palette-${color}-mainChannel) / 0.12)`,
});
