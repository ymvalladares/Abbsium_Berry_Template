import { Box, Paper, Typography } from '@mui/material';
import { IconInbox, IconRewindBackward60, IconVideo } from '@tabler/icons-react';

const PRIMARY = '#5E35B1';
const TYPES = [
  {
    id: 'post',
    label: 'Post',
    desc: 'Photo with caption',
    icon: IconInbox,
    color: '#673AB7'
  },
  {
    id: 'reel',
    label: 'Reel',
    desc: 'Short vertical video',
    icon: IconRewindBackward60,
    color: '#673AB7'
  },
  {
    id: 'video',
    label: 'Video',
    desc: 'Long or short video',
    icon: IconVideo,
    color: '#673AB7'
  }
];

export default function ContentTypeStep({ value, onChange }) {
  return (
    <>
      <Typography fontWeight={600} mb={2}>
        2. Content type
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
          gap: 7,
          mb: 4
        }}
      >
        {TYPES.map((t) => {
          const active = value === t.id;
          const mainColor = active ? t.color : '#EBE8FA';
          const Icon = t.icon;

          return (
            <Paper
              key={t.id}
              onClick={() => onChange(t.id)}
              sx={{
                p: 3,
                cursor: 'pointer',
                borderRadius: 3,
                border: '2.5px solid',
                borderColor: mainColor,
                textAlign: 'center',
                background: active ? `linear-gradient(135deg, ${PRIMARY}22, ${PRIMARY}08)` : 'background.paper',
                transition: '0.25s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              {/* ICON BOX */}
              <Box
                sx={{
                  p: 1,
                  mb: 1,
                  mx: 'auto',
                  width: 'fit-content',
                  borderRadius: 2,
                  bgcolor: mainColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Icon size={22} stroke={2} color="#FFFFFF" />
              </Box>

              <Typography fontWeight={600} color="text.secondary">
                {t.label}
              </Typography>

              <Typography fontWeight={600} fontSize={11} color="text.secondary">
                {t.desc}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    </>
  );
}
