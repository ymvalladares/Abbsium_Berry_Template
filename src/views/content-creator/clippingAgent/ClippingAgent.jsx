import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Fade,
  CircularProgress,
  useMediaQuery,
  Divider,
  Chip
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconScissors,
  IconLink,
  IconX,
  IconChevronRight,
  IconChevronLeft,
  IconSparkles,
  IconDeviceMobile,
  IconDeviceTv,
  IconSquare,
  IconCheck,
  IconRefresh,
  IconArrowRight,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconClock,
  IconBulb,
  IconWand
} from '@tabler/icons-react';

import GeneratedClipsQueue from './GeneratedClipsQueue';
import { useNotification } from 'contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const getYoutubeId = (url) => {
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
};

const ACCENT = '#5E35B1';

const CLIP_COUNTS = [
  { value: 3, label: '3 clips' },
  { value: 5, label: '5 clips' },
  { value: 10, label: '10 clips' }
];

const ASPECT_RATIOS = [
  { id: '9:16', label: '9:16', sub: 'Vertical', icon: IconDeviceMobile },
  { id: '1:1', label: '1:1', sub: 'Square', icon: IconSquare },
  { id: '16:9', label: '16:9', sub: 'Landscape', icon: IconDeviceTv }
];

const TIPS = [
  { icon: IconBulb, text: 'Videos of 10-30 min generate the best clips', color: '#FF9800' },
  { icon: IconWand, text: 'AI automatically finds the most engaging moments', color: '#5E35B1' },
  { icon: IconClock, text: 'Average generation time: 2-5 minutes per clip', color: '#10b981' }
];

const PLATFORMS = [
  { icon: IconBrandTiktok, label: 'TikTok', color: '#000' },
  { icon: IconBrandInstagram, label: 'Reels', color: '#E4405F' },
  { icon: IconBrandYoutube, label: 'Shorts', color: '#FF0000' }
];

