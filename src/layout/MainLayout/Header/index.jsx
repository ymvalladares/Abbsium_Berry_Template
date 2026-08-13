import { useTheme, useColorScheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';

import LogoSection from '../LogoSection';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

import { IconMenu2 } from '@tabler/icons-react';

import { useAuth } from '../../../contexts/AuthContext';
import LanguageSelector from './LanguagePopover/LanguageSelector';

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { mode } = useColorScheme();
  const isDark = mode === 'dark';

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>

        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            color: isDark ? theme.vars.palette.primary[200] : theme.vars.palette.primary.dark,
            background: isDark ? theme.vars.palette.primary[800] : theme.vars.palette.primary.light,
            '&:hover': {
              color: isDark ? theme.vars.palette.primary.light : theme.vars.palette.primary[800],
              background: isDark ? theme.vars.palette.primary[800] : theme.vars.palette.primary.dark
            }
          }}
          onClick={() => handlerDrawerOpen(!drawerOpen)}
        >
          <IconMenu2 stroke={1.5} size="20px" />
        </Avatar>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {isAuthenticated ? (
        <>
          <LanguageSelector />
          <NotificationSection />
          <ProfileSection />
        </>
      ) : (
        <Button
          component={Link}
          to="/login"
          sx={{
            border: '2.5px solid',
            borderColor: 'primary.light',
            borderRadius: '8px',
            color: 'primary.main',
            fontWeight: 'bold'
          }}
          variant="outlined"
        >
          Login
        </Button>
      )}
    </>
  );
}
