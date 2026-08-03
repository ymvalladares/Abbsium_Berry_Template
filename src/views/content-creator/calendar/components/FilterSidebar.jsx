import { Box, Typography, Paper, Skeleton } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { IconCheck, IconPhoto } from '@tabler/icons-react';
import { FILTER_CATEGORIES, PLATFORMS } from '../constants';
import MiniCalendar from './MiniCalendar';

export default function FilterSidebar({ activeFilters, onToggle, events, today, onSelectDay, year, month, loading }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const counts = {};
  FILTER_CATEGORIES.forEach(f => { counts[f.id] = events.filter(e => (e.platforms || []).includes(f.id) || e.platform === f.id).length; });

  return (
    <Box sx={{
      width: 190,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <Paper elevation={0} sx={{
        border: '1px solid',
        borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
        borderRadius: '14px',
        p: '16px 14px',
        bgcolor: isDark ? alpha('#1e293b', 0.3) : undefined,
      }}>
        <Typography sx={{ fontWeight: 800, fontSize: '0.85rem', mb: 1.5 }}>Filters</Typography>
        {loading ? (
          Array.from({ length: 7 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: '5px', px: '6px' }}>
              <Skeleton variant="rounded" width={18} height={18} />
              <Skeleton width={60} height={14} />
              <Skeleton width={12} height={12} sx={{ ml: 'auto' }} />
            </Box>
          ))
        ) : (
          FILTER_CATEGORIES.map(f => {
            const Icon = PLATFORMS.find(p => p.id === f.id)?.icon || IconPhoto;
            const active = activeFilters.includes(f.id);
            return (
              <Box key={f.id} onClick={() => onToggle(f.id)} sx={{
                display: 'flex', alignItems: 'center', gap: 1, py: '5px', px: '6px',
                borderRadius: '8px', cursor: 'pointer', transition: 'all 0.12s',
                bgcolor: active ? alpha(f.color, 0.06) : 'transparent',
                '&:hover': { bgcolor: alpha(f.color, 0.08) },
              }}>
                <Box sx={{
                  width: 18, height: 18, borderRadius: '4px',
                  bgcolor: active ? f.color : alpha(f.color, 0.15),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {active ? <IconCheck size={10} style={{ color: '#fff' }} /> : <Icon size={10} style={{ color: f.color }} />}
                </Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, flex: 1, color: active ? 'text.primary' : 'text.secondary' }}>{f.label}</Typography>
                {counts[f.id] > 0 && (
                  <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: active ? f.color : 'text.secondary' }}>{counts[f.id]}</Typography>
                )}
              </Box>
            );
          })
        )}
      </Paper>

      <Paper elevation={0} sx={{
        border: '1px solid',
        borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
        borderRadius: '14px',
        overflow: 'hidden',
        bgcolor: isDark ? alpha('#1e293b', 0.3) : undefined,
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Skeleton width={20} height={20} />
              <Skeleton width={70} height={16} />
              <Skeleton width={20} height={20} />
            </Box>
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <Skeleton key={i} width={20} height={12} sx={{ mx: 'auto' }} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <Box key={i} sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0 }}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <Skeleton key={j} width={20} height={20} sx={{ mx: 'auto' }} />
                ))}
              </Box>
            ))}
          </Box>
        ) : (
          <MiniCalendar year={year} month={month} onSelectDay={onSelectDay} events={events} today={today} />
        )}
      </Paper>
    </Box>
  );
}
