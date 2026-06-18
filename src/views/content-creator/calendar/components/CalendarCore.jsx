import { Box, Typography, IconButton, Button } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import { EventPill } from './EventComponents';

export const CalendarCore = ({ currentDate, setCurrentDate, events }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const prefixDays = Array.from({ length: (getDay(monthStart) + 6) % 7 });

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, minWidth: 160 }}>{format(currentDate, 'MMMM yyyy')}</Typography>
        <IconButton size="small" onClick={() => setCurrentDate(subMonths(currentDate, 1))}><ChevronLeft /></IconButton>
        <IconButton size="small" onClick={() => setCurrentDate(addMonths(currentDate, 1))}><ChevronRight /></IconButton>
        <Button size="small" onClick={() => setCurrentDate(new Date())}>Today</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderLeft: '1px solid #e0e0e0' }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <Typography key={d} sx={{ textAlign: 'center', py: 1, fontWeight: 700, borderTop: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', fontSize: '0.8rem', color: '#666' }}>{d}</Typography>
        ))}
        {prefixDays.map((_, i) => <Box key={`p-${i}`} sx={{ borderTop: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', minHeight: 110 }} />)}
        {daysInMonth.map((day, i) => (
          <Box key={i} sx={{ minHeight: 110, borderTop: '1px solid #e0e0e0', borderRight: '1px solid #e0e0e0', p: 1 }}>
            <Typography sx={{ fontWeight: 700, mb: 1 }}>{format(day, 'd')}</Typography>
            {events.filter(e => isSameDay(new Date(e.date), day)).map(e => (
              <EventPill key={e.id} title={e.title} color={e.color} textColor={e.textColor} />
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
