import { useState, useEffect } from 'react';
import { Box, Typography, Stack, LinearProgress, Button, Fade, Zoom, IconButton, Tooltip, Chip, CircularProgress, Collapse } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconCheck,
  IconDownload,
  IconCalendar,
  IconScissors,
  IconFlame,
  IconPlayerPlay,
  IconPlayerPause,
  IconDeviceMobile,
  IconDeviceTv,
  IconSquare,
  IconUpload,
  IconHash,
  IconClock,
  IconCopy,
  IconShare,
  IconTrash,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconSparkles,
  IconBulb,
  IconTarget
} from '@tabler/icons-react';

const HASHTAG_SETS = [
  ['#viral', '#fyp', '#trending', '#foryou'],
  ['#shorts', '#reels', '#content', '#creator'],
  ['#viralvideo', '#explore', '#new', '#mustwatch'],
  ['#trending', '#foryoupage', '#viral2026', '#clips']
];

const BEST_TIMES = ['9:00 AM', '12:30 PM', '6:00 PM', '8:30 PM', '10:00 PM'];

const HOOK_VARIANTS = [
  ['Wait for it...', "You won't believe this", 'This changed everything'],
  ['Stop scrolling!', "Here's the secret", 'Nobody talks about this'],
  ['POV: You discover...', 'The truth about...', 'I wish I knew this'],
  ['This is insane', 'Watch till the end', 'Game changer alert']
];

const STATUS_LABELS = {
  pending: 'Waiting to start...',
  downloading: 'Downloading video...',
  transcribing: 'Transcribing audio...',
  processing: 'Finding best moments...',
  completed: 'All clips ready',
  failed: 'Generation failed'
};

