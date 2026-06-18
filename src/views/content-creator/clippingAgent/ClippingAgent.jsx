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
  Tooltip,
  useMediaQuery
} from '@mui/material';
import { alpha, createTheme, ThemeProvider, useColorScheme } from '@mui/material/styles';
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

/* ─── Data ───────────────────────────────────────── */
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
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
  return m && m[2].length === 11 ? m[2] : null;
};

const ACCENT = '#5E35B1';
const ACCENT_LIGHT = alpha(ACCENT, 0.08);

/* ─── Reusable card-style selector box ─────────── */
function SelBox({ selected, color = ACCENT, onClick, children, sx = {} }) {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'relative',
        cursor: 'pointer',
        borderRadius: 2,
        border: '1.5px solid',
        transition: 'all 0.18s ease',
        borderColor: selected ? color : 'divider',
        bgcolor: selected ? alpha(color, 0.05) : 'transparent',
        '&:hover': { borderColor: color, bgcolor: alpha(color, 0.04) },
        ...sx
      }}
    >
      {selected && (
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
            justifyContent: 'center',
            zIndex: 1
          }}
        >
          <IconCheck size={9} color="#fff" />
        </Box>
      )}
      {children}
    </Box>
  );
}

/* ─── Section label ─────────────────────────────── */
function SectionLabel({ icon: Icon, children }) {
  return (
    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
      {Icon && <Icon size={14} color={ACCENT} />}
      <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {children}
      </Typography>
    </Stack>
  );
}

