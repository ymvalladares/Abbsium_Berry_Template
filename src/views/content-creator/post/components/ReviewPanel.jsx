import React, { useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconSparkles,
  IconSend,
  IconPhoto,
  IconVideo
} from '@tabler/icons-react';
import {
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest
} from '@tabler/icons-react';
import { GRADIENT_MAIN } from '../aiUi';

const PLATFORM_ICONS = {
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  twitter: IconBrandTwitter,
  linkedin: IconBrandLinkedin,
  pinterest: IconBrandPinterest
};

const PLATFORM_COLORS = {
  facebook: '#1877F2',
  instagram: '#E4405F',
  youtube: '#FF0000',
  tiktok: '#000000',
  twitter: '#1DA1F2',
  linkedin: '#0A66C2',
  pinterest: '#E60023'
};

const PLATFORM_NAMES = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  twitter: 'X',
  linkedin: 'LinkedIn',
  pinterest: 'Pinterest'
};

const TYPES = [
  { id: 'post', label: 'Post', icon: IconPhoto },
  { id: 'reel', label: 'Reel', icon: IconVideo },
  { id: 'video', label: 'Video', icon: IconPhoto }
];

export default function ReviewPanel({
  platforms,
  pages,
  type,
  file,
  title,
  description,
  scheduleType,
  scheduledDate,
  scheduledTime,
  onScheduleTypeChange,
  onScheduledDateChange,
  onScheduledTimeChange
}) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const getPlatformInfo = (id) => ({
    name: PLATFORM_NAMES[id] || id,
    icon: PLATFORM_ICONS[id] || IconSparkles,
    color: PLATFORM_COLORS[id] || '#999'
  });

  const getTypeInfo = () => TYPES.find((t) => t.id === type) || TYPES[0];

  return (
    <Box sx={{ display: 'flex', gap: 3 }}>
      <Box sx={{ width: 380, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
          Preview
        </Typography>

        <Box sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.75, pb: 1 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: GRADIENT_MAIN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <IconSparkles size={16} style={{ color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Your Account</Typography>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Just now</Typography>
            </Box>
          </Box>

          {file ? (
            <Box sx={{ width: '100%', height: 290, bgcolor: isDark ? '#1e293b' : '#f1f5f9', position: 'relative' }}>
              {file.type.startsWith('image') ? (
                <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha('#3b82f6', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconVideo size={28} style={{ color: '#3b82f6' }} />
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{file.name}</Typography>
                </Box>
              )}
              <Box sx={{ position: 'absolute', top: 12, right: 12, px: 1.25, py: 0.5, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {TYPES.find((t) => t.id === type)?.label}
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? '#1e293b' : '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ textAlign: 'center' }}>
                <IconPhoto size={28} style={{ color: 'text.disabled', marginBottom: 6 }} />
                <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>No media attached</Typography>
              </Box>
            </Box>
          )}

          <Box sx={{ p: 1.5 }}>
            {title && (
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>{title}</Typography>
            )}
            {description ? (
              <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5, whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</Typography>
            ) : (
              <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontStyle: 'italic' }}>No caption</Typography>
            )}
          </Box>

          <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconPhoto size={12} style={{ color: '#3b82f6' }} />
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>Like</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconSend size={12} style={{ color: '#3b82f6' }} />
              </Box>
              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>Share</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
          Publishing Details
        </Typography>

        <Stack spacing={2} sx={{ '& > :last-child': { mb: 0 } }}>
          <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Target Platforms</Typography>
              <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.08), color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700 }}>
                {platforms.length} selected
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.25 }}>
              {platforms.map((id) => {
                const p = getPlatformInfo(id);
                const Icon = p.icon;
                const account = pages[id];
                return (
                  <Box key={id} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid', borderColor: alpha(p.color, 0.15), bgcolor: alpha(p.color, 0.03) }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${alpha(p.color, 0.25)}` }}>
                        <Icon size={16} style={{ color: '#fff' }} />
                      </Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: p.color }}>{p.name}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {account ? account.accountName : 'Personal'}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Content Type
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#3b82f6', 0.04), border: '1px solid', borderColor: alpha('#3b82f6', 0.1) }}>
                {(() => {
                  const t = getTypeInfo();
                  const TIcon = t.icon;
                  return (
                    <>
                      <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <TIcon size={20} style={{ color: '#3b82f6' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.label}</Typography>
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                          {type === 'post' ? 'Standard post' : type === 'reel' ? 'Short-form video' : 'Long-form video'}
                        </Typography>
                      </Box>
                    </>
                  );
                })()}
              </Box>
            </Box>

            <Box sx={{ flex: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Schedule
              </Typography>

              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant={scheduleType === 'now' ? 'contained' : 'outlined'}
                    onClick={() => onScheduleTypeChange('now')}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      bgcolor: scheduleType === 'now' ? '#4CAF50' : 'transparent',
                      color: scheduleType === 'now' ? '#fff' : 'text.primary',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: scheduleType === 'now' ? '#43A047' : alpha('#4CAF50', 0.04) }
                    }}
                  >
                    Publish Now
                  </Button>
                  <Button
                    size="small"
                    variant={scheduleType === 'scheduled' ? 'contained' : 'outlined'}
                    onClick={() => onScheduleTypeChange('scheduled')}
                    sx={{
                      flex: 1,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: 2,
                      bgcolor: scheduleType === 'scheduled' ? '#3b82f6' : 'transparent',
                      color: scheduleType === 'scheduled' ? '#fff' : 'text.primary',
                      borderColor: 'divider',
                      '&:hover': { bgcolor: scheduleType === 'scheduled' ? '#2563eb' : alpha('#3b82f6', 0.04) }
                    }}
                  >
                    Schedule
                  </Button>
                </Stack>

                {scheduleType === 'scheduled' && (
                  <Stack spacing={1}>
                    <TextField
                      type="datetime-local"
                      size="small"
                      fullWidth
                      value={scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val) {
                          const [date, time] = val.split('T');
                          onScheduledDateChange(date);
                          onScheduledTimeChange(time);
                        }
                      }}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          fontSize: '0.8rem',
                          bgcolor: isDark ? '#1e293b' : '#f8fafc',
                          '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0' },
                          '&:hover fieldset': { borderColor: '#3b82f6' },
                          '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                        }
                      }}
                      inputProps={{
                        min: (() => { const d = new Date(Date.now() + 60000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; })()
                      }}
                    />
                    {scheduledDate && scheduledTime && (
                      <Typography sx={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600 }}>
                        Will publish on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                      </Typography>
                    )}
                  </Stack>
                )}

                {scheduleType === 'now' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#4CAF50', 0.04), border: '1px solid', borderColor: alpha('#4CAF50', 0.12) }}>
                    <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#4CAF50', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconSend size={16} style={{ color: '#4CAF50' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#4CAF50' }}>Immediate</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Publish right away</Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>

          <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Content Stats
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{title?.length || 0}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Title chars</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{description?.length || 0}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Caption chars</Typography>
              </Box>
              <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{(description?.match(/#/g) || []).length}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Hashtags</Typography>
              </Box>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
