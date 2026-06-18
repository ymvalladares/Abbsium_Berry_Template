import { useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { MONTHS } from '../constants';
import { getDaysInMonth } from '../utils';

export default function MiniCalendar({ year, month, onSelectDay, events, today }) {
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

  const hasEvent = (d) => {
    if (!d) return false;
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.some((e) => e.date === ds);
  };
  const isToday = (d) => d && d === today.getDate() && m === today.getMonth() && y === today.getFullYear();

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <IconButton
          size="small"
          onClick={() => {
            if (m === 0) {
              setM(11);
              setY(y - 1);
            } else setM(m - 1);
          }}
        >
          <ChevronLeft fontSize="small" />
        </IconButton>
        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>
          {MONTHS[m]} {y}
        </Typography>
        <IconButton
          size="small"
          onClick={() => {
            if (m === 11) {
              setM(0);
              setY(y + 1);
            } else setM(m + 1);
          }}
        >
          <ChevronRight fontSize="small" />
        </IconButton>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0, mb: 0.5 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <Typography key={i} sx={{ textAlign: 'center', fontSize: '0.65rem', fontWeight: 700, color: 'text.secondary', py: 0.3 }}>
            {d}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 0 }}>
        {cells.map((d, i) => (
          <Box
            key={i}
            onClick={() => d && onSelectDay(y, m, d)}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: '3px',
              cursor: d ? 'pointer' : 'default',
              borderRadius: '6px',
              '&:hover': d ? { bgcolor: alpha('#5E35B1', 0.07) } : {}
            }}
          >
            {d && (
              <>
                <Box
                  sx={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isToday(d) ? '#111' : 'transparent'
                  }}
                >
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: isToday(d) ? 700 : 400, color: isToday(d) ? '#fff' : 'text.primary' }}>
                    {d}
                  </Typography>
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
