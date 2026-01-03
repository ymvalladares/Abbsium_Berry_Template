import { Paper, Typography, Box } from '@mui/material';

const PRIMARY = '#5E35B1';

export default function ClipFormatCard({ icon: Icon, title, subtitle, selected, onClick }) {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        height: '100%',
        p: 3,
        borderRadius: 4,
        cursor: 'pointer',
        border: '2px solid',
        borderColor: selected ? PRIMARY : 'divider',
        background: selected ? `linear-gradient(135deg, ${PRIMARY}22, ${PRIMARY}08)` : 'background.paper',
        transition: 'all .25s ease',
        '&:hover': {
          borderColor: PRIMARY
        }
      }}
    >
      {/* ICON + TITLE */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
        {/* ICON WRAPPER */}
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: selected ? `linear-gradient(135deg, ${PRIMARY}, #7E57C2)` : 'linear-gradient(135deg, #ECE7F6, #F3EFFF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <Icon size={24} color={selected ? '#fff' : PRIMARY} />
        </Box>

        <Box>
          <Typography fontWeight={800} fontSize={16}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, lineHeight: 1.4 }}>
        Optimized for this format.
      </Typography>
    </Paper>
  );
}
