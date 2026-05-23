import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
  Switch,
  Fade,
  IconButton,
  CircularProgress,
  Divider,
  Tooltip
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  IconScissors,
  IconLink,
  IconDeviceTv,
  IconDeviceMobile,
  IconSquare,
  IconCheck,
  IconRefresh,
  IconChevronRight,
  IconChevronLeft,
  IconSparkles,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconTypography,
  IconFlame,
  IconChartBar,
  IconWand,
  IconX,
  IconMoodSmile,
  IconLanguage,
  IconPalette,
  IconHash,
  IconClock,
  IconTarget,
  IconVolume,
  IconPhoto,
  IconCalendar,
  IconMessage,
  IconBrandWhatsapp,
  IconBrandTelegram
} from '@tabler/icons-react';

import GeneratedClipsQueue from './GeneratedClipsQueue';

const FORMATS = [
  { id: '9:16', label: '9:16', desc: 'TikTok · Reels · Shorts', icon: IconDeviceMobile },
  { id: '1:1', label: '1:1', desc: 'Instagram Feed', icon: IconSquare },
  { id: '16:9', label: '16:9', desc: 'YouTube', icon: IconDeviceTv }
];

const PLATFORMS = [
  { id: 'tiktok', name: 'TikTok', icon: IconBrandTiktok, color: '#010101' },
  { id: 'reels', name: 'Reels', icon: IconBrandInstagram, color: '#C13584' },
  { id: 'shorts', name: 'Shorts', icon: IconBrandYoutube, color: '#FF0000' }
];

const DURATIONS = [
  { label: '15–30s', value: '15-30' },
  { label: '30–60s', value: '30-60' },
  { label: '60–90s', value: '60-90' }
];

const CLIP_OPTIONS = [1, 3, 5, 10];

