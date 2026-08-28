import type { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

/** `sx` for the demo floating nav bar (`DemoFloatingNav`) — story-only harness, see nav-adjacent-decorator.tsx. */
export const demoNavBarSx: SxProps<Theme> = {
  position: 'sticky',
  top: 0,
  zIndex: (theme) => theme.zIndex.appBar,
  py: 1.5,
  px: 3,
  bgcolor: 'background.paper',
  borderBottom: '1px solid',
  borderColor: 'divider',
};
