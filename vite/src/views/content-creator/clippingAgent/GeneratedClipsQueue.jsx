import { useEffect, useState } from 'react';
import { Box, Typography, Paper, LinearProgress, IconButton, Stack, Fade } from '@mui/material';
import Grid from '@mui/material/Grid';

import { IconDownload, IconBookmark, IconUpload, IconPlayerPlay } from '@tabler/icons-react';

const PRIMARY = '#5E35B1';

export default function GeneratedClipsQueue({ clipCount, duration, format, onFinish }) {
  const [clips, setClips] = useState([]);

  useEffect(() => {
    if (!clipCount) return;

    const initial = Array.from({ length: clipCount }).map((_, i) => ({
      id: i,
      progress: 0,
      status: 'generating'
    }));

    setClips(initial);

    initial.forEach((clip, index) => {
      const interval = setInterval(
        () => {
          setClips((prev) =>
            prev.map((c) => {
              if (c.id !== clip.id) return c;
              const next = Math.min(c.progress + 10, 100);
              return {
                ...c,
                progress: next,
                status: next >= 100 ? 'ready' : 'generating'
              };
            })
          );
        },
        600 + index * 200
      );

      setTimeout(() => clearInterval(interval), 6000 + index * 1200);
    });

    setTimeout(onFinish, 7000 + clipCount * 1200);
  }, [clipCount, duration, format, onFinish]);

  if (!clips.length) return null;

  return (
    <Fade in>
      <Box>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography fontSize={18} fontWeight={800}>
            Generated Clips
          </Typography>
          <Typography fontSize={13} color="text.secondary">
            Clips are currently being generated. Please wait…
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {clips.map((clip, i) => (
            <Grid key={clip.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: clip.status === 'ready' ? PRIMARY : 'divider',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Box
                  sx={{
                    height: 160,
                    borderRadius: 3,
                    background: 'rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <IconPlayerPlay size={36} />
                </Box>

                <Typography fontWeight={700}>Clip #{i + 1}</Typography>
                <Typography fontSize={13} color="text.secondary">
                  {format} · {duration?.label}
                </Typography>

                {clip.status !== 'ready' ? (
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={clip.progress}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: 'rgba(94,53,177,0.15)',
                        '& .MuiLinearProgress-bar': { backgroundColor: PRIMARY }
                      }}
                    />
                  </Box>
                ) : (
                  <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                    <IconButton size="small">
                      <IconDownload size={18} />
                    </IconButton>
                    <IconButton size="small">
                      <IconBookmark size={18} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: PRIMARY }}>
                      <IconUpload size={18} />
                    </IconButton>
                  </Stack>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
}
