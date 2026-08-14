import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

// project imports
import MenuCard from './MenuCard';
import MenuList from '../MenuList';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import SimpleBar from 'ui-component/third-party/SimpleBar';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR DRAWER ||============================== //

function Sidebar() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const {
    state: { miniDrawer }
  } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawer = useMemo(() => {
    const drawerContent = (
      <>
        <MenuCard />
        <Stack direction="row" sx={{ justifyContent: 'center', mb: 2 }}>
          <Chip label={import.meta.env.VITE_APP_VERSION} size="large" color="default" />
        </Stack>
      </>
    );

    let drawerSX = { px: 0, mt: '20px' };
    if (drawerOpen) drawerSX = { px: 2.5, mt: 0 };

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}>
        <SimpleBar sx={{ flexGrow: 1, p: 0, pt: 1.5, '& .simplebar-track.simplebar-vertical': { top: 12 } }}>
          <Box sx={drawerSX}>
            <MenuList />
          </Box>
        </SimpleBar>
        {drawerOpen && <Box sx={{ px: 2.5, pt: 2 }}>{drawerContent}</Box>}
      </Box>
    );
  }, [drawerOpen]);

  const sidebarBg = 'theme.palette.background.paper';
  const sidebarBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';
  const sidebarShadow = isDark ? '4px 0 24px rgba(0,0,0,0.4)' : '4px 0 24px rgba(0,0,0,0.04)';

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      {downMD || (miniDrawer && drawerOpen) ? (
        <Drawer
          variant={downMD ? 'temporary' : 'persistent'}
          anchor="left"
          open={drawerOpen}
          onClose={() => handlerDrawerOpen(!drawerOpen)}
          slotProps={{
            paper: {
              sx: {
                mt: downMD ? 0 : 11,
                zIndex: 1099,
                width: drawerWidth,
                background: sidebarBg,
                color: 'text.primary',
                borderRight: `1px solid ${sidebarBorder}`,
                boxShadow: sidebarShadow,
                display: 'flex',
                flexDirection: 'column'
              }
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {downMD && logo}
          {drawer}
        </Drawer>
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
}

export default memo(Sidebar);
