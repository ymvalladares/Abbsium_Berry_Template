import { useState, useMemo } from 'react';
import { Box, Typography, TextField, Button, Autocomplete, Paper, InputAdornment, Collapse, Fade } from '@mui/material';
import Grid from '@mui/material/Grid';

import { IconScissors, IconLink, IconDeviceTv, IconDeviceMobile, IconSquare } from '@tabler/icons-react';

import ClipFormatCard from './ClipFormatCard';
import GeneratedClipsQueue from './GeneratedClipsQueue';

const DURATIONS = [
  { label: '0–30 seconds', value: '0-30' },
  { label: '30–60 seconds', value: '30-60' },
  { label: '60–90 seconds', value: '60-90' }
];

const CLIPS = [
  { label: '1 Clip', value: 1 },
  { label: '3 Clips', value: 3 },
  { label: '5 Clips', value: 5 }
];

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function Index() {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState(null);
  const [duration, setDuration] = useState(null);
  const [clips, setClips] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [startGeneration, setStartGeneration] = useState(false);

  const videoId = useMemo(() => getYoutubeId(url), [url]);

  const isValid = useMemo(() => Boolean(videoId && format && duration && clips), [videoId, format, duration, clips]);

  const handleGenerate = () => {
    if (!isValid || isGenerating) return;
    setStartGeneration(true);
    setIsGenerating(true);
  };

  return (
    <>
      {/* MAIN CONTAINER */}
      <Box
        sx={{
          width: '100%',
          maxWidth: { xs: '100%', md: '75%' },
          mx: 'auto',
          px: { xs: 0, md: 2 },
          mb: -3
        }}
      >
        {/* INTRO */}
        <Box sx={{ textAlign: 'center', mb: 1, mt: 1 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(94,53,177,0.25), rgba(94,53,177,0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconScissors size={18} color="#5E35B1" />
            </Box>

            <Typography fontSize={20} fontWeight={800}>
              Viral Clip Generator
            </Typography>
          </Box>

          <Typography
            sx={{
              mt: 0.5,
              fontSize: 14,
              color: 'text.secondary',
              maxWidth: 520,
              mx: 'auto'
            }}
          >
            Turn long videos into optimized short-form content for social media.
          </Typography>
        </Box>

        {/* FORM */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 0, md: 3 },
            backgroundColor: 'transparent'
          }}
        >
          <Grid container spacing={1.5}>
            {/* STEP 1 */}
            <Grid size={{ xs: 12 }}>
              <Typography fontWeight={700}>Step 1 · Video URL</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Video URL"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconLink size={18} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    fontSize: 16
                  }
                }}
              />
            </Grid>

            {/* VIDEO PREVIEW */}
            <Grid size={{ xs: 12 }}>
              <Collapse in={Boolean(videoId)}>
                <Fade in={Boolean(videoId)} timeout={250}>
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 1,
                      borderRadius: 4,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Video preview"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          border: 0
                        }}
                        allowFullScreen
                      />
                    </Box>
                  </Paper>
                </Fade>
              </Collapse>
            </Grid>

            {/* STEP 2 */}
            <Grid size={{ xs: 12 }}>
              <Typography fontWeight={700}>Step 2 · Clip Format</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <ClipFormatCard
                icon={IconDeviceTv}
                title="16:9"
                subtitle="YouTube · Landscape"
                selected={format === '16:9'}
                onClick={() => setFormat('16:9')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <ClipFormatCard
                icon={IconDeviceMobile}
                title="9:16"
                subtitle="TikTok · Reels · Shorts"
                selected={format === '9:16'}
                onClick={() => setFormat('9:16')}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <ClipFormatCard
                icon={IconSquare}
                title="1:1"
                subtitle="Instagram Feed"
                selected={format === '1:1'}
                onClick={() => setFormat('1:1')}
              />
            </Grid>

            {/* STEP 3 */}
            <Grid size={{ xs: 12 }}>
              <Typography fontWeight={700}>Step 3 · Clip Settings</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={DURATIONS}
                value={duration}
                onChange={(_, v) => setDuration(v)}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    fontSize: 16
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Clip Duration"
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
                PaperProps={{
                  sx: { borderRadius: 4 }
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={CLIPS}
                value={clips}
                onChange={(_, v) => setClips(v)}
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: 4,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 4,
                    fontSize: 16
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Number of Clips"
                    InputProps={{
                      ...params.InputProps
                    }}
                  />
                )}
                PaperProps={{
                  sx: { borderRadius: 4 }
                }}
              />
            </Grid>

            {/* STEP 4 */}
            <Grid size={{ xs: 12 }}>
              <Button
                fullWidth
                disabled={!isValid || isGenerating}
                onClick={handleGenerate}
                sx={{
                  mt: 2,
                  height: 52,
                  borderRadius: 4,
                  fontWeight: 700,
                  fontSize: 15,
                  textTransform: 'none',
                  color: 'white',
                  background: isValid ? 'linear-gradient(135deg, #5E35B1, #7C4DFF)' : 'rgba(94,53,177,0.25)'
                }}
              >
                {isGenerating ? 'Generating Clips…' : 'Generate Viral Clips'}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {startGeneration && (
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', md: '85%' }, mt: 4, mb: 4, mx: { xs: 0, md: 'auto' } }}>
          <GeneratedClipsQueue clipCount={clips?.value} duration={duration} format={format} onFinish={() => setIsGenerating(false)} />
        </Box>
      )}
    </>
  );
}
