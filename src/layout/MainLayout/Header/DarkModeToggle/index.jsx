import { useColorScheme, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import { IconSun, IconMoon } from '@tabler/icons-react';

export default function DarkModeToggle() {
  const theme = useTheme();
  const { mode, setMode } = useColorScheme();

  const isDark = mode === 'dark';

  const handleToggle = () => {
    setMode(isDark ? 'light' : 'dark');
  };

  return (
    <Box sx={{ ml: 2 }}>
      <Tooltip title={isDark ? 'Light Mode' : 'Dark Mode'}>
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            transition: 'all .2s ease-in-out',
            cursor: 'pointer',
            color: isDark ? theme.vars.palette.warning.dark : theme.vars.palette.primary.dark,
            background: isDark ? theme.vars.palette.warning.light : theme.vars.palette.primary.light,
            '&:hover': {
              color: isDark ? theme.vars.palette.warning.light : theme.vars.palette.primary.light,
              background: isDark ? theme.vars.palette.warning.dark : theme.vars.palette.primary.dark
            }
          }}
          onClick={handleToggle}
        >
          {isDark ? <IconSun stroke={1.5} size="20px" /> : <IconMoon stroke={1.5} size="20px" />}
        </Avatar>
      </Tooltip>
    </Box>
  );
}
