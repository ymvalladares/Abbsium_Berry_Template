import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  IconButton,
  Dialog,
  DialogContent,
  CircularProgress
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconX,
  IconCheck,
  IconAlertCircle,
  IconSparkles
} from '@tabler/icons-react';
import Confetti from './Confetti';
import { GRADIENT_MAIN } from '../aiUi';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', color: '#000000' },
  { id: 'twitter', name: 'X', color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' },
  { id: 'pinterest', name: 'Pinterest', color: '#E60023' }
];

import {
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest
} from '@tabler/icons-react';

const PLATFORM_ICONS = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  twitter: IconBrandTwitter,
  linkedin: IconBrandLinkedin,
  pinterest: IconBrandPinterest
};

export default function PublishModal({
  open,
  onClose,
  posting,
  networkStatuses,
  publishSummary,
  platforms,
  successCount,
  onReset
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getPlatformInfo = (id) => {
    const p = PLATFORMS.find((pl) => pl.id === id);
    return {
      name: p?.name || id,
      color: p?.color || '#999',
      icon: PLATFORM_ICONS[id] || IconAlertCircle
    };
  };

  const totalPlatforms = platforms.length;
  const completedPlatforms = Object.values(networkStatuses).filter((s) => s.status === 'success').length;
  const progressPercent = totalPlatforms > 0 ? (completedPlatforms / totalPlatforms) * 100 : 0;

  const showSuccess = !posting && publishSummary && publishSummary.successful === publishSummary.total;
  const showPartial = !posting && publishSummary && publishSummary.successful !== publishSummary.total;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 5, overflow: 'hidden', position: 'relative' } }}
    >
      <DialogContent sx={{ p: 0 }}>
        {showSuccess ? <Confetti /> : null}

        <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute', top: 16, right: 16,
              color: 'text.secondary',
              bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' },
              width: 36, height: 36, minWidth: 0
            }}
          >
            <IconX size={18} />
          </IconButton>

          {showSuccess && (
            <Box sx={{ mb: 2, animation: 'scaleIn 0.5s ease' }}>
              <Box sx={{
                width: 88, height: 88, mx: 'auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(76,175,80,0.35)',
                animation: 'bounceIn 0.6s ease'
              }}>
                <IconCheck size={44} style={{ color: '#fff', strokeWidth: 2.5 }} />
              </Box>
            </Box>
          )}

          {posting && (
            <Box sx={{ mb: 2.5, position: 'relative', width: 88, height: 88, mx: 'auto' }}>
              <Box sx={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                border: '3px solid', borderColor: alpha('#3b82f6', 0.15),
                animation: 'pulse 2s ease-in-out infinite'
              }} />
              <Box sx={{
                position: 'absolute', inset: 8, borderRadius: '50%',
                border: '3px solid', borderColor: alpha('#3b82f6', 0.25),
                animation: 'pulse 2s ease-in-out infinite 0.3s'
              }} />
              <Box sx={{
                position: 'relative',
                width: 88, height: 88,
                borderRadius: '50%',
                background: GRADIENT_MAIN,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(59,130,246,0.3)'
              }}>
                <CircularProgress size={40} sx={{ color: '#fff' }} />
              </Box>
            </Box>
          )}

          {showPartial && (
            <Box sx={{ mb: 2, animation: 'scaleIn 0.5s ease' }}>
              <Box sx={{
                width: 88, height: 88, mx: 'auto',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(255,152,0,0.3)'
              }}>
                <IconAlertCircle size={44} style={{ color: '#fff', strokeWidth: 2.5 }} />
              </Box>
            </Box>
          )}

          <Typography sx={{
            fontWeight: 800, fontSize: { xs: '1.3rem', sm: '1.5rem' }, mb: 0.5,
            color: posting ? '#3b82f6'
              : showSuccess ? '#4CAF50'
              : '#FF9800'
          }}>
            {posting ? 'Publishing...' : showSuccess ? 'Published!' : 'Partially Published'}
          </Typography>
          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.95rem' }, mb: 3, lineHeight: 1.5 }}>
            {posting
              ? `Publishing to ${totalPlatforms} platform${totalPlatforms > 1 ? 's' : ''}`
              : publishSummary
                ? `${publishSummary.successful} of ${publishSummary.total} platforms`
                : `${successCount} of ${totalPlatforms} platforms`}
          </Typography>

          {posting && (
            <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Progress</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
                  {completedPlatforms}/{totalPlatforms}
                </Typography>
              </Box>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                <Box sx={{
                  height: '100%', borderRadius: 4,
                  background: GRADIENT_MAIN,
                  width: `${progressPercent}%`,
                  transition: 'width 0.5s ease'
                }} />
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 3, maxHeight: 280, overflowY: 'auto', px: { xs: 0.5, sm: 0 } }}>
            <Stack spacing={1}>
              {Object.entries(networkStatuses).map(([id, statusData]) => {
                const p = getPlatformInfo(id);
                const Icon = p.icon;
                const ok = statusData.status === 'success';
                const err = statusData.status === 'error';
                const progress = statusData.progress || 0;
                return (
                  <Box
                    key={id}
                    sx={{
                      p: { xs: 1.25, sm: 1.5 },
                      borderRadius: 3,
                      bgcolor: ok ? alpha('#4CAF50', 0.06) : err ? alpha('#f44336', 0.06) : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.04)',
                      border: '1px solid',
                      borderColor: ok ? alpha('#4CAF50', 0.2) : err ? alpha('#f44336', 0.2) : alpha('#3b82f6', 0.12),
                      transition: 'all 0.3s ease',
                      animation: ok ? 'slideIn 0.4s ease' : 'none'
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 } }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: 2.5,
                        bgcolor: p.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${alpha(p.color, 0.25)}`
                      }}>
                        <Icon size={20} style={{ color: '#fff' }} />
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                            {statusData.network || p.name}
                          </Typography>
                        </Stack>
                        {ok ? (
                          statusData.postUrl ? (
                            <Typography
                              sx={{
                                fontSize: '0.8rem', color: '#1877F2',
                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                textDecoration: 'none', '&:hover': { textDecoration: 'underline' }
                              }}
                              component="a" href={statusData.postUrl} target="_blank" rel="noopener noreferrer"
                            >
                              View post →
                            </Typography>
                          ) : statusData.postId ? (
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Post ID: {statusData.postId}</Typography>
                          ) : (
                            <Typography sx={{ fontSize: '0.75rem', color: '#4CAF50', fontWeight: 600 }}>Published</Typography>
                          )
                        ) : err ? (
                          <Typography sx={{ fontSize: '0.75rem', color: '#f44336', lineHeight: 1.4 }}>
                            {statusData.error || 'Failed to publish'}
                          </Typography>
                        ) : (
                          <>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                              {statusData.message || 'Publishing...'}
                            </Typography>
                            <Box sx={{ height: 5, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                              <Box sx={{
                                height: '100%', borderRadius: 3,
                                background: GRADIENT_MAIN,
                                width: `${progress}%`,
                                transition: 'width 0.3s ease'
                              }} />
                            </Box>
                            <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.25, textAlign: 'right' }}>
                              {progress}%
                            </Typography>
                          </>
                        )}
                      </Box>

                      <Box sx={{
                        px: 1, py: 0.5, borderRadius: 2,
                        bgcolor: ok ? alpha('#4CAF50', 0.12) : err ? alpha('#f44336', 0.12) : alpha('#3b82f6', 0.1),
                        fontSize: '0.65rem', fontWeight: 700,
                        color: ok ? '#4CAF50' : err ? '#f44336' : '#3b82f6',
                        flexShrink: 0
                      }}>
                        {ok ? 'Done' : err ? 'Error' : '...'}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {!posting && (
            <Stack spacing={1.25}>
              <Button
                variant="contained"
                fullWidth
                onClick={onReset}
                startIcon={<IconSparkles size={18} />}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 700,
                  py: 1.4,
                  fontSize: '0.95rem',
                  background: GRADIENT_MAIN,
                  boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                  '&:hover': {
                    boxShadow: '0 6px 25px rgba(59,130,246,0.45)',
                    transform: 'translateY(-1px)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Create Another Post
              </Button>
              <Button
                variant="text"
                fullWidth
                onClick={onClose}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.2,
                  color: 'text.secondary',
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }
                }}
              >
                Close
              </Button>
            </Stack>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
