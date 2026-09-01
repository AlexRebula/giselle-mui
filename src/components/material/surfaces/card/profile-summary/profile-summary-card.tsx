import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import type { ProfileSummaryCardProps } from './types';
import {
  avatarSx,
  profileSummaryCardPaperSx,
  roleSx,
  statCellSlotSx,
  statsRowSlotSx,
} from './profile-summary-card.styles';

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
    <Paper sx={[profileSummaryCardPaperSx, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
      <Avatar src={avatarSrc} alt={name} sx={avatarSx}>
        {name[0]}
      </Avatar>
      <Typography variant="h6">{name}</Typography>
      {role && (
        <Typography variant="body2" color="text.secondary" sx={roleSx}>
          {role}
        </Typography>
      )}
      <Box sx={statsRowSlotSx}>
        {stats.map((stat, index) => (
          <Box key={stat.label}>
            {index > 0 && <Divider orientation="vertical" flexItem />}
            <Box sx={statCellSlotSx}>
              <Typography variant="subtitle1">{stat.value}</Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
