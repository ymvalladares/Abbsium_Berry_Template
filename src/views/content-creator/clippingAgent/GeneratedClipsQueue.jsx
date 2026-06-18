import { useEffect, useState } from 'react';
import { Box, Typography, Stack, LinearProgress, Button, Fade, Zoom, IconButton, Tooltip, Divider, Chip } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconCheck,
  IconDownload,
  IconCalendar,
  IconScissors,
  IconFlame,
  IconPlayerPlay,
  IconDeviceMobile,
  IconDeviceTv,
  IconSquare,
  IconUpload,
  IconHash,
  IconClock,
  IconCopy,
  IconRefresh,
  IconBrandTiktok,
  IconBrandInstagram,
  IconBrandYoutube,
  IconShare
} from '@tabler/icons-react';

const VIRAL_SCORES = [72, 85, 91, 68, 78, 88, 94, 76, 82, 89];
const HOOK_TIMES = ['0:03', '0:07', '0:12', '0:18', '0:24', '0:31', '0:42', '0:55', '1:08', '1:23'];

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

export default function GeneratedClipsQueue({ clipCount, duration, format, platforms, aiFeatures, onFinish }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [clips, setClips] = useState([]);

  useEffect(() => {
    if (!clipCount) return;

    const initial = Array.from({ length: clipCount }).map((_, i) => ({
      id: i,
      progress: 0,
      status: 'generating',
      viralScore: VIRAL_SCORES[i % VIRAL_SCORES.length],
      hookTime: HOOK_TIMES[i % HOOK_TIMES.length],
      hashtags: HASHTAG_SETS[i % HASHTAG_SETS.length],
      hooks: HOOK_VARIANTS[i % HOOK_VARIANTS.length],
      bestTime: BEST_TIMES[i % BEST_TIMES.length]
    }));

    setClips(initial);

    initial.forEach((clip, index) => {
      const interval = setInterval(
        () => {
          setClips((prev) =>
            prev.map((c) => {
              if (c.id !== clip.id) return c;
              const next = Math.min(c.progress + 10, 100);
              return { ...c, progress: next, status: next >= 100 ? 'ready' : 'generating' };
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

  const allReady = clips.every((c) => c.status === 'ready');
  const readyCount = clips.filter((c) => c.status === 'ready').length;
  const avgScore = Math.round(clips.reduce((sum, c) => sum + c.viralScore, 0) / clips.length);

  const FormatIcon = format === '9:16' ? IconDeviceMobile : format === '1:1' ? IconSquare : IconDeviceTv;
  const aspectRatio = format === '9:16' ? '9/16' : format === '1:1' ? '1/1' : '16/9';

  const hasAbTest = aiFeatures?.includes('abtest');
  const hasScoring = aiFeatures?.includes('scoring');
  const hasHooks = aiFeatures?.includes('hooks');

  return (
    <Fade in>
      <Stack spacing={2}>
        <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}>
          <Box sx={{ p: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: 1.5,
                  bgcolor: allReady ? alpha('#4CAF50', 0.1) : alpha('#5E35B1', 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {allReady ? <IconCheck size={14} color="#4CAF50" /> : <IconScissors size={14} color="#5E35B1" />}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                  {allReady ? 'All clips ready' : `Generating... ${readyCount}/${clipCount}`}
                </Typography>
              </Box>
              {allReady && hasScoring && (
                <Chip
                  icon={<IconFlame size={12} />}
                  label={`Avg ${avgScore}%`}
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    fontWeight: 600,
                    height: 22,
                    fontSize: '0.65rem',
                    bgcolor: alpha('#FF9800', 0.1),
                    color: '#FF9800',
                    '& .MuiChip-icon': { color: '#FF9800' }
                  }}
                />
              )}
            </Stack>
            {!allReady && (
              <Box sx={{ mt: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(readyCount / clipCount) * 100}
                  sx={{
                    height: 3,
                    borderRadius: 1.5,
                    bgcolor: alpha('#5E35B1', 0.1),
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 1.5,
                      background: 'linear-gradient(90deg, #5E35B1, #7C4DFF)'
                    }
                  }}
                />
              </Box>
            )}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: clipCount <= 3 ? `repeat(${clipCount}, 1fr)` : 'repeat(3, 1fr)',
                md: clipCount <= 5 ? `repeat(${Math.min(clipCount, 3)}, 1fr)` : 'repeat(4, 1fr)'
              },
              gap: 1.5,
              p: 1.5
            }}
          >
            {clips.map((clip, i) => {
              const ready = clip.status === 'ready';
              return (
                <Zoom key={clip.id} in timeout={300 + i * 80}>
                  <Box
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid',
                      borderColor: ready ? 'divider' : alpha('#5E35B1', 0.15),
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease',
                      '&:hover': ready
                        ? {
                            borderColor: '#5E35B1',
                            boxShadow: '0 4px 20px rgba(94, 53, 177, 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        : {}
                    }}
                  >
                    <Box
                      sx={{
                        aspectRatio,
                        bgcolor: '#0a0a0a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {ready ? (
                        <>
                          <Box
                            sx={{
                              position: 'absolute',
                              inset: 0,
                              background: `linear-gradient(135deg, hsl(${clip.viralScore * 3.6}, 60%, 25%), hsl(${clip.viralScore * 3.6 + 40}, 50%, 15%))`,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <FormatIcon size={24} style={{ color: 'rgba(255,255,255,0.15)' }} />
                          </Box>

                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              bgcolor: 'rgba(255,255,255,0.15)',
                              backdropFilter: 'blur(8px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              position: 'relative',
                              zIndex: 1
                            }}
                          >
                            <IconPlayerPlay size={14} style={{ color: '#fff', marginLeft: 2 }} />
                          </Box>

                          {hasScoring && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 6,
                                left: 6,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 0.75,
                                bgcolor: clip.viralScore >= 85 ? '#4CAF50' : clip.viralScore >= 70 ? '#FF9800' : '#f44336',
                                zIndex: 1
                              }}
                            >
                              <IconFlame size={8} style={{ color: '#fff' }} />
                              <Typography sx={{ fontSize: '0.55rem', fontWeight: 800, color: '#fff' }}>{clip.viralScore}</Typography>
                            </Box>
                          )}

                          {hasHooks && (
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: 6,
                                right: 6,
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 0.75,
                                bgcolor: 'rgba(0,0,0,0.6)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 1
                              }}
                            >
                              <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: '#fff' }}>{clip.hookTime}</Typography>
                            </Box>
                          )}

                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 6,
                              left: 6,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.4,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.75,
                              bgcolor: 'rgba(94, 53, 177, 0.85)',
                              backdropFilter: 'blur(4px)',
                              zIndex: 1
                            }}
                          >
                            <IconClock size={8} style={{ color: '#fff' }} />
                            <Typography sx={{ fontSize: '0.5rem', fontWeight: 700, color: '#fff' }}>{clip.bestTime}</Typography>
                          </Box>
                        </>
                      ) : (
                        <Stack spacing={0.75} alignItems="center">
                          <Box sx={{ position: 'relative', width: 36, height: 36 }}>
                            <svg width="36" height="36" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                              <circle cx="18" cy="18" r="14" fill="none" stroke={alpha('#5E35B1', 0.15)} strokeWidth="2.5" />
                              <circle
                                cx="18"
                                cy="18"
                                r="14"
                                fill="none"
                                stroke="#5E35B1"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeDasharray={`${clip.progress} ${100 - clip.progress}`}
                                strokeDashoffset="0"
                                pathLength="100"
                                style={{ transition: 'stroke-dasharray 0.3s ease' }}
                              />
                            </svg>
                            <Box
                              sx={{
                                position: 'absolute',
                                inset: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: '#5E35B1' }}>{clip.progress}</Typography>
                            </Box>
                          </Box>
                        </Stack>
                      )}
                    </Box>

                    <Box sx={{ p: 1 }}>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>Clip #{i + 1}</Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.6rem' }}>{duration?.label}</Typography>
                        </Box>
                        {ready && (
                          <Stack direction="row" spacing={0}>
                            <Tooltip title="Download">
                              <IconButton size="small" sx={{ width: 24, height: 24 }}>
                                <IconDownload size={12} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Schedule">
                              <IconButton size="small" sx={{ width: 24, height: 24, color: '#5E35B1' }}>
                                <IconCalendar size={12} />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        )}
                      </Stack>

                      {ready && (
                        <>
                          <Divider sx={{ my: 0.75 }} />

                          {hasAbTest && (
                            <Box sx={{ mb: 0.75 }}>
                              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                                <IconRefresh size={9} color="#5E35B1" />
                                <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: '#5E35B1' }}>A/B HOOKS</Typography>
                              </Stack>
                              <Stack spacing={0.4}>
                                {clip.hooks.slice(0, 2).map((hook, idx) => (
                                  <Box
                                    key={idx}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      px: 0.75,
                                      py: 0.4,
                                      borderRadius: 0.75,
                                      bgcolor: isDark ? alpha('#5E35B1', 0.12) : alpha('#5E35B1', 0.04),
                                      border: '1px solid',
                                      borderColor: isDark ? alpha('#5E35B1', 0.25) : alpha('#5E35B1', 0.1)
                                    }}
                                  >
                                    <Typography sx={{ fontSize: '0.5rem', fontWeight: 800, color: '#5E35B1' }}>{idx + 1}</Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '0.55rem',
                                        fontWeight: 500,
                                        flex: 1,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                      }}
                                    >
                                      {hook}
                                    </Typography>
                                    <IconButton size="small" sx={{ width: 14, height: 14, p: 0 }}>
                                      <IconCopy size={8} />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Stack>
                            </Box>
                          )}

                          <Box>
                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                              <IconHash size={9} color="#5E35B1" />
                              <Typography sx={{ fontSize: '0.55rem', fontWeight: 700, color: '#5E35B1' }}>HASHTAGS</Typography>
                            </Stack>
                            <Stack direction="row" spacing={0.4} flexWrap="wrap" useFlexGap>
                              {clip.hashtags.map((tag, idx) => (
                                <Chip
                                  key={idx}
                                  label={tag}
                                  size="small"
                                  sx={{
                                    borderRadius: 1,
                                    height: 16,
                                    fontSize: '0.5rem',
                                    fontWeight: 600,
                                    bgcolor: isDark ? alpha('#5E35B1', 0.15) : alpha('#5E35B1', 0.06),
                                    color: '#5E35B1'
                                  }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </Zoom>
              );
            })}
          </Box>

          {allReady && (
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5, display: 'flex', justifyContent: 'center', gap: 1 }}>
              <Button
                size="small"
                startIcon={<IconDownload size={14} />}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}
              >
                Download
              </Button>
              <Button size="small" startIcon={<IconShare size={14} />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem' }}>
                Share
              </Button>
              <Button
                size="small"
                variant="contained"
                startIcon={<IconUpload size={14} />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
                  '&:hover': { background: 'linear-gradient(135deg, #4527A0, #651FFF)' }
                }}
              >
                Publish
              </Button>
            </Box>
          )}
        </Box>
      </Stack>
    </Fade>
  );
}
