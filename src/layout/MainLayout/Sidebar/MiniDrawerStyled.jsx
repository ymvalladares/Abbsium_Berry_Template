// material-ui
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';

// project imports
import { drawerWidth } from 'store/constant';

function openedMixin(theme) {
  return {
    width: drawerWidth,
    borderRight: 'none',
    zIndex: 1099,
    background: theme.vars.palette.background.paper,
    overflowX: 'hidden',

    display: 'flex',
    flexDirection: 'column',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen + 200
    })
  };
}

function closedMixin(theme) {
  console.log('closedMixin theme:', theme);
  return {
    borderRight: 'none',
    zIndex: 1099,
    background: theme.vars.palette.background.paper,
    overflowX: 'hidden',
    width: 72,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: theme.palette.mode === 'dark' ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(0,0,0,0.04)',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen + 200
    })
  };
}

// ==============================|| DRAWER - MINI STYLED ||============================== //

const MiniDrawerStyled = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  borderRight: '0px',
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

export default MiniDrawerStyled;
