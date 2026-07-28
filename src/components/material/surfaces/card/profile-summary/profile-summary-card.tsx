import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import type { ProfileSummaryCardProps } from './types';

// ----------------------------------------------------------------------

export function ProfileSummaryCard({
  name,
  role,
  avatarSrc,
  stats,
  sx,
  ...other
}: ProfileSummaryCardProps) {
  return (
    <Paper sx={[{ p: 3, textAlign: 'center' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Typography variant="h6">{name}</Typography>
    </Paper>
  );
}
