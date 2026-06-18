import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Paper, Skeleton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { IconCheck, IconPhoto } from '@tabler/icons-react';
import { FILTER_CATEGORIES, PLATFORMS, MONTHS } from '../constants';
import { getDaysInMonth } from '../utils';

export default function FilterSidebar({ activeFilters, onToggle, events, today, onSelectDay, year, month, loading }) {
  const counts = {};
  FILTER_CATEGORIES.forEach(f => { counts[f.id] = events.filter(e => (e.platforms || []).includes(f.id) || e.platform === f.id).length; });

  return (
    <Box sx={{ width: 190, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '14px', p: '16px 14px' }}>
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
                <Box sx={{ width: 18, height: 18, borderRadius: '4px', bgcolor: active ? f.color : alpha(f.color, 0.15), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '14px', p: '14px 12px' }}>
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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

function MiniCalendar({ year, month, onSelectDay, events, today }) {
  const [y, setY] = useState(year);
  const [m, setM] = useState(month);

  useEffect(() => { setY(year); setM(month); }, [year, month]);

  const days = getDaysInMonth(y, m);
  const first = new Date(y, m, 1).getDay();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const hasEvent = d => {
    if (!d) return false;
    const ds = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return events.some(e => e.date === ds);
  };
  const isToday = d => d && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton size="small" onClick={() => { if (m === 0) { setM(11); setY(y-1); } else setM(m-1); }}><ChevronLeft fontSize="small" /></IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>{MONTHS[m]} {y}</Typography>
        <IconButton size="small" onClick={() => { if (m === 11) { setM(0); setY(y+1); } else setM(m+1); }}><ChevronRight fontSize="small" /></IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0, mb: 0.5 }}>
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <Typography key={i} sx={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.3 }}>{d}</Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0 }}>
        {cells.map((d, i) => (
          <Box key={i} onClick={() => d && onSelectDay(y, m, d)} sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', py: '3px',
            cursor: d ? 'pointer' : 'default', borderRadius: '6px',
            '&:hover': d ? { bgcolor: alpha('#5E35B1', 0.07) } : {},
          }}>
            {d && (
              <>
                <Box sx={{
                  width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  bgcolor: isToday(d) ? '#111' : 'transparent',
                }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: isToday(d) ? 700 : 400, color: isToday(d) ? '#fff' : 'text.primary' }}>{d}</Typography>
                </Box>
                {hasEvent(d) && <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#5E35B1', mt: '1px' }} />}
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