export default function ClippingAgent() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const notify = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [clipCount, setClipCount] = useState(5);
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [isGenerating, setIsGenerating] = useState(false);
  const [startGen, setStartGen] = useState(false);

  const videoId = useMemo(() => getYoutubeId(url), [url]);
  const canNext = step === 0 ? Boolean(videoId) : true;

  const handleGenerate = () => {
    setStartGen(true);
    setIsGenerating(true);
    notify.info('Clip generation started. This may take a few minutes.', 'Generating Clips');
  };

  const handlePublish = () => {
    notify.success('Opening post composer with generated clips', 'Ready to Publish');
    navigate('/platform/content/post');
  };

  const reset = () => {
    setUrl('');
    setClipCount(5);
    setAspectRatio('9:16');
    setIsGenerating(false);
    setStartGen(false);
    setStep(0);
  };

  return (
    <Box sx={{ py: { xs: 1, sm: 1.5 }, width: '100%' }}>

      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 36, height: 36, borderRadius: 2.5,
              background: `linear-gradient(135deg, ${ACCENT}, #7C4DFF)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 2px 12px ${alpha(ACCENT, 0.25)}`
            }}
          >
            <IconScissors size={16} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              Clipping Agent
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
              Turn long videos into viral short clips
            </Typography>
          </Box>
        </Stack>
        {startGen && (
          <Button size="small" startIcon={<IconRefresh size={14} />} onClick={reset}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: '0.75rem' }}>
            New
          </Button>
        )}
      </Stack>

      {/* ── Content Layout ── */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>

        {/* ── Main Card ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {!startGen && (
            <Box
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                borderRadius: 3,
                bgcolor: isDark ? '#111827' : '#ffffff',
                overflow: 'hidden',
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.15)' : '0 2px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 2.5 }, flex: 1 }}>

                {/* Step 0: URL */}
                {step === 0 && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.25 }}>
                        Paste your video URL
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.4 }}>
                        We'll find the best moments and turn them into short clips automatically
                      </Typography>
                    </Box>

                    <TextField
                      size="small"
                      fullWidth
                      placeholder="https://youtube.com/watch?v=..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconLink size={16} color={videoId ? '#10b981' : isDark ? '#64748b' : '#94a3b8'} />
                          </InputAdornment>
                        ),
                        endAdornment: url && (
                          <InputAdornment position="end">
                            <IconButton size="small" onClick={() => setUrl('')} sx={{ p: 0.5 }}>
                              <IconX size={14} />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          fontSize: '0.9rem',
                          bgcolor: isDark ? '#1e293b' : '#f8fafc',
                          '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0' },
                          '&:hover fieldset': { borderColor: ACCENT },
                          '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 2 },
                        }
                      }}
                    />

                    {videoId && (
                      <Fade in timeout={300}>
                        <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: isDark ? '#1e293b' : '#e2e8f0' }}>
                          <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: '#000' }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title="Preview"
                              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                              allowFullScreen
                            />
                          </Box>
                        </Box>
                      </Fade>
                    )}
                  </Stack>
                )}

                {/* Step 1: Quick Config */}
                {step === 1 && (
                  <Stack spacing={2.5}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.25 }}>
                        Quick settings
                      </Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        Choose how many clips and what format you need
                      </Typography>
                    </Box>

                    {/* Clip count */}
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                        Number of clips
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {CLIP_COUNTS.map((c) => {
                          const sel = clipCount === c.value;
                          return (
                            <Box
                              key={c.value}
                              onClick={() => setClipCount(c.value)}
                              sx={{
                                flex: 1,
                                py: 1.5,
                                borderRadius: 2.5,
                                border: '2px solid',
                                borderColor: sel ? ACCENT : isDark ? '#374151' : '#e2e8f0',
                                bgcolor: sel ? alpha(ACCENT, 0.06) : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                position: 'relative',
                                '&:hover': { borderColor: ACCENT },
                              }}
                            >
                              {sel && (
                                <Box sx={{ position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: '50%', bgcolor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconCheck size={9} color="#fff" />
                                </Box>
                              )}
                              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', color: sel ? ACCENT : 'text.primary', lineHeight: 1 }}>
                                {c.value}
                              </Typography>
                              <Typography sx={{ fontSize: '0.7rem', color: sel ? ACCENT : 'text.secondary', fontWeight: 600, mt: 0.2 }}>
                                {c.label}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>

                    {/* Aspect ratio */}
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1 }}>
                        Aspect ratio
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {ASPECT_RATIOS.map((r) => {
                          const sel = aspectRatio === r.id;
                          const Icon = r.icon;
                          return (
                            <Box
                              key={r.id}
                              onClick={() => setAspectRatio(r.id)}
                              sx={{
                                flex: 1,
                                p: 1.25,
                                borderRadius: 2.5,
                                border: '2px solid',
                                borderColor: sel ? ACCENT : isDark ? '#374151' : '#e2e8f0',
                                bgcolor: sel ? alpha(ACCENT, 0.06) : 'transparent',
                                cursor: 'pointer',
                                textAlign: 'center',
                                transition: 'all 0.2s',
                                position: 'relative',
                                '&:hover': { borderColor: ACCENT },
                              }}
                            >
                              {sel && (
                                <Box sx={{ position: 'absolute', top: 5, right: 5, width: 16, height: 16, borderRadius: '50%', bgcolor: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <IconCheck size={9} color="#fff" />
                                </Box>
                              )}
                              <Box sx={{
                                width: 28, height: 28, mx: 'auto', mb: 0.5, borderRadius: 1.5,
                                bgcolor: sel ? ACCENT : alpha(ACCENT, 0.1),
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                <Icon size={14} color={sel ? '#fff' : ACCENT} />
                              </Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: sel ? ACCENT : 'text.primary' }}>
                                {r.label}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.1 }}>
                                {r.sub}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Stack>
                    </Box>
                  </Stack>
                )}
              </Box>

              {/* ── Footer nav ── */}
              <Box
                sx={{
                  borderTop: '1px solid',
                  borderColor: isDark ? '#1e293b' : '#f1f5f9',
                  px: { xs: 2, sm: 2.5 },
                  py: { xs: 1.25, sm: 1.5 },
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Box>
                  {step > 0 && (
                    <Button
                      size="small"
                      startIcon={<IconChevronLeft size={14} />}
                      onClick={() => setStep((s) => s - 1)}
                      sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: '0.8rem' }}
                    >
                      Back
                    </Button>
                  )}
                </Box>
                <Box>
                  {step < 1 ? (
                    <Button
                      size="small"
                      endIcon={<IconArrowRight size={14} />}
                      onClick={() => setStep((s) => s + 1)}
                      disabled={!canNext}
                      variant="contained"
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        bgcolor: ACCENT,
                        borderRadius: 2,
                        px: 2.5,
                        fontSize: '0.8rem',
                        '&:disabled': { bgcolor: alpha(ACCENT, 0.3) }
                      }}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      startIcon={isGenerating ? <CircularProgress size={12} sx={{ color: '#fff' }} /> : <IconSparkles size={14} />}
                      disabled={!canNext || isGenerating}
                      onClick={handleGenerate}
                      variant="contained"
                      sx={{
                        px: 2.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        background: `linear-gradient(135deg, ${ACCENT}, #7C4DFF)`,
                        boxShadow: `0 2px 12px ${alpha(ACCENT, 0.25)}`,
                        '&:hover': { boxShadow: `0 4px 16px ${alpha(ACCENT, 0.35)}` }
                      }}
                    >
                      {isGenerating ? 'Generating...' : `Generate ${clipCount} clips`}
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* ── Results ── */}
          {startGen && (
            <GeneratedClipsQueue
              clipCount={clipCount}
              duration={null}
              format={aspectRatio}
              platforms={['tiktok', 'reels', 'shorts']}
              aiFeatures={['captions', 'hooks', 'scoring']}
              onFinish={() => setIsGenerating(false)}
              onPublish={handlePublish}
            />
          )}
        </Box>

        {/* ── Side Panel (lg+) - Config ── */}
        {!startGen && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              width: 280,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                borderRadius: 3,
                bgcolor: isDark ? '#111827' : '#ffffff',
                p: 2.5,
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.15)' : '0 2px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2 }}>
                How it works
              </Typography>

              <Stack spacing={1.5} sx={{ flex: 1 }}>
                {TIPS.map((tip, i) => {
                  const Icon = tip.icon;
                  return (
                    <Stack key={i} direction="row" spacing={1.25} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 28, height: 28, borderRadius: 2, flexShrink: 0,
                          bgcolor: alpha(tip.color, 0.1),
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >
                        <Icon size={14} color={tip.color} />
                      </Box>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.4, pt: 0.3 }}>
                        {tip.text}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>
                Publish to
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {PLATFORMS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <Chip
                      key={i}
                      icon={<Icon size={12} />}
                      label={p.label}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        bgcolor: alpha(p.color, isDark ? 0.15 : 0.06),
                        color: p.color,
                        '& .MuiChip-icon': { color: p.color }
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        )}

        {/* ── Side Panel (lg+) - Generation ── */}
        {startGen && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              width: 280,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: 100,
                height: '100%',
                border: '1px solid',
                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                borderRadius: 3,
                bgcolor: isDark ? '#111827' : '#ffffff',
                p: 2.5,
                boxShadow: isDark ? '0 2px 16px rgba(0,0,0,0.15)' : '0 2px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 2 }}>
                Generation info
              </Typography>

              <Stack spacing={1.5} sx={{ flex: 1 }}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Clips</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{clipCount}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Format</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>{aspectRatio}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>Est. time</Typography>
                  <Typography sx={{ fontSize: '0.78rem', fontWeight: 700 }}>~{clipCount * 30}s</Typography>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1.5 }}>
                Publish to
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {PLATFORMS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <Chip
                      key={i}
                      icon={<Icon size={12} />}
                      label={p.label}
                      size="small"
                      sx={{
                        borderRadius: 2,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        bgcolor: alpha(p.color, isDark ? 0.15 : 0.06),
                        color: p.color,
                        '& .MuiChip-icon': { color: p.color }
                      }}
                    />
                  );
                })}
              </Stack>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
