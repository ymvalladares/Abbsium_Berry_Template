import { useColorScheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { IconSun, IconMoon, IconDeviceDesktop } from '@tabler/icons-react';

export default function ThemeMode() {
  const { colorScheme, mode, setMode } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleChange = (_event, newMode) => {
    if (newMode !== null) {
      setMode(newMode);
    }
  };

  return (
    <Stack sx={{ pl: 2, pb: 2, pr: 4, gap: 2.5, mt: 1 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '0.02em' }}>THEME MODE</Typography>
      <ToggleButtonGroup
        value={mode || 'light'}
        exclusive
        onChange={handleChange}
        color="primary"
        size="small"
        fullWidth
        sx={{
          gap: 0.5,
          bgcolor: isDark ? '#1e293b' : 'grey.50',
          borderRadius: 2,
          p: 0.35,
          '& .MuiToggleButton-root': {
            py: 1.25,
            gap: 0.75,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 1.5,
            border: 'none',
            color: isDark ? '#94a3b8' : 'text.secondary',
            '&.Mui-selected': {
              bgcolor: isDark ? '#334155' : '#fff',
              color: isDark ? '#e2e8f0' : 'text.primary',
              boxShadow: isDark ? '0 1px 3px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.08)',
              '&:hover': { bgcolor: isDark ? '#3b4a63' : '#fff' }
            },
            '&:hover': { bgcolor: isDark ? '#2a364a' : 'grey.100' }
          }
        }}
      >
        <ToggleButton value="light">
          <IconSun size={18} />
          Light
        </ToggleButton>
        <ToggleButton value="dark">
          <IconMoon size={18} />
          Dark
        </ToggleButton>
        <ToggleButton value="system">
          <IconDeviceDesktop size={18} />
          System
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}
