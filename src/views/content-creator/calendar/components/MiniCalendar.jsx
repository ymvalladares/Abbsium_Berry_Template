import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { PLATFORMS, MONTHS } from '../constants';
import { getDaysInMonth } from '../utils';

export default function MiniCalendar({ year, month, onSelectDay, events, today }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [y, setY] = useState(year);
  const [m, setM] = useState(month);

  useEffect(() => {
    setY(year);
    setM(month);
  }, [year, month]);

  const days = getDaysInMonth(y, m);
  const first = new Date(y, m, 1).getDay();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const getDayEvents = (d) => {
    if (!d) return [];
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.filter((e) => e.date === ds);
  };

  const isToday = (d) => d && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  return (
    <Box sx={{
      p: 1.5,
      borderRadius: '12px',
      bgcolor: isDark ? alpha('#1e293b', 0.5) : alpha('#f8f9fa', 0.5),
      border: '1px solid',
      borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
    }}>
      {/* Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <IconButton
          size="small"
          onClick={() => {
            if (m === 0) { setM(11); setY(y - 1); } else setM(m - 1);
          }}
          sx={{
            bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.03),
            '&:hover': { bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.06) },
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography sx={{
          fontWeight: 700,
          fontSize: '0.8rem',
          color: isDark ? '#f1f5f9' : '#1e293b',
        }}>
          {MONTHS[m]} {y}
        </Typography>
        <IconButton
          size="small"
          onClick={() => {
            if (m === 11) { setM(0); setY(y + 1); } else setM(m + 1);
          }}
          sx={{
            bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.03),
            '&:hover': { bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.06) },
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>

      {/* Day Headers */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', mb: 0.5 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Typography key={i} sx={{
            textAlign: 'center',
            fontSize: '0.6rem',
            fontWeight: 700,
            color: 'text.secondary',
            py: 0.5,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {d}
          </Typography>
        ))}
      </Box>

      {/* Days Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {cells.map((d, i) => {
          const dayEvts = getDayEvents(d);
          return (
            <Box
              key={i}
              onClick={() => d && onSelectDay(y, m, d)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                py: '4px',
                cursor: d ? 'pointer' : 'default',
                borderRadius: '6px',
                transition: 'all 0.15s ease',
                '&:hover': d ? {
                  bgcolor: isDark ? alpha('#5E35B1', 0.15) : alpha('#5E35B1', 0.08),
                } : {},
              }}
            >
              {d && (
                <>
                  <Box
                    sx={{
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isToday(d) ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'transparent',
                      boxShadow: isToday(d) ? '0 2px 6px rgba(249,115,22,0.3)' : 'none',
                    }}
                  >
                    <Typography sx={{
                      fontSize: '0.65rem',
                      fontWeight: isToday(d) ? 700 : 400,
                      color: isToday(d) ? '#fff' : (isDark ? '#e2e8f0' : '#1e293b'),
                    }}>
                      {d}
                    </Typography>
                  </Box>
                  {/* Mini platform icons */}
                  {dayEvts.length > 0 && (
                    <Box sx={{
                      display: 'flex',
                      gap: '1px',
                      mt: '2px',
                      justifyContent: 'center',
                    }}>
                      {dayEvts.slice(0, 3).map((ev, idx) => {
                        const platformColor = ev.platformColor || '#4CAF50';
                        return (
                          <Box key={idx} sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: ev.isHistory ? platformColor : '#5E35B1',
                          }} />
                        );
                      })}
                    </Box>
                  )}
                </>
              )}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
