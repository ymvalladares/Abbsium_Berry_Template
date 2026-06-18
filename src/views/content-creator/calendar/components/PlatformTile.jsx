import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconCheck } from '@tabler/icons-react';

export default function PlatformTile({ platform, selected, onToggle }) {
  const { id, name, icon: Icon, color, bg } = platform;
  return (
    <Box onClick={() => onToggle(id)} sx={{
      border: '1.5px solid', borderColor: selected ? color : 'divider',
      borderRadius: '10px', p: '8px 4px 6px', cursor: 'pointer',
      textAlign: 'center', position: 'relative', transition: 'all 0.15s',
      bgcolor: selected ? alpha(color, 0.04) : 'background.paper',
      '&:hover': { borderColor: color },
    }}>
      {selected && (
        <Box sx={{ position: 'absolute', top: 3, right: 3, width: 13, height: 13, bgcolor: '#4CAF50', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconCheck size={8} style={{ color: '#fff' }} />
        </Box>
      )}
      <Box sx={{ width: 28, height: 28, borderRadius: '8px', mx: 'auto', mb: '5px', bgcolor: selected ? alpha(color, 0.14) : bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={14} style={{ color }} />
      </Box>
      <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: selected ? color : 'text.secondary' }}>{name}</Typography>
    </Box>
  );
}