function ClipCard({ clip, i, aspectRatio, isDark, FormatIcon, hasRealClips, jobProgress, jobMessage }) {
  const ready = hasRealClips && clip.status === 'ready';
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const togglePlay = () => {
    if (!clip.videoUrl) return;
    setIsPlaying(!isPlaying);
    setVideoError(false);
  };

  const scoreColor = clip.viralScore >= 85 ? '#10b981' : clip.viralScore >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <Zoom key={clip.id} in timeout={300 + i * 80}>
      <Box
        sx={{
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid',
          borderColor: ready ? alpha('#fff', 0.08) : alpha('#5E35B1', 0.08),
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': ready
            ? {
                borderColor: alpha('#5E35B1', 0.25),
                boxShadow: `0 16px 48px ${alpha('#5E35B1', 0.12)}, 0 0 0 1px ${alpha('#5E35B1', 0.1)}`,
                transform: 'translateY(-6px) scale(1.01)'
              }
            : {}
        }}
      >
        <Box
          sx={{
            aspectRatio,
            bgcolor: '#0a0a0a',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: ready ? '24px 24px 0 0' : '24px'
          }}
        >
          {isPlaying && clip.videoUrl ? (
            <>
              <video
                autoPlay
                controls
                playsInline
                onEnded={() => setIsPlaying(false)}
                onError={() => { setVideoError(true); setIsPlaying(false); }}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
              >
                <source src={clip.videoUrl} type="video/mp4" />
              </video>
              <IconButton
                size="small"
                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                sx={{
                  position: 'absolute', top: 12, right: 12,
                  bgcolor: 'rgba(0,0,0,0.6)', color: '#fff',
                  width: 32, height: 32, borderRadius: '50%',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <IconX size={16} />
              </IconButton>
            </>
          ) : videoError ? (
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2, p: 3, bgcolor: '#0a0a0a' }}>
              <Typography sx={{ fontSize: '0.7rem', color: '#ef4444', textAlign: 'center' }}>
                Video format not compatible
              </Typography>
              <Button size="small" variant="outlined" sx={{ color: '#fff', fontSize: '0.7rem', borderColor: alpha('#fff', 0.3), borderRadius: '12px' }} onClick={() => window.open(clip.videoUrl, '_blank')}>
                Open in new tab
              </Button>
            </Box>
          ) : ready ? (
            <>
              {clip.thumbnailUrl ? (
                <img src={clip.thumbnailUrl} alt={clip.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, hsl(${clip.viralScore * 3.6}, 60%, 18%), hsl(${clip.viralScore * 3.6 + 40}, 50%, 8%))`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FormatIcon size={40} style={{ color: 'rgba(255,255,255,0.08)' }} />
                </Box>
              )}

              <Box onClick={togglePlay} sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.1)' } }}>
                <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.15)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', '&:hover': { transform: 'scale(1.08)', bgcolor: 'rgba(255,255,255,0.2)' } }}>
                  <IconPlayerPlay size={28} style={{ color: '#fff', marginLeft: 4 }} />
                </Box>
              </Box>

              <Box sx={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 0.5, px: 1.25, py: 0.5, borderRadius: '14px', bgcolor: scoreColor, zIndex: 1, boxShadow: `0 2px 8px ${alpha(scoreColor, 0.4)}` }}>
                <IconFlame size={12} style={{ color: '#fff' }} />
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#fff' }}>{clip.viralScore}</Typography>
              </Box>

              {clip.hookTime && (
                <Box sx={{ position: 'absolute', bottom: 14, right: 14, px: 1.25, py: 0.5, borderRadius: '14px', bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 1 }}>
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#fff' }}>{clip.hookTime}</Typography>
                </Box>
              )}
            </>
          ) : (
            <Stack spacing={1.5} alignItems="center" sx={{ py: 8 }}>
              <Box sx={{ position: 'relative', width: 52, height: 52 }}>
                <svg width="52" height="52" viewBox="0 0 52 52" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="26" cy="26" r="22" fill="none" stroke={alpha('#5E35B1', 0.1)} strokeWidth="3" />
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#5E35B1" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${jobProgress} ${100 - jobProgress}`} strokeDashoffset="0" pathLength="100" style={{ transition: 'stroke-dasharray 0.3s ease' }} />
                </svg>
                <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 800, color: '#5E35B1' }}>{Math.round(jobProgress)}%</Typography>
                </Box>
              </Box>
              {!hasRealClips && (
                <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', textAlign: 'center', px: 1 }}>
                  {jobMessage || 'Processing...'}
                </Typography>
              )}
            </Stack>
          )}
        </Box>

        <Box sx={{ p: 2 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.3, mb: 0.5, letterSpacing: '-0.01em' }}>
                {clip.title || `Clip #${i + 1}`}
              </Typography>
              {clip.duration && (
                <Typography sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>{clip.duration}s</Typography>
              )}
            </Box>
            {ready && clip.videoUrl && !isPlaying && (
              <Tooltip title="Download">
                <IconButton size="small" sx={{ width: 36, height: 36, borderRadius: '14px', bgcolor: alpha('#5E35B1', 0.08), color: '#5E35B1', '&:hover': { bgcolor: alpha('#5E35B1', 0.15) } }} onClick={() => window.open(clip.videoUrl, '_blank')}>
                  <IconDownload size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>

          {ready && (
            <>
              <Box sx={{ height: 1, background: `linear-gradient(90deg, transparent, ${alpha('#5E35B1', 0.15)}, transparent)`, mb: 1.5 }} />

              <Box onClick={() => setShowDetails(!showDetails)} sx={{ cursor: 'pointer', py: 0.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#5E35B1', letterSpacing: '0.02em' }}>AI Insights</Typography>
                  {showDetails ? <IconChevronUp size={16} color="#5E35B1" /> : <IconChevronDown size={16} color="#5E35B1" />}
                </Stack>
              </Box>

              <Collapse in={showDetails}>
                <Stack spacing={2} sx={{ mt: 1.5 }}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ width: 32, height: 32, borderRadius: '12px', bgcolor: alpha(scoreColor, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconTarget size={14} color={scoreColor} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.primary' }}>Viral Potential</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', lineHeight: 1.4 }}>{clip.viralScore >= 85 ? 'High engagement expected' : clip.viralScore >= 70 ? 'Good potential for reach' : 'Consider stronger hook'}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ width: 32, height: 32, borderRadius: '12px', bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconBulb size={14} color="#3b82f6" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.primary' }}>Best Hook</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', lineHeight: 1.4 }}>{clip.hooks?.[0] || 'Start with a question'}</Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <Box sx={{ width: 32, height: 32, borderRadius: '12px', bgcolor: alpha('#10b981', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <IconClock size={14} color="#10b981" />
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: 'text.primary' }}>Best Time to Post</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', lineHeight: 1.4 }}>{clip.bestTime || '12:30 PM'}</Typography>
                    </Box>
                  </Stack>

                  <Box>
                    <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 1 }}>
                      <IconHash size={12} color="#5E35B1" />
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#5E35B1' }}>Recommended Hashtags</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                      {clip.hashtags?.map((tag, idx) => (
                        <Chip key={idx} label={tag} size="small" sx={{ borderRadius: '10px', height: 22, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.08), color: '#5E35B1', border: '1px solid', borderColor: alpha('#5E35B1', 0.12) }} />
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </Collapse>
            </>
          )}
        </Box>
      </Box>
    </Zoom>
  );
}

