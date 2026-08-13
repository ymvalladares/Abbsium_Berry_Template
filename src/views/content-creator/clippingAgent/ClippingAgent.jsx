import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
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
  IconTarget,
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
import { clippingAPI } from 'services/AxiosService';
import { clippingSignalR } from 'services/ClippingSignalRService';

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
  const [currentJobId, setCurrentJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState('pending');
  const [jobProgress, setJobProgress] = useState(0);
  const [jobMessage, setJobMessage] = useState('');
  const [generatedClips, setGeneratedClips] = useState([]);

  const pollIntervalRef = useRef(null);

  const videoId = useMemo(() => getYoutubeId(url), [url]);
  const canNext = step === 0 ? Boolean(videoId) : true;

  const startPolling = useCallback(
    (jobId) => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await clippingAPI.getJob(jobId);
          const job = res.data;

          setJobStatus(job.status);
          setJobProgress(job.progress || 0);
          setJobMessage(job.errorMessage || '');

          if (job.status === 'completed' && job.clips && job.clips.length > 0) {
            clearInterval(pollIntervalRef.current);
            const clips = job.clips.map((c) => ({
              id: c.id,
              progress: 100,
              status: 'ready',
              viralScore: Math.round(c.engagementScore || 75),
              hookTime: `${Math.floor(c.startTimeSeconds / 60)}:${String(c.startTimeSeconds % 60).padStart(2, '0')}`,
              hashtags: ['#viral', '#fyp', '#trending'],
              hooks: ['Wait for it...', "You won't believe this"],
              bestTime: '9:00 AM',
              videoUrl: c.videoUrl,
              thumbnailUrl: c.thumbnailUrl,
              title: c.title,
              description: c.description,
              duration: c.durationSeconds
            }));
            setGeneratedClips(clips);
            setIsGenerating(false);
            setJobProgress(100);
            notify.success(`${clips.length} clips generated successfully!`, 'Clips Ready');
          } else if (job.status === 'completed' && (!job.clips || job.clips.length === 0)) {
            clearInterval(pollIntervalRef.current);
            setIsGenerating(false);
            setJobProgress(100);
            setJobMessage('Job completed but no clips were generated. Try a different video.');
            notify.error('No clips could be generated from this video', 'Warning');
          } else if (job.status === 'failed') {
            clearInterval(pollIntervalRef.current);
            setIsGenerating(false);
            setJobProgress(0);
            notify.error(job.errorMessage || 'Clip generation failed', 'Error');
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 2000);
    },
    [notify]
  );

  const stopPolling = useCallback(() => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    clippingSignalR.start();

    const unsubscribe = clippingSignalR.onStatusChange(async (type, data) => {
      if (type === 'progress') {
        if (data.jobId !== currentJobId) return;
        setJobStatus(data.status);
        setJobProgress(data.progress);
        setJobMessage(data.message || '');
      } else if (type === 'completed') {
        if (data.jobId !== currentJobId) return;
        setJobStatus('completed');
        setJobProgress(100);
        stopPolling();
        const res = await clippingAPI.getJob(data.jobId);
        const job = res.data;
        if (job.clips && job.clips.length > 0) {
          const clips = job.clips.map((c) => ({
            id: c.id,
            progress: 100,
            status: 'ready',
            viralScore: Math.round(c.engagementScore || 75),
            hookTime: `${Math.floor(c.startTimeSeconds / 60)}:${String(c.startTimeSeconds % 60).padStart(2, '0')}`,
            hashtags: ['#viral', '#fyp', '#trending'],
            hooks: ['Wait for it...', "You won't believe this"],
            bestTime: '9:00 AM',
            videoUrl: c.videoUrl,
            thumbnailUrl: c.thumbnailUrl,
            title: c.title,
            description: c.description,
            duration: c.durationSeconds
          }));
          setGeneratedClips(clips);
          setIsGenerating(false);
          notify.success(`${clips.length} clips generated successfully!`, 'Clips Ready');
        }
      } else if (type === 'failed') {
        if (data.jobId !== currentJobId) return;
        setJobStatus('failed');
        setJobProgress(0);
        setIsGenerating(false);
        stopPolling();
        notify.error(data.error || 'Clip generation failed', 'Error');
      }
    });

    return () => {
      unsubscribe();
      stopPolling();
    };
  }, [currentJobId, stopPolling, notify]);

  const handleGenerate = async () => {
    try {
      setStartGen(true);
      setIsGenerating(true);
      setJobStatus('pending');
      setJobProgress(0);
      setJobMessage('Starting...');
      setGeneratedClips([]);

      const res = await clippingAPI.createJob(url, clipCount, 30, 60);
      const jobId = res.data.jobId;
      setCurrentJobId(jobId);

      startPolling(jobId);

      notify.info('Clip generation started. This may take a few minutes.', 'Generating Clips');
    } catch (err) {
      setIsGenerating(false);
      setStartGen(false);
      setJobProgress(0);
      setJobMessage('');
      notify.error(err.response?.data?.message || 'Failed to create clip job', 'Error');
    }
  };

  const handlePublish = () => {
    notify.success('Opening post composer with generated clips', 'Ready to Publish');
    navigate('/platform/content/post');
  };

  const handleCleanup = async () => {
    if (!currentJobId) {
      notify.error('No job ID found', 'Error');
      return;
    }
    try {
      const confirmed = window.confirm(
        'This will delete all clips from S3 storage. Make sure you have downloaded or published them first. Continue?'
      );
      if (!confirmed) return;

      console.log('Cleaning up job:', currentJobId);
      await clippingAPI.cleanupPublishedClips(currentJobId);
      console.log('Cleanup successful');
      notify.success('Clips removed from S3. You saved storage space!', 'Storage Cleaned');
      setGeneratedClips([]);
    } catch (err) {
      console.error('Cleanup error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to cleanup clips';
      notify.error(msg, 'Error');
    }
  };

  const reset = () => {
    stopPolling();
    setUrl('');
    setClipCount(5);
    setAspectRatio('9:16');
    setIsGenerating(false);
    setStartGen(false);
    setStep(0);
    setCurrentJobId(null);
    setJobStatus('pending');
    setJobProgress(0);
    setJobMessage('');
    setGeneratedClips([]);
  };

  return (
    <Box sx={{ py: { xs: 1, sm: 1.5 }, width: '100%', maxWidth: '100%' }}>
      {/* ── Header ── */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2.5,
              background: `linear-gradient(135deg, ${ACCENT}, #7C4DFF)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 2px 12px ${alpha(ACCENT, 0.25)}`
            }}
          >
            <IconScissors size={16} color="#fff" />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em' }}>Clipping Agent</Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Turn long videos into viral short clips</Typography>
          </Box>
        </Stack>
        {startGen && (
          <Button
            size="small"
            startIcon={<IconRefresh size={14} />}
            onClick={reset}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: '0.75rem' }}
          >
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
                flexDirection: 'column'
              }}
            >
              <Box sx={{ p: { xs: 2, sm: 2.5 }, flex: 1 }}>
                {/* Step 0: URL */}
                {step === 0 && (
                  <Stack spacing={2}>
                    <Box>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.25 }}>Paste your video URL</Typography>
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
                          '&.Mui-focused fieldset': { borderColor: ACCENT, borderWidth: 2 }
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
                      <Typography sx={{ fontWeight: 600, fontSize: '0.95rem', mb: 0.25 }}>Quick settings</Typography>
                      <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                        Choose how many clips and what format you need
                      </Typography>
                    </Box>

                    {/* Clip count */}
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 1
                        }}
                      >
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
                                '&:hover': { borderColor: ACCENT }
                              }}
                            >
                              {sel && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <IconCheck size={9} color="#fff" />
                                </Box>
                              )}
                              <Typography
                                sx={{ fontWeight: 800, fontSize: '1.25rem', color: sel ? ACCENT : 'text.primary', lineHeight: 1 }}
                              >
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
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          color: 'text.secondary',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          mb: 1
                        }}
                      >
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
                                '&:hover': { borderColor: ACCENT }
                              }}
                            >
                              {sel && (
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    width: 16,
                                    height: 16,
                                    borderRadius: '50%',
                                    bgcolor: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}
                                >
                                  <IconCheck size={9} color="#fff" />
                                </Box>
                              )}
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  mx: 'auto',
                                  mb: 0.5,
                                  borderRadius: 1.5,
                                  bgcolor: sel ? ACCENT : alpha(ACCENT, 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Icon size={14} color={sel ? '#fff' : ACCENT} />
                              </Box>
                              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: sel ? ACCENT : 'text.primary' }}>
                                {r.label}
                              </Typography>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.1 }}>{r.sub}</Typography>
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
              clips={generatedClips}
              isGenerating={isGenerating}
              jobStatus={jobStatus}
              jobProgress={jobProgress}
              jobMessage={jobMessage}
              clipCount={clipCount}
              format={aspectRatio}
              onPublish={handlePublish}
              onCleanup={handleCleanup}
            />
          )}
        </Box>

        {/* ── Side Panel (lg+) - Config ── */}
        {!startGen && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              width: 420,
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                height: '100%',
                border: '1px solid',
                borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.06),
                borderRadius: 3,
                bgcolor: isDark ? '#0f172a' : '#fafbfc',
                p: 3,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2.5,
                    background: `linear-gradient(135deg, ${ACCENT}, #7C4DFF)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 16px ${alpha(ACCENT, 0.3)}`
                  }}
                >
                  <IconSparkles size={20} color="#fff" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>How it works</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>AI-powered clipping in 3 steps</Typography>
                </Box>
              </Stack>

              <Stack spacing={2} sx={{ flex: 1 }}>
                {[
                  {
                    step: '01',
                    title: 'Paste a video URL',
                    desc: 'Any YouTube, Vimeo or direct video link. 10-30 min videos work best for quality clips.',
                    icon: IconLink,
                    color: '#6366f1',
                    bg: alpha('#6366f1', 0.1)
                  },
                  {
                    step: '02',
                    title: 'AI finds the best moments',
                    desc: 'Our AI analyzes the transcript and identifies the most engaging, viral-worthy segments automatically.',
                    icon: IconWand,
                    color: '#8b5cf6',
                    bg: alpha('#8b5cf6', 0.1)
                  },
                  {
                    step: '03',
                    title: 'Get ready-to-post clips',
                    desc: 'Receive 3-10 short clips in 2-5 minutes, each with viral score, hashtags, and posting tips.',
                    icon: IconScissors,
                    color: '#5E35B1',
                    bg: alpha('#5E35B1', 0.1)
                  }
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      border: '1px solid',
                      borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.06),
                      bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#fff', 0.8)
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          position: 'relative',
                          width: 44,
                          height: 44,
                          borderRadius: 2.5,
                          bgcolor: item.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <item.icon size={20} color={item.color} />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            bgcolor: item.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#fff' }}>{item.step}</Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.25, color: 'text.primary' }}>{item.title}</Typography>
                        <Typography sx={{ fontSize: '0.72rem', color: 'text.secondary', lineHeight: 1.5 }}>{item.desc}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        )}

        {/* ── Side Panel (lg+) - Generation ── */}
        {startGen && (
          <Box
            sx={{
              display: { xs: 'none', lg: 'flex' },
              width: '420px',
              minWidth: '420px',
              flexShrink: 0
            }}
          >
            <Box
              sx={{
                position: 'sticky',
                top: 100,
                height: '100%',
                border: '1px solid',
                borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
                borderRadius: '28px',
                bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(250, 251, 252, 0.6)',
                backdropFilter: 'blur(24px)',
                p: 3,
                boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(94, 53, 177, 0.3)'
                  }}
                >
                  <IconSparkles size={20} color="#fff" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>AI Processing</Typography>
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Real-time generation stats</Typography>
                </Box>
              </Stack>

              <Stack spacing={2} sx={{ flex: 1 }}>
                {[
                  { label: 'Clips Generated', value: clipCount, icon: IconScissors, color: '#6366f1', bg: alpha('#6366f1', 0.1) },
                  {
                    label: 'Output Format',
                    value: aspectRatio,
                    icon: aspectRatio === '9:16' ? IconDeviceMobile : aspectRatio === '1:1' ? IconSquare : IconDeviceTv,
                    color: '#8b5cf6',
                    bg: alpha('#8b5cf6', 0.1)
                  },
                  {
                    label: 'Status',
                    value: jobStatus === 'completed' ? 'Ready' : jobStatus,
                    icon: jobStatus === 'completed' ? IconCheck : IconSparkles,
                    color: jobStatus === 'completed' ? '#10b981' : '#5E35B1',
                    bg: jobStatus === 'completed' ? alpha('#10b981', 0.1) : alpha('#5E35B1', 0.1)
                  },
                  { label: 'Progress', value: `${Math.round(jobProgress)}%`, icon: IconTarget, color: '#f59e0b', bg: alpha('#f59e0b', 0.1) }
                ].map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      p: 2,
                      borderRadius: '18px',
                      border: '1px solid',
                      borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
                      bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#fff', 0.8)
                    }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '14px',
                          bgcolor: item.bg,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <item.icon size={18} color={item.color} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontSize: '0.65rem',
                            color: 'text.secondary',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}
                        >
                          {item.label}
                        </Typography>
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 800, color: 'text.primary', letterSpacing: '-0.01em' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                ))}
              </Stack>

              <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${alpha('#5E35B1', 0.15)}, transparent)`, my: 2.5 }} />

              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 1.5, letterSpacing: '-0.01em' }}>Target Platforms</Typography>
              <Stack spacing={1}>
                {PLATFORMS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        p: 1.25,
                        borderRadius: '14px',
                        border: '1px solid',
                        borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
                        bgcolor: isDark ? alpha('#fff', 0.02) : alpha('#fff', 0.8),
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: alpha(p.color, 0.3), bgcolor: alpha(p.color, 0.06) }
                      }}
                    >
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '10px',
                          bgcolor: alpha(p.color, isDark ? 0.15 : 0.08),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Icon size={16} color={p.color} />
                      </Box>
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.primary' }}>{p.label}</Typography>
                      <Box
                        sx={{
                          ml: 'auto',
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          bgcolor: '#10b981',
                          boxShadow: `0 0 8px ${alpha('#10b981', 0.6)}`
                        }}
                      />
                    </Box>
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