const TONES = [
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'educational', label: 'Educational', emoji: '📚' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭' },
  { id: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { id: 'casual', label: 'Casual', emoji: '☕' }
];

const CAPTION_STYLES = [
  { id: 'hormozi', label: 'Hormozi', desc: 'Bold · Yellow · Animated', color: '#FBBF24' },
  { id: 'minimal', label: 'Minimal', desc: 'Clean · White · Static', color: '#94A3B8' },
  { id: 'karaoke', label: 'Karaoke', desc: 'Word highlight', color: '#EC4899' },
  { id: 'neon', label: 'Neon', desc: 'Glow · Gradient', color: '#8B5CF6' }
];

const LANGUAGES = [
  { id: 'en', label: 'EN', flag: '🇺🇸' },
  { id: 'es', label: 'ES', flag: '🇪🇸' },
  { id: 'pt', label: 'PT', flag: '🇧🇷' },
  { id: 'fr', label: 'FR', flag: '🇫🇷' },
  { id: 'de', label: 'DE', flag: '🇩🇪' },
  { id: 'ar', label: 'AR', flag: '🇸🇦' }
];

const AI_FEATURES = [
  { id: 'captions', label: 'Auto Captions', icon: IconTypography, desc: 'Burn subtitles', color: '#3B82F6' },
  { id: 'hooks', label: 'Hook Detection', icon: IconFlame, desc: 'Find viral moments', color: '#EF4444' },
  { id: 'scoring', label: 'Viral Score', icon: IconChartBar, desc: 'Rate engagement', color: '#F59E0B' },
  { id: 'smartcuts', label: 'Smart Cuts', icon: IconWand, desc: 'AI transitions', color: '#8B5CF6' },
  { id: 'broll', label: 'B-Roll Insert', icon: IconPhoto, desc: 'Add stock footage', color: '#10B981' },
  { id: 'music', label: 'Trending Audio', icon: IconVolume, desc: 'Match trending sounds', color: '#F43F5E' },
  { id: 'thumbnails', label: 'Auto Thumbnail', icon: IconPhoto, desc: 'Generate per clip', color: '#0EA5E9' },
  { id: 'abtest', label: 'A/B Hooks', icon: IconTarget, desc: '3 hook variants', color: '#F97316' }
];

const CTA_TEMPLATES = [
  { id: 'follow', label: 'Follow for more', icon: IconTarget },
  { id: 'link', label: 'Link in bio', icon: IconLink },
  { id: 'comment', label: 'Comment below', icon: IconMessage },
  { id: 'share', label: 'Share this', icon: IconBrandTelegram },
  { id: 'dm', label: 'DM me', icon: IconBrandWhatsapp },
  { id: 'none', label: 'No CTA', icon: IconX }
];

const STEP_LABELS = ['Video', 'Format', 'Style', 'AI', 'Review'];

const getYoutubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

export default function ClippingAgent() {
  const [step, setStep] = useState(0);
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState(null);
  const [platforms, setPlatforms] = useState(['tiktok', 'reels', 'shorts']);
  const [duration, setDuration] = useState(null);
  const [clips, setClips] = useState(null);
  const [tone, setTone] = useState('energetic');
  const [captionStyle, setCaptionStyle] = useState('hormozi');
  const [language, setLanguage] = useState('en');
  const [cta, setCta] = useState('follow');
  const [brandKit, setBrandKit] = useState(true);
  const [aiFeatures, setAiFeatures] = useState(['captions', 'hooks', 'scoring']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startGeneration, setStartGeneration] = useState(false);

  const videoId = useMemo(() => getYoutubeId(url), [url]);

  const canNext = step === 0 ? Boolean(videoId) : step === 1 ? Boolean(format) : step === 2 ? Boolean(duration && clips) : true;

  const togglePlatform = (id) => setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleAi = (id) => setAiFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const handleGenerate = () => {
    if (isGenerating) return;
    setStartGeneration(true);
    setIsGenerating(true);
  };

  const reset = () => {
    setUrl('');
    setFormat(null);
    setDuration(null);
    setClips(null);
    setPlatforms(['tiktok', 'reels', 'shorts']);
    setTone('energetic');
    setCaptionStyle('hormozi');
    setLanguage('en');
    setCta('follow');
    setBrandKit(true);
    setAiFeatures(['captions', 'hooks', 'scoring']);
    setIsGenerating(false);
    setStartGeneration(false);
    setStep(0);
  };

  return (
    <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 780 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.4rem' }}>Clipping Agent</Typography>
          {startGeneration && (
            <Button size="small" startIcon={<IconRefresh size={16} />} onClick={reset} sx={{ textTransform: 'none', fontWeight: 600 }}>
              New
            </Button>
          )}
        </Stack>

        <Stepper activeStep={step} sx={{ mb: 2, '& .MuiStepLabel-label': { fontSize: '0.8rem', fontWeight: 600 } }}>
          {STEP_LABELS.map((l, i) => (
            <Step key={l}>
              <StepLabel
                onClick={() => {
                  if (!startGeneration && i < step) setStep(i);
                }}
                icon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: i === step ? '#5E35B1' : i < step ? '#4CAF50' : '#e0e0e0',
                      color: i <= step ? '#fff' : '#999',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {i < step ? <IconCheck size={12} /> : i + 1}
                  </Box>
                }
              >
                {l}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' }}>
          <Box sx={{ p: 3 }}>
            {step === 0 && (
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, alpha(#5E35B1, 0.08), alpha(#7C4DFF, 0.04))',
                    border: '1px solid',
                    borderColor: alpha('#5E35B1', 0.12)
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconLink size={20} style={{ color: '#5E35B1' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.15 }}>Paste your video URL</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        We'll analyze and extract the best moments
                      </Typography>
                    </Box>
                  </Stack>
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
                        <IconLink size={16} style={{ color: videoId ? '#4CAF50' : '#999' }} />
                      </InputAdornment>
                    ),
                    endAdornment: url && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setUrl('')}>
                          <IconX size={14} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                {videoId && (
                  <Fade in timeout={400}>
                    <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
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

            {step === 1 && (
              <Stack spacing={2}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                  {FORMATS.map((f) => {
                    const sel = format === f.id;
                    const Icon = f.icon;
                    return (
                      <Box
                        key={f.id}
                        onClick={() => setFormat(f.id)}
                        sx={{
                          position: 'relative',
                          p: 1.5,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: sel ? '#5E35B1' : 'divider',
                          bgcolor: sel ? alpha('#5E35B1', 0.04) : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': { borderColor: '#5E35B1', bgcolor: alpha('#5E35B1', 0.06) },
                          minHeight: 68,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5
                        }}
                      >
                        {sel && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: '#4CAF50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconCheck size={9} style={{ color: '#fff' }} />
                          </Box>
                        )}
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            bgcolor: sel ? '#5E35B1' : alpha('#5E35B1', 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={16} style={{ color: sel ? '#fff' : '#5E35B1' }} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{f.label}</Typography>
                        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{f.desc}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider />

                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>PUBLISH TO</Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
                    {PLATFORMS.map((p) => {
                      const sel = platforms.includes(p.id);
                      const Icon = p.icon;
                      return (
                        <Box
                          key={p.id}
                          onClick={() => togglePlatform(p.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            p: 1,
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: sel ? p.color : 'divider',
                            bgcolor: sel ? alpha(p.color, 0.06) : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: p.color, bgcolor: alpha(p.color, 0.08) }
                          }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
                              bgcolor: sel ? p.color : alpha(p.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Icon size={14} style={{ color: sel ? '#fff' : p.color }} />
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', flex: 1 }}>{p.name}</Typography>
                          {sel && (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: '50%',
                                bgcolor: '#4CAF50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconCheck size={9} style={{ color: '#fff' }} />
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
            )}

            {step === 2 && (
              <Stack spacing={2}>
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>DURATION</Typography>
                  <Stack direction="row" spacing={1}>
                    {DURATIONS.map((d) => {
                      const sel = duration?.value === d.value;
                      return (
                        <Box
                          key={d.value}
                          onClick={() => setDuration(d)}
                          sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: sel ? '#5E35B1' : 'divider',
                            bgcolor: sel ? alpha('#5E35B1', 0.04) : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#5E35B1' }
                          }}
                        >
                          <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: sel ? '#5E35B1' : 'text.primary' }}>
                            {d.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>NUMBER OF CLIPS</Typography>
                  <Stack direction="row" spacing={1}>
                    {CLIP_OPTIONS.map((c) => {
                      const sel = clips?.value === c;
                      return (
                        <Box
                          key={c}
                          onClick={() => setClips({ label: `${c} Clip${c > 1 ? 's' : ''}`, value: c })}
                          sx={{
                            flex: 1,
                            py: 1.5,
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: sel ? '#5E35B1' : 'divider',
                            bgcolor: sel ? '#5E35B1' : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: '#5E35B1', bgcolor: sel ? '#5E35B1' : alpha('#5E35B1', 0.04) }
                          }}
                        >
                          <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: sel ? '#fff' : 'text.primary' }}>{c}</Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                    <IconMoodSmile size={14} color="#5E35B1" />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>TONE & MOOD</Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {TONES.map((t) => {
                      const sel = tone === t.id;
                      return (
                        <Chip
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          label={
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <Typography sx={{ fontSize: '0.85rem' }}>{t.emoji}</Typography>
                              <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{t.label}</Typography>
                            </Stack>
                          }
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            height: 28,
                            bgcolor: sel ? '#5E35B1' : 'transparent',
                            color: sel ? '#fff' : 'text.primary',
                            border: '1px solid',
                            borderColor: sel ? '#5E35B1' : 'divider',
                            '&:hover': { bgcolor: sel ? '#5E35B1' : alpha('#5E35B1', 0.04) }
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            )}

            {step === 3 && (
              <Stack spacing={2}>
                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                    <IconTypography size={14} color="#5E35B1" />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>CAPTION STYLE</Typography>
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.75 }}>
                    {CAPTION_STYLES.map((s) => {
                      const sel = captionStyle === s.id;
                      return (
                        <Box
                          key={s.id}
                          onClick={() => setCaptionStyle(s.id)}
                          sx={{
                            p: 1,
                            borderRadius: 1.5,
                            border: '1.5px solid',
                            borderColor: sel ? s.color : 'divider',
                            bgcolor: sel ? alpha(s.color, 0.06) : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            position: 'relative',
                            '&:hover': { borderColor: s.color }
                          }}
                        >
                          {sel && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 3,
                                right: 3,
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: '#4CAF50',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconCheck size={7} style={{ color: '#fff' }} />
                            </Box>
                          )}
                          <Box
                            sx={{
                              width: '100%',
                              height: 24,
                              borderRadius: 1,
                              bgcolor: s.color,
                              mb: 0.75,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                color: s.id === 'minimal' ? '#1a1a1a' : '#fff',
                                letterSpacing: s.id === 'hormozi' ? '0.5px' : 0,
                                textTransform: 'uppercase'
                              }}
                            >
                              Aa
                            </Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>{s.label}</Typography>
                          <Typography sx={{ fontSize: '0.55rem', color: 'text.secondary', lineHeight: 1.2 }}>{s.desc}</Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Divider />

                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                      <IconLanguage size={14} color="#5E35B1" />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>LANGUAGE</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {LANGUAGES.map((l) => {
                        const sel = language === l.id;
                        return (
                          <Chip
                            key={l.id}
                            onClick={() => setLanguage(l.id)}
                            label={
                              <Stack direction="row" spacing={0.4} alignItems="center">
                                <Typography sx={{ fontSize: '0.8rem' }}>{l.flag}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{l.label}</Typography>
                              </Stack>
                            }
                            size="small"
                            sx={{
                              borderRadius: 1.5,
                              height: 26,
                              bgcolor: sel ? '#5E35B1' : 'transparent',
                              color: sel ? '#fff' : 'text.primary',
                              border: '1px solid',
                              borderColor: sel ? '#5E35B1' : 'divider'
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                      <IconMessage size={14} color="#5E35B1" />
                      <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>END CTA</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                      {CTA_TEMPLATES.slice(0, 4).map((c) => {
                        const sel = cta === c.id;
                        const Icon = c.icon;
                        return (
                          <Chip
                            key={c.id}
                            onClick={() => setCta(c.id)}
                            icon={<Icon size={12} />}
                            label={c.label}
                            size="small"
                            sx={{
                              borderRadius: 1.5,
                              height: 26,
                              fontSize: '0.65rem',
                              fontWeight: 600,
                              bgcolor: sel ? '#5E35B1' : 'transparent',
                              color: sel ? '#fff' : 'text.primary',
                              border: '1px solid',
                              borderColor: sel ? '#5E35B1' : 'divider',
                              '& .MuiChip-icon': { color: sel ? '#fff' : '#5E35B1' }
                            }}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                </Stack>

                <Divider />

                <Box>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                    <IconSparkles size={14} color="#5E35B1" />
                    <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>AI FEATURES</Typography>
                  </Stack>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 0.75 }}>
                    {AI_FEATURES.map((feature) => {
                      const enabled = aiFeatures.includes(feature.id);
                      const Icon = feature.icon;
                      return (
                        <Box
                          key={feature.id}
                          onClick={() => toggleAi(feature.id)}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            px: 1.25,
                            py: 0.75,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: enabled ? alpha(feature.color, 0.3) : 'divider',
                            bgcolor: enabled ? alpha(feature.color, 0.04) : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: alpha(feature.color, 0.4) }
                          }}
                        >
                          <Box
                            sx={{
                              width: 26,
                              height: 26,
                              borderRadius: 1.5,
                              bgcolor: enabled ? feature.color : alpha(feature.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Icon size={13} style={{ color: enabled ? '#fff' : feature.color }} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.72rem', lineHeight: 1.1 }}>{feature.label}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem', lineHeight: 1.1 }}>{feature.desc}</Typography>
                          </Box>
                          <Switch
                            checked={enabled}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                            onChange={() => toggleAi(feature.id)}
                            sx={{
                              '& .MuiSwitch-switchBase.Mui-checked': { color: feature.color },
                              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: feature.color }
                            }}
                          />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>

                <Box
                  onClick={() => setBrandKit(!brandKit)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: brandKit ? alpha('#5E35B1', 0.3) : 'divider',
                    bgcolor: brandKit ? alpha('#5E35B1', 0.03) : 'transparent',
                    cursor: 'pointer'
                  }}
                >
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: brandKit ? '#5E35B1' : alpha('#5E35B1', 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconPalette size={16} style={{ color: brandKit ? '#fff' : '#5E35B1' }} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>Brand Kit Overlay</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>Add logo, colors & fonts to clips</Typography>
                  </Box>
                  <Switch
                    checked={brandKit}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => setBrandKit(!brandKit)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#5E35B1' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#5E35B1' }
                    }}
                  />
                </Box>
              </Stack>
            )}

            {step === 4 && (
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, alpha(#5E35B1, 0.08), alpha(#7C4DFF, 0.04))',
                    border: '1px solid',
                    borderColor: alpha('#5E35B1', 0.12)
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 100,
                        height: 56,
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        bgcolor: '#000',
                        flexShrink: 0
                      }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Preview"
                        style={{ width: '100%', height: '100%', border: 0 }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>Ready to Generate</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={`${clips?.value} clips`}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontWeight: 600,
                            height: 22,
                            fontSize: '0.65rem',
                            bgcolor: '#5E35B1',
                            color: '#fff'
                          }}
                        />
                        <Chip
                          label={format}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontWeight: 600,
                            height: 22,
                            fontSize: '0.65rem',
                            bgcolor: 'grey.100',
                            color: 'text.primary'
                          }}
                        />
                        <Chip
                          label={duration?.label}
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontWeight: 600,
                            height: 22,
                            fontSize: '0.65rem',
                            bgcolor: 'grey.100',
                            color: 'text.primary'
                          }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 1.5 }}>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>PLATFORMS</Typography>
                    <Stack spacing={0.5}>
                      {platforms.map((id) => {
                        const p = PLATFORMS.find((x) => x.id === id);
                        const Icon = p?.icon;
                        return (
                          <Stack key={id} direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 20,
                                height: 20,
                                borderRadius: 1,
                                bgcolor: p?.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon size={11} style={{ color: '#fff' }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{p?.name}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>

                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'grey.50'
                    }}
                  >
                    <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>STYLE</Typography>
                    <Stack spacing={0.5}>
                      {[
                        { label: 'Tone', value: TONES.find((t) => t.id === tone)?.label },
                        { label: 'Captions', value: CAPTION_STYLES.find((c) => c.id === captionStyle)?.label },
                        { label: 'Language', value: LANGUAGES.find((l) => l.id === language)?.label },
                        { label: 'CTA', value: CTA_TEMPLATES.find((c) => c.id === cta)?.label }
                      ].map((item) => (
                        <Stack key={item.label} direction="row" justifyContent="space-between">
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{item.label}</Typography>
                          <Typography sx={{ fontSize: '0.65rem', fontWeight: 700 }}>{item.value}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'grey.50'
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1 }}>AI FEATURES</Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                    {aiFeatures.map((id) => {
                      const f = AI_FEATURES.find((x) => x.id === id);
                      const Icon = f?.icon;
                      return (
                        <Tooltip key={id} title={f?.desc}>
                          <Chip
                            icon={Icon ? <Icon size={11} /> : undefined}
                            label={f?.label}
                            size="small"
                            sx={{
                              borderRadius: 1.5,
                              fontWeight: 600,
                              height: 22,
                              fontSize: '0.6rem',
                              bgcolor: alpha(f?.color || '#5E35B1', 0.08),
                              color: f?.color || '#5E35B1',
                              '& .MuiChip-icon': { color: f?.color || '#5E35B1' }
                            }}
                          />
                        </Tooltip>
                      );
                    })}
                    {brandKit && (
                      <Chip
                        icon={<IconPalette size={11} />}
                        label="Brand Kit"
                        size="small"
                        sx={{
                          borderRadius: 1.5,
                          fontWeight: 600,
                          height: 22,
                          fontSize: '0.6rem',
                          bgcolor: alpha('#5E35B1', 0.08),
                          color: '#5E35B1',
                          '& .MuiChip-icon': { color: '#5E35B1' }
                        }}
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>

          {!startGeneration && (
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5, display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                {step > 0 && (
                  <Button
                    size="small"
                    startIcon={<IconChevronLeft size={16} />}
                    onClick={() => setStep((s) => s - 1)}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                  >
                    Back
                  </Button>
                )}
              </Box>
              <Box>
                {step < 4 ? (
                  <Button
                    size="small"
                    endIcon={<IconChevronRight size={16} />}
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      bgcolor: '#5E35B1',
                      '&:disabled': { bgcolor: alpha('#5E35B1', 0.3) }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={isGenerating ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconSparkles size={16} />}
                    disabled={!canNext || isGenerating}
                    onClick={handleGenerate}
                    variant="contained"
                    sx={{
                      px: 2.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)'
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {startGeneration && (
          <Box sx={{ mt: 2 }}>
            <GeneratedClipsQueue
              clipCount={clips?.value}
              duration={duration}
              format={format}
              platforms={platforms}
              aiFeatures={aiFeatures}
              onFinish={() => setIsGenerating(false)}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
