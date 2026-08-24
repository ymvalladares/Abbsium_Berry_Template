import { Box, Typography, Tooltip } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { memo } from 'react';
import { PLATFORMS } from '../constants';

const ET_TIMEZONE = 'America/New_York';

function toEasternTime(dateStr, timeStr) {
  if (!dateStr || !timeStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes));
  return utcDate.toLocaleString('en-US', {
    timeZone: ET_TIMEZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  });
}

export default memo(function DayCell({ day, dayEvents, isToday, isOtherMonth, isPast, onClick, onEventClick }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const hasEvents = dayEvents.length > 0;
  const maxDots = 7;

  return (
    <Box
      onClick={() => day && !isPast && onClick(day)}
      sx={{
        minHeight: { xs: 60, sm: 95, md: 110 },
        p: { xs: '4px 3px', sm: '7px 6px' },
        cursor: day && !isPast ? 'pointer' : 'default',
        bgcolor: isOtherMonth
          ? (isDark ? '#0f172a' : '#fafbfc')
          : (isDark ? '#111827' : '#ffffff'),
        position: 'relative',
        overflow: 'hidden',
        opacity: isPast ? 0.4 : 1,
        transition: 'all 0.2s ease',
        '&:hover': day && !isPast ? {
          bgcolor: isOtherMonth
            ? (isDark ? '#1a1f35' : '#f0f4ff')
            : (isDark ? '#1e293b' : '#dbeafe'),
          boxShadow: {
            xs: 'none',
            sm: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 16px rgba(59,130,246,0.08)',
          },
          zIndex: 1,
        } : {},
      }}
    >
      {day && (
        <>
          {/* Day number */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mb: { xs: '3px', sm: '6px' },
            pr: '1px',
          }}>
            <Box sx={{
              width: { xs: 18, sm: 26 },
              height: { xs: 18, sm: 26 },
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isToday ? 'linear-gradient(135deg, #f97316, #fb923c)' : 'transparent',
              boxShadow: isToday ? { xs: '0 1px 4px rgba(249,115,22,0.25)', sm: '0 2px 8px rgba(249,115,22,0.35)' } : 'none',
            }}>
              <Typography sx={{
                fontSize: { xs: '0.6rem', sm: '0.8rem' },
                fontWeight: isToday ? 700 : 400,
                color: isToday
                  ? '#fff'
                  : isOtherMonth
                    ? (isDark ? '#475569' : '#b0b0b0')
                    : (isDark ? '#e2e8f0' : '#1e293b'),
              }}>
                {day}
              </Typography>
            </Box>
          </Box>

          {/* Event dots */}
          {hasEvents && (
            <Box sx={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: { xs: '2px', sm: '3px' },
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
              {dayEvents.slice(0, maxDots).map((ev) => {
                const platformColor = ev.platformColor || '#4CAF50';
                const isScheduled = ev.isScheduled === true;
                const plat = ev.platforms?.[0] ? PLATFORMS.find(p => p.id === ev.platforms[0]) : null;
                const shortTime = toEasternTime(ev.date, ev.time).replace(/\s?[A-Z]{2,4}$/, '').trim();

                return (
                  <Tooltip
                    key={ev.id}
                    title={
                      <Box sx={{ p: 1 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.3 }}>
                          {ev.title}
                        </Typography>
                        {shortTime && (
                          <Typography sx={{ fontSize: '0.7rem', opacity: 0.75, fontFamily: 'monospace' }}>
                            {shortTime}
                          </Typography>
                        )}
                        {isScheduled && (
                          <Typography sx={{ fontSize: '0.65rem', color: '#FF9800', mt: 0.3, fontWeight: 600 }}>
                            Scheduled
                          </Typography>
                        )}
                      </Box>
                    }
                    arrow
                    placement="top"
                  >
                    <Box
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick && onEventClick(ev);
                      }}
                      sx={{
                        width: { xs: 6, sm: 7 },
                        height: { xs: 6, sm: 7 },
                        borderRadius: '50%',
                        bgcolor: isScheduled ? '#FF9800' : platformColor,
                        boxShadow: isScheduled ? `0 0 6px ${alpha('#FF9800', 0.5)}` : `0 0 6px ${alpha(platformColor, 0.5)}`,
                        flexShrink: 0,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          transform: { xs: 'none', sm: 'scale(1.6)' },
                        },
                      }}
                    />
                  </Tooltip>
                );
              })}
              {dayEvents.length > maxDots && (
                <Typography sx={{
                  fontSize: { xs: '0.5rem', sm: '0.6rem' },
                  fontWeight: 700,
                  color: isDark ? '#94a3b8' : '#64748b',
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  +{dayEvents.length - maxDots}
                </Typography>
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
});