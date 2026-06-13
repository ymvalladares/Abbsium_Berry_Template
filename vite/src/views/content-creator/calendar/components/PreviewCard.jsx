import { Box, Typography, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AutoAwesome } from '@mui/icons-material';
import { PLATFORMS } from '../constants';

export default function PreviewCard({ title, platforms }) {
  if (!title && platforms.length === 0) return null;
  return (
    <Box sx={{ border: '1.5px solid', borderColor: 'divider', borderRadius: '12px', overflow: 'hidden', mt: 1.5 }}>
      <Box sx={{ height: 3, background: 'linear-gradient(90deg,#5E35B1,#9C72F8)' }} />
      <Box sx={{ p: '10px 14px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.8 }}>
          <AutoAwesome sx={{ fontSize: 12, color: '#5E35B1' }} />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' }}>Preview</Typography>
        </Box>
        {title && <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, mb: 0.8 }}>{title}</Typography>}
        <Box sx={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {platforms.map(pid => {
            const p = PLATFORMS.find(x => x.id === pid); if (!p) return null;
            const Icon = p.icon;
            return (
              <Tooltip key={pid} title={p.name} arrow>
                <Box sx={{ width: 26, height: 26, borderRadius: '7px', bgcolor: alpha(p.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} style={{ color: p.color }} />
                </Box>
              </Tooltip>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
