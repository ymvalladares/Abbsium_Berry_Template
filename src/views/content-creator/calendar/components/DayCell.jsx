import { Box, Typography } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import EventPill from './EventPill';

export default function DayCell({ day, dayEvents, isToday, isOtherMonth, onClick, onEventClick, maxVisible = 3 }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const visible = dayEvents.slice(0, maxVisible);
  const overflow = dayEvents.length - maxVisible;

  return (
    <Box onClick={() => day && onClick(day)} sx={{
      minHeight: 110, p: '6px 6px 4px', cursor: day ? 'pointer' : 'default',
      bgcolor: isOtherMonth ? (isDark ? '#0f172a' : '#fafafa') : (isDark ? '#111827' : '#fff'),
      position: 'relative', overflow: 'hidden',
      '&:hover': day ? { bgcolor: isOtherMonth ? (isDark ? '#1a1f35' : '#f3f3f3') : (isDark ? '#1e293b' : '#f8f6ff') } : {},
      transition: 'background 0.13s',
    }}>
      {day && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '3px' }}>
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isToday ? '#f97316' : 'transparent' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : isOtherMonth ? (isDark ? '#475569' : '#aaa') : 'text.primary' }}>{day}</Typography>
            </Box>
          </Box>
          {visible.map(ev => <EventPill key={ev.id} event={ev} onClick={onEventClick} compact />)}
          {overflow > 0 && (
            <Typography sx={{ fontSize: '0.6rem', color: isDark ? '#b388ff' : '#5E35B1', fontWeight: 700, cursor: 'pointer', px: '4px', '&:hover': { textDecoration: 'underline' } }}>
              +{overflow} more
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
