import { Box, Typography } from '@mui/material';
import EventPill from './EventPill';

export default function DayCell({ day, dayEvents, isToday, isOtherMonth, onClick, onEventClick, maxVisible = 3 }) {
  const visible = dayEvents.slice(0, maxVisible);
  const overflow = dayEvents.length - maxVisible;

  return (
    <Box onClick={() => day && onClick(day)} sx={{
      minHeight: 110, p: '6px 6px 4px', cursor: day ? 'pointer' : 'default',
      bgcolor: isOtherMonth ? '#fafafa' : '#fff',
      position: 'relative', overflow: 'hidden',
      '&:hover': day ? { bgcolor: isOtherMonth ? '#f3f3f3' : '#f8f6ff' } : {},
      transition: 'background 0.13s',
    }}>
      {day && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '3px' }}>
            <Box sx={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isToday ? '#f97316' : 'transparent' }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#fff' : isOtherMonth ? '#aaa' : 'text.primary' }}>{day}</Typography>
            </Box>
          </Box>
          {visible.map(ev => <EventPill key={ev.id} event={ev} onClick={onEventClick} compact />)}
          {overflow > 0 && (
            <Typography sx={{ fontSize: '0.6rem', color: '#5E35B1', fontWeight: 700, cursor: 'pointer', px: '4px', '&:hover': { textDecoration: 'underline' } }}>
              +{overflow} more
            </Typography>
          )}
        </>
      )}
    </Box>
  );
}
