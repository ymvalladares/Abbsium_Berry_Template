import { Box, Typography, Skeleton } from '@mui/material';
import { DAYS_HEADER } from '../constants';
import { getDaysInMonth, getFirstDayOfMonth } from '../utils';
import DayCell from './DayCell';

export default function MonthView({ year, month, events, today, onDayClick, onEventClick, loading }) {
  const days = getDaysInMonth(year, month);
  const first = getFirstDayOfMonth(year, month);
  const cells = [];

  const prevDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDays - i, other: true });
  for (let d = 1; d <= days; d++) cells.push({ day: d, other: false });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - days - first + 1, other: true });

  const getEvs = (d, other) => {
    if (other) return [];
    const ds = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    return events.filter(e => e.date === ds).sort((a,b) => (a.time||'').localeCompare(b.time||''));
  };

  const isToday_ = (d, other) => !other && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  if (loading) {
    return (
      <Box sx={{ flex: 1, overflow: 'hidden', borderRadius: '0 0 14px 14px' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid', borderColor: 'divider' }}>
          {DAYS_HEADER.map(d => (
            <Box key={d} sx={{ py: 1, textAlign: 'center' }}>
              <Skeleton width={30} height={14} sx={{ mx: 'auto' }} />
            </Box>
          ))}
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
          {Array.from({ length: 35 }).map((_, idx) => {
            const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
            const borderBottom = idx < 28 ? '1px solid' : 'none';
            return (
              <Box key={idx} sx={{ borderRight, borderBottom, borderColor: 'divider', p: '6px 6px 4px', minHeight: 110 }}>
                <Skeleton width={26} height={26} variant="circular" sx={{ ml: 'auto', mb: '8px' }} />
                <Skeleton width="80%" height={12} sx={{ mb: 0.5 }} />
                <Skeleton width="60%" height={12} />
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: 'hidden', borderRadius: '0 0 14px 14px' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid', borderColor: 'divider' }}>
        {DAYS_HEADER.map(d => (
          <Box key={d} sx={{ py: 1, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary' }}>{d}</Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map(({ day, other }, idx) => {
          const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
          const borderBottom = idx < cells.length - 7 ? '1px solid' : 'none';
          return (
            <Box key={idx} sx={{ borderRight, borderBottom, borderColor: 'divider' }}>
              <DayCell
                day={day} dayEvents={getEvs(day, other)}
                isToday={isToday_(day, other)} isOtherMonth={other}
                onClick={d => !other && onDayClick(year, month, d)}
                onEventClick={onEventClick}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