export default function GeneratedClipsQueue({ clips, isGenerating, jobStatus, jobProgress, jobMessage, clipCount, format, onPublish, onCleanup }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [localClips, setLocalClips] = useState([]);
  const [isCleaning, setIsCleaning] = useState(false);

  useEffect(() => {
    if (clips && clips.length > 0) {
      setLocalClips(clips);
      return;
    }

    if (!clipCount || !isGenerating) return;

    const initial = Array.from({ length: clipCount }).map((_, i) => ({
      id: i,
      progress: 0,
      status: 'generating',
      viralScore: Math.floor(Math.random() * 30) + 65,
      hookTime: '0:00',
      hashtags: HASHTAG_SETS[i % HASHTAG_SETS.length],
      hooks: HOOK_VARIANTS[i % HOOK_VARIANTS.length],
      bestTime: BEST_TIMES[i % BEST_TIMES.length],
      videoUrl: null,
      thumbnailUrl: null
    }));

    setLocalClips(initial);
  }, [clips, clipCount, isGenerating]);

  if (!localClips.length) return null;

  const hasRealClips = clips && clips.length > 0;
  const allReady = hasRealClips ? localClips.every((c) => c.status === 'ready') : false;
  const avgScore = Math.round(localClips.reduce((sum, c) => sum + c.viralScore, 0) / localClips.length);

  const FormatIcon = format === '9:16' ? IconDeviceMobile : format === '1:1' ? IconSquare : IconDeviceTv;
  const aspectRatio = format === '9:16' ? '9/16' : format === '1:1' ? '1/1' : '16/9';

  return (
    <Fade in>
      <Stack spacing={3}>
        <Box sx={{ borderRadius: '32px', border: '1px solid', borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04), bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(250, 251, 252, 0.6)', backdropFilter: 'blur(24px)', overflow: 'hidden', boxShadow: isDark ? '0 8px 40px rgba(0,0,0,0.3)' : '0 8px 40px rgba(0,0,0,0.04)' }}>
          <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04) }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ width: 40, height: 40, borderRadius: '16px', bgcolor: allReady ? alpha('#10b981', 0.12) : alpha('#5E35B1', 0.08), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {allReady ? <IconCheck size={20} color="#10b981" /> : isGenerating ? <CircularProgress size={20} sx={{ color: '#5E35B1' }} /> : <IconScissors size={20} color="#5E35B1" />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
                  {allReady ? 'All clips ready' : jobMessage || STATUS_LABELS[jobStatus] || 'Processing...'}
                </Typography>
                {!hasRealClips && isGenerating && jobProgress > 0 && jobProgress < 100 && (
                  <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.15 }}>
                    {Math.round(jobProgress)}% complete
                  </Typography>
                )}
              </Box>
              {allReady && (
                <Chip
                  icon={<IconSparkles size={14} />}
                  label={`Avg ${avgScore}%`}
                  size="small"
                  sx={{ borderRadius: '14px', fontWeight: 700, height: 28, fontSize: '0.75rem', bgcolor: alpha('#f59e0b', 0.1), color: '#f59e0b', '& .MuiChip-icon': { color: '#f59e0b' } }}
                />
              )}
            </Stack>
            {!allReady && isGenerating && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress variant="determinate" value={jobProgress || 0} sx={{ height: 6, borderRadius: '12px', bgcolor: alpha('#5E35B1', 0.06), '& .MuiLinearProgress-bar': { borderRadius: '12px', background: 'linear-gradient(90deg, #5E35B1, #7C4DFF)' } }} />
              </Box>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: clipCount <= 3 ? `repeat(${clipCount}, 1fr)` : 'repeat(3, 1fr)', md: clipCount <= 5 ? `repeat(${Math.min(clipCount, 3)}, 1fr)` : 'repeat(4, 1fr)' }, gap: 2.5, p: 2.5 }}>
            {localClips.map((clip, i) => (
              <ClipCard key={clip.id} clip={clip} i={i} aspectRatio={aspectRatio} isDark={isDark} FormatIcon={FormatIcon} hasRealClips={hasRealClips} jobProgress={jobProgress} jobMessage={jobMessage} />
            ))}
          </Box>

          {allReady && (
            <Box sx={{ borderTop: '1px solid', borderColor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04), p: 2.5, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button size="small" startIcon={<IconDownload size={18} />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', color: 'text.secondary', borderRadius: '14px', '&:hover': { bgcolor: alpha('#5E35B1', 0.06) } }} onClick={() => { localClips.forEach((clip) => { if (clip.videoUrl) window.open(clip.videoUrl, '_blank'); }); }}>
                Download All
              </Button>
              <Button size="small" startIcon={<IconShare size={18} />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', color: 'text.secondary', borderRadius: '14px', '&:hover': { bgcolor: alpha('#5E35B1', 0.06) } }}>
                Share
              </Button>
              <Button size="small" variant="contained" startIcon={<IconUpload size={18} />} onClick={onPublish} sx={{ textTransform: 'none', fontWeight: 700, fontSize: '0.85rem', borderRadius: '14px', background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)', boxShadow: `0 4px 16px ${alpha('#5E35B1', 0.3)}`, '&:hover': { background: 'linear-gradient(135deg, #4527A0, #651FFF)', boxShadow: `0 6px 24px ${alpha('#5E35B1', 0.4)}` } }}>
                Publish
              </Button>
              {onCleanup && (
                <Button size="small" startIcon={isCleaning ? <CircularProgress size={18} sx={{ color: '#ef4444' }} /> : <IconTrash size={18} />} disabled={isCleaning} onClick={async () => { setIsCleaning(true); await onCleanup(); setIsCleaning(false); }} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', color: '#ef4444', borderRadius: '14px', '&:hover': { bgcolor: alpha('#ef4444', 0.06) }, '&:disabled': { opacity: 0.5 } }}>
                  Free Disk Space
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Stack>
    </Fade>
  );
}