/* ─── Main component ─────────────────────────────── */
export default function ClippingAgent() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width:600px)');
  const isTablet = useMediaQuery('(max-width:900px)');

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
  const [startGen, setStartGen] = useState(false);

  const videoId = useMemo(() => getYoutubeId(url), [url]);
  const canNext = step === 0 ? Boolean(videoId) : step === 1 ? Boolean(format) : step === 2 ? Boolean(duration && clips) : true;

  const togglePlatform = (id) => setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const toggleAi = (id) => setAiFeatures((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const handleGenerate = () => {
    if (!isGenerating) {
      setStartGen(true);
      setIsGenerating(true);
    }
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
    setStartGen(false);
    setStep(0);
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 680, md: 900, lg: 1000 } }}>
        {/* ── Header ── */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: { xs: 1.5, sm: 2 } }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: ACCENT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconScissors size={17} color="#fff" />
            </Box>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.1rem', sm: '1.3rem' } }}>Clipping Agent</Typography>
          </Stack>
          {startGen && (
            <Button
              size="small"
              startIcon={<IconRefresh size={15} />}
              onClick={reset}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem', color: ACCENT }}
            >
              New
            </Button>
          )}
        </Stack>

        {/* ── Stepper ── */}
        <Stepper
          activeStep={step}
          sx={{
            mb: { xs: 1.5, sm: 2 },
            '& .MuiStepLabel-label': { fontSize: { xs: '0.65rem', sm: '0.78rem' }, fontWeight: 600 },
            '& .MuiStepConnector-line': { borderColor: 'divider' },
            // hide labels on very small screens, show only icons
            '& .MuiStepLabel-labelContainer': { display: { xs: 'none', sm: 'block' } }
          }}
        >
          {STEP_LABELS.map((l, i) => (
            <Step key={l}>
              <StepLabel
                onClick={() => {
                  if (!startGen && i < step) setStep(i);
                }}
                sx={{ cursor: i < step && !startGen ? 'pointer' : 'default' }}
                icon={
                  <Box
                    sx={{
                      width: { xs: 22, sm: 26 },
                      height: { xs: 22, sm: 26 },
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: i === step ? ACCENT : i < step ? '#4CAF50' : isDark ? '#374151' : '#e0e0e0',
                      color: i <= step ? '#fff' : isDark ? '#94a3b8' : '#999',
                      fontSize: { xs: '0.65rem', sm: '0.75rem' },
                      fontWeight: 700,
                      transition: 'all 0.2s',
                      cursor: i < step && !startGen ? 'pointer' : 'default'
                    }}
                  >
                    {i < step ? <IconCheck size={isMobile ? 10 : 12} /> : i + 1}
                  </Box>
                }
              >
                {l}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* ── Card ── */}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: { xs: 2, sm: 3 },
            bgcolor: 'background.paper',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            {/* ── Step 0: URL ── */}
            {step === 0 && (
              <Stack spacing={2}>
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    background: alpha(ACCENT, 0.05),
                    border: '1px solid',
                    borderColor: alpha(ACCENT, 0.12)
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        bgcolor: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 2px 8px ${alpha(ACCENT, 0.15)}`
                      }}
                    >
                      <IconLink size={18} color={ACCENT} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.9rem' }, mb: 0.2 }}>
                        Paste your video URL
                      </Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.75rem', sm: '0.8rem' } }}>
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
                        <IconLink size={15} color={videoId ? '#4CAF50' : isDark ? '#64748b' : '#999'} />
                      </InputAdornment>
                    ),
                    endAdornment: url && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setUrl('')}>
                          <IconX size={13} />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.85rem' } }}
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

            {/* ── Step 1: Format + Platforms ── */}
            {step === 1 && (
              <Stack spacing={2}>
                <SectionLabel icon={IconDeviceMobile}>Output Format</SectionLabel>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 0.75, sm: 1 } }}>
                  {FORMATS.map((f) => {
                    const sel = format === f.id;
                    const Icon = f.icon;
                    return (
                      <SelBox
                        key={f.id}
                        selected={sel}
                        onClick={() => setFormat(f.id)}
                        sx={{
                          p: { xs: 1, sm: 1.5 },
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5,
                          minHeight: { xs: 60, sm: 72 }
                        }}
                      >
                        <Box
                          sx={{
                            width: { xs: 26, sm: 30 },
                            height: { xs: 26, sm: 30 },
                            borderRadius: 1.5,
                            bgcolor: sel ? ACCENT : alpha(ACCENT, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={isMobile ? 14 : 16} color={sel ? '#fff' : ACCENT} />
                        </Box>
                        <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.65rem', sm: '0.72rem' } }}>{f.label}</Typography>
                        <Typography
                          sx={{
                            fontSize: { xs: '0.55rem', sm: '0.6rem' },
                            color: 'text.secondary',
                            lineHeight: 1.2,
                            display: { xs: 'none', sm: 'block' }
                          }}
                        >
                          {f.desc}
                        </Typography>
                      </SelBox>
                    );
                  })}
                </Box>

                <Divider />
                <SectionLabel>Publish To</SectionLabel>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: { xs: 0.75, sm: 1 } }}>
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
                          gap: { xs: 0.75, sm: 1 },
                          p: { xs: 0.75, sm: 1 },
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
                            width: { xs: 24, sm: 28 },
                            height: { xs: 24, sm: 28 },
                            borderRadius: 1.5,
                            bgcolor: sel ? p.color : alpha(p.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon size={isMobile ? 12 : 14} color={sel ? '#fff' : p.color} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.75rem' }, flex: 1 }}>{p.name}</Typography>
                        {sel && (
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '50%',
                              bgcolor: '#4CAF50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <IconCheck size={8} color="#fff" />
                          </Box>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Stack>
            )}

            {/* ── Step 2: Duration + Clips + Tone ── */}
            {step === 2 && (
              <Stack spacing={2}>
                <Box>
                  <SectionLabel icon={IconClock}>Duration</SectionLabel>
                  <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }}>
                    {DURATIONS.map((d) => {
                      const sel = duration?.value === d.value;
                      return (
                        <Box
                          key={d.value}
                          onClick={() => setDuration(d)}
                          sx={{
                            flex: 1,
                            py: { xs: 1.2, sm: 1.5 },
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: sel ? ACCENT : 'divider',
                            bgcolor: sel ? alpha(ACCENT, 0.05) : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: ACCENT }
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 700, fontSize: { xs: '0.78rem', sm: '0.85rem' }, color: sel ? ACCENT : 'text.primary' }}
                          >
                            {d.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Box>
                  <SectionLabel icon={IconHash}>Number of Clips</SectionLabel>
                  <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }}>
                    {CLIP_OPTIONS.map((c) => {
                      const sel = clips?.value === c;
                      return (
                        <Box
                          key={c}
                          onClick={() => setClips({ label: `${c} Clip${c > 1 ? 's' : ''}`, value: c })}
                          sx={{
                            flex: 1,
                            py: { xs: 1.2, sm: 1.5 },
                            borderRadius: 2,
                            border: '1.5px solid',
                            borderColor: sel ? ACCENT : 'divider',
                            bgcolor: sel ? ACCENT : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: ACCENT, bgcolor: sel ? ACCENT : alpha(ACCENT, 0.04) }
                          }}
                        >
                          <Typography
                            sx={{ fontWeight: 800, fontSize: { xs: '1rem', sm: '1.1rem' }, color: sel ? '#fff' : 'text.primary' }}
                          >
                            {c}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>

                <Divider />

                <Box>
                  <SectionLabel icon={IconMoodSmile}>Tone & Mood</SectionLabel>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(6, 1fr)' }, gap: 0.75 }}>
                    {TONES.map((t) => {
                      const sel = tone === t.id;
                      return (
                        <Box
                          key={t.id}
                          onClick={() => setTone(t.id)}
                          sx={{
                            py: { xs: 0.75, sm: 0.6 },
                            px: 0.5,
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: sel ? ACCENT : 'divider',
                            bgcolor: sel ? ACCENT : 'transparent',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 0.18s',
                            '&:hover': { borderColor: ACCENT }
                          }}
                        >
                          <Typography sx={{ fontSize: { xs: '1rem', sm: '0.85rem' } }}>{t.emoji}</Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.6rem', sm: '0.62rem' },
                              fontWeight: 600,
                              color: sel ? '#fff' : 'text.primary',
                              lineHeight: 1.1,
                              mt: 0.25
                            }}
                          >
                            {t.label}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Stack>
            )}

            {/* ── Step 3: Captions + Language + CTA + AI ── */}
            {step === 3 && (
              <Stack spacing={2}>
                <Box>
                  <SectionLabel icon={IconTypography}>Caption Style</SectionLabel>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: { xs: 0.75, sm: 1 },
                      sm: { gridTemplateColumns: 'repeat(4, 1fr)' }
                    }}
                  >
                    {/* Force 4-col on sm+ via responsive grid */}
                    <Box sx={{ display: 'contents' }}>
                      {CAPTION_STYLES.map((s) => {
                        const sel = captionStyle === s.id;
                        return (
                          <SelBox
                            key={s.id}
                            selected={sel}
                            color={s.color}
                            onClick={() => setCaptionStyle(s.id)}
                            sx={{ p: { xs: 1, sm: 1 }, textAlign: 'center' }}
                          >
                            <Box
                              sx={{
                                width: '100%',
                                height: { xs: 20, sm: 24 },
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
                                  fontSize: '0.6rem',
                                  fontWeight: 800,
                                  color: s.id === 'minimal' ? '#1a1a1a' : '#fff',
                                  textTransform: 'uppercase'
                                }}
                              >
                                Aa
                              </Typography>
                            </Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.65rem' }}>{s.label}</Typography>
                            <Typography
                              sx={{ fontSize: '0.55rem', color: 'text.secondary', lineHeight: 1.2, display: { xs: 'none', sm: 'block' } }}
                            >
                              {s.desc}
                            </Typography>
                          </SelBox>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>

                <Divider />

                {/* Language + CTA — stack on mobile, side-by-side on sm+ */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Box>
                    <SectionLabel icon={IconLanguage}>Language</SectionLabel>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.5 }}>
                      {LANGUAGES.map((l) => {
                        const sel = language === l.id;
                        return (
                          <Box
                            key={l.id}
                            onClick={() => setLanguage(l.id)}
                            sx={{
                              py: 0.6,
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: sel ? ACCENT : 'divider',
                              bgcolor: sel ? ACCENT : 'transparent',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.18s'
                            }}
                          >
                            <Typography sx={{ fontSize: '0.85rem' }}>{l.flag}</Typography>
                            <Typography sx={{ fontSize: '0.58rem', fontWeight: 700, color: sel ? '#fff' : 'text.secondary' }}>
                              {l.label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  <Box>
                    <SectionLabel icon={IconMessage}>End CTA</SectionLabel>
                    <Stack spacing={0.5}>
                      {CTA_TEMPLATES.slice(0, 4).map((c) => {
                        const sel = cta === c.id;
                        const Icon = c.icon;
                        return (
                          <Box
                            key={c.id}
                            onClick={() => setCta(c.id)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              px: 1,
                              py: 0.6,
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: sel ? ACCENT : 'divider',
                              bgcolor: sel ? alpha(ACCENT, 0.06) : 'transparent',
                              cursor: 'pointer',
                              transition: 'all 0.18s'
                            }}
                          >
                            <Icon size={13} color={sel ? ACCENT : '#999'} />
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: sel ? 700 : 500, color: sel ? ACCENT : 'text.primary' }}>
                              {c.label}
                            </Typography>
                            {sel && (
                              <Box
                                sx={{
                                  ml: 'auto',
                                  width: 14,
                                  height: 14,
                                  borderRadius: '50%',
                                  bgcolor: '#4CAF50',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <IconCheck size={8} color="#fff" />
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Stack>
                  </Box>
                </Box>

                <Divider />

                <Box>
                  <SectionLabel icon={IconSparkles}>AI Features</SectionLabel>
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
                      gap: { xs: 0.6, sm: 0.75 }
                    }}
                  >
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
                            gap: { xs: 0.75, sm: 1 },
                            px: { xs: 1, sm: 1.25 },
                            py: { xs: 0.6, sm: 0.75 },
                            borderRadius: 1.5,
                            border: '1px solid',
                            borderColor: enabled ? alpha(feature.color, 0.3) : 'divider',
                            bgcolor: enabled ? alpha(feature.color, 0.04) : 'transparent',
                            cursor: 'pointer',
                            transition: 'all 0.18s',
                            '&:hover': { borderColor: alpha(feature.color, 0.4) }
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 24, sm: 26 },
                              height: { xs: 24, sm: 26 },
                              borderRadius: 1.5,
                              bgcolor: enabled ? feature.color : alpha(feature.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <Icon size={isMobile ? 12 : 13} color={enabled ? '#fff' : feature.color} />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.7rem', sm: '0.72rem' }, lineHeight: 1.1 }}>
                              {feature.label}
                            </Typography>
                            <Typography
                              sx={{
                                color: 'text.secondary',
                                fontSize: { xs: '0.58rem', sm: '0.6rem' },
                                lineHeight: 1.1,
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              {feature.desc}
                            </Typography>
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

                {/* Brand Kit */}
                <Box
                  onClick={() => setBrandKit(!brandKit)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    px: { xs: 1.25, sm: 1.5 },
                    py: 1,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: brandKit ? alpha(ACCENT, 0.3) : 'divider',
                    bgcolor: brandKit ? alpha(ACCENT, 0.03) : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s'
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 28, sm: 32 },
                      height: { xs: 28, sm: 32 },
                      borderRadius: 1.5,
                      bgcolor: brandKit ? ACCENT : alpha(ACCENT, 0.1),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <IconPalette size={isMobile ? 14 : 16} color={brandKit ? '#fff' : ACCENT} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.8rem' } }}>Brand Kit Overlay</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>
                      Add logo, colors & fonts to clips
                    </Typography>
                  </Box>
                  <Switch
                    checked={brandKit}
                    size="small"
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => setBrandKit(!brandKit)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: ACCENT },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: ACCENT }
                    }}
                  />
                </Box>
              </Stack>
            )}

            {/* ── Step 4: Review ── */}
            {step === 4 && (
              <Box>
                {/* Video + summary */}
                <Box
                  sx={{
                    p: { xs: 1.5, sm: 2, md: 2.5 },
                    borderRadius: 2,
                    background: alpha(ACCENT, 0.04),
                    border: '1px solid',
                    borderColor: alpha(ACCENT, 0.12),
                    mb: 2
                  }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 140 },
                        height: { xs: 'auto', sm: 80 },
                        aspectRatio: { xs: '16/9', sm: 'unset' },
                        borderRadius: 1.5,
                        overflow: 'hidden',
                        bgcolor: '#000',
                        flexShrink: 0
                      }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title="Preview"
                        style={{ width: '100%', height: '100%', border: 0, display: 'block', minHeight: isMobile ? 180 : 80 }}
                      />
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: { xs: '1rem', sm: '1.05rem' }, mb: 1 }}>Ready to Generate</Typography>
                      <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                        {[
                          { label: `${clips?.value} clips` },
                          { label: format },
                          { label: duration?.label }
                        ].map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag.label}
                            size="small"
                            sx={{
                              borderRadius: 1.5,
                              fontWeight: 700,
                              height: 24,
                              fontSize: '0.7rem',
                              bgcolor: i === 0 ? ACCENT : isDark ? '#334155' : 'grey.100',
                              color: i === 0 ? '#fff' : 'text.primary'
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </Box>

                {/* 3-col grid → 1-col on mobile */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: { xs: 1.5, sm: 2 } }}>
                  {/* Platforms */}
                  <Box sx={{ p: { xs: 1.25, sm: 1.5 }, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: isDark ? '#1e293b' : 'grey.50' }}>
                    <SectionLabel>Platforms</SectionLabel>
                    <Stack spacing={0.75}>
                      {platforms.map((id) => {
                        const p = PLATFORMS.find((x) => x.id === id);
                        const Icon = p?.icon;
                        return (
                          <Stack key={id} direction="row" spacing={1} alignItems="center">
                            <Box
                              sx={{
                                width: 22,
                                height: 22,
                                borderRadius: 1,
                                bgcolor: p?.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Icon size={11} color="#fff" />
                            </Box>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600 }}>{p?.name}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Box>

                  {/* Style */}
                  <Box sx={{ p: { xs: 1.25, sm: 1.5 }, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: isDark ? '#1e293b' : 'grey.50' }}>
                    <SectionLabel>Style</SectionLabel>
                    <Stack spacing={0.6}>
                      {[
                        { label: 'Tone', value: TONES.find((t) => t.id === tone)?.label },
                        { label: 'Captions', value: CAPTION_STYLES.find((c) => c.id === captionStyle)?.label },
                        { label: 'Language', value: LANGUAGES.find((l) => l.id === language)?.label },
                        { label: 'CTA', value: CTA_TEMPLATES.find((c) => c.id === cta)?.label }
                      ].map((item) => (
                        <Stack key={item.label} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{item.label}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 700 }}>{item.value}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  {/* AI Features */}
                  <Box sx={{ p: { xs: 1.25, sm: 1.5 }, borderRadius: 2, border: '1px solid', borderColor: 'divider', bgcolor: isDark ? '#1e293b' : 'grey.50' }}>
                    <SectionLabel>AI Features</SectionLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {aiFeatures.map((id) => {
                        const f = AI_FEATURES.find((x) => x.id === id);
                        const Icon = f?.icon;
                        return (
                          <Tooltip key={id} title={f?.desc}>
                            <Chip
                              icon={Icon ? <Icon size={10} /> : undefined}
                              label={f?.label}
                              size="small"
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 600,
                                height: 22,
                                fontSize: '0.6rem',
                                bgcolor: alpha(f?.color || ACCENT, 0.08),
                                color: f?.color || ACCENT,
                                '& .MuiChip-icon': { color: f?.color || ACCENT }
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                      {brandKit && (
                        <Chip
                          icon={<IconPalette size={10} />}
                          label="Brand Kit"
                          size="small"
                          sx={{
                            borderRadius: 1.5,
                            fontWeight: 600,
                            height: 22,
                            fontSize: '0.6rem',
                            bgcolor: alpha(ACCENT, 0.08),
                            color: ACCENT,
                            '& .MuiChip-icon': { color: ACCENT }
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* ── Footer nav ── */}
          {!startGen && (
            <Box
              sx={{
                borderTop: '1px solid',
                borderColor: 'divider',
                px: { xs: 1.5, sm: 2 },
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
                    startIcon={<IconChevronLeft size={15} />}
                    onClick={() => setStep((s) => s - 1)}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.78rem', sm: '0.82rem' } }}
                  >
                    Back
                  </Button>
                )}
              </Box>
              <Box>
                {step < 4 ? (
                  <Button
                    size="small"
                    endIcon={<IconChevronRight size={15} />}
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canNext}
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      bgcolor: ACCENT,
                      fontSize: { xs: '0.78rem', sm: '0.82rem' },
                      px: { xs: 2, sm: 2.5 },
                      '&:disabled': { bgcolor: alpha(ACCENT, 0.3) }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    size="small"
                    startIcon={isGenerating ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <IconSparkles size={15} />}
                    disabled={!canNext || isGenerating}
                    onClick={handleGenerate}
                    variant="contained"
                    sx={{
                      px: { xs: 2, sm: 2.5 },
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: { xs: '0.78rem', sm: '0.85rem' },
                      background: `linear-gradient(135deg, ${ACCENT}, #7C4DFF)`
                    }}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Clips'}
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>

        {/* ── Results ── */}
        {startGen && (
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
