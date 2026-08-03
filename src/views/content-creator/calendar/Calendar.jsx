import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Paper, alpha, useTheme, useMediaQuery, Chip, CircularProgress, Dialog, Stack
} from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import {
  ChevronLeft, ChevronRight, Add, Replay, Close, AccessTime, CalendarToday
} from '@mui/icons-material';
import {
  IconPhoto, IconSend, IconBrandTiktok, IconVideo, IconCheck
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';
import { PLATFORMS, DAYS_HEADER, MONTHS } from './constants';
import { getDaysInMonth, getFirstDayOfMonth, formatTime } from './utils';
import ScheduleDialog from './components/ScheduleDialog';
import DayCell from './components/DayCell';

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

export default function Calendar() {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const notify = useNotification();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState(null);
  const [detailEvent, setDetailEvent] = useState(null);
  const [historyItems, setHistoryItems] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [dayPopupOpen, setDayPopupOpen] = useState(false);
  const [dayPopupEvents, setDayPopupEvents] = useState([]);
  const [dayPopupDate, setDayPopupDate] = useState('');

  const mapHistoryToEvents = useCallback((items) => {
    return items.filter(item => item.success && item.publishedAt).map(item => {
      const pubDate = new Date(item.publishedAt);
      const etDate = new Date(pubDate.toLocaleString('en-US', { timeZone: ET_TIMEZONE }));
      const dateStr = `${etDate.getFullYear()}-${String(etDate.getMonth() + 1).padStart(2, '0')}-${String(etDate.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(etDate.getHours()).padStart(2, '0')}:${String(etDate.getMinutes()).padStart(2, '0')}`;
      const plat = PLATFORMS.find(p => p.name === item.platform);
      return {
        id: item.id,
        title: `${item.platform}`,
        date: dateStr,
        time: timeStr,
        platforms: [plat?.id || ''],
        platformIcon: plat?.icon || IconPhoto,
        platformColor: plat?.color || '#999',
        postUrl: item.postUrl,
        postId: item.postId,
        isHistory: true
      };
    });
  }, []);

  const mapScheduledToEvents = useCallback((items) => {
    return items.filter(item => item.status === 'scheduled').map(item => {
      const schedDate = new Date(item.scheduledFor);
      const etDate = new Date(schedDate.toLocaleString('en-US', { timeZone: ET_TIMEZONE }));
      const dateStr = `${etDate.getFullYear()}-${String(etDate.getMonth() + 1).padStart(2, '0')}-${String(etDate.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(etDate.getHours()).padStart(2, '0')}:${String(etDate.getMinutes()).padStart(2, '0')}`;
      const platforms = JSON.parse(item.platforms || '[]');
      const plat = PLATFORMS.find(p => p.name === platforms[0]);
      return {
        id: `sched-${item.id}`,
        title: item.title || 'Scheduled Post',
        date: dateStr,
        time: timeStr,
        platforms: platforms.map(p => {
          const found = PLATFORMS.find(fp => fp.name === p);
          return found?.id || '';
        }),
        platformIcon: plat?.icon || AccessTime,
        platformColor: '#FF9800',
        isScheduled: true,
        scheduledId: item.id
      };
    });
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const [historyRes, scheduledRes] = await Promise.all([
        socialAPI.getPostHistory(1, 100),
        socialAPI.getScheduledPosts()
      ]);
      const historyItems = historyRes.data.items || [];
      const scheduledItems = scheduledRes.data.items || [];
      setHistoryItems(historyItems);
      const historyEvents = mapHistoryToEvents(historyItems);
      const scheduledEvents = mapScheduledToEvents(scheduledItems);
      setEvents([...historyEvents, ...scheduledEvents]);
    } catch (err) {
      console.error('Calendar history fetch error:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, [mapHistoryToEvents, mapScheduledToEvents]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  useEffect(() => {
    const handler = () => fetchHistory();
    window.addEventListener('refresh-scheduled-posts', handler);
    return () => window.removeEventListener('refresh-scheduled-posts', handler);
  }, [fetchHistory]);

  const goBack = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
  };
  const goNext = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
  };
  const goToday = () => { setYear(today.getFullYear()); setMonth(today.getMonth()); };

  const openSchedule = (y, m, d) => {
    const ds = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setDialogDate(ds);
    setScheduleOpen(true);
  };

  const openDayPopup = (d, other) => {
    if (other) return;
    const evs = getEvs(d, other);
    if (evs.length === 0) {
      openSchedule(year, month, d);
      return;
    }
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    setDayPopupDate(ds);
    setDayPopupEvents(evs);
    setDayPopupOpen(true);
  };

  const handleSave = data => {
    const plat = PLATFORMS.find(p => p.id === data.platforms[0]);
    setEvents(prev => [...prev, {
      id: Date.now(),
      title: data.title,
      date: data.date,
      time: data.time,
      platforms: data.platforms,
      platformIcon: plat?.icon || IconSend,
      platformColor: plat?.color || '#5E35B1',
      contentType: data.contentType || 'video',
      isShort: data.isShort || false,
      isScheduled: true,
    }]);
    fetchHistory();
  };

  const handleDelete = id => setEvents(prev => prev.filter(e => e.id !== id));

  const days = getDaysInMonth(year, month);
  const first = getFirstDayOfMonth(year, month);
  const cells = [];
  const prevDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
  for (let i = first - 1; i >= 0; i--) cells.push({ day: prevDays - i, other: true });
  for (let d = 1; d <= days; d++) cells.push({ day: d, other: false });
  while (cells.length % 7 !== 0) cells.push({ day: cells.length - days - first + 1, other: true });

  const getEvs = (d, other) => {
    if (other) return [];
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    return events.filter(e => e.date === ds).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  };

  const isToday_ = (d, other) => !other && d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Stats for the current month
  const currentMonthEvents = events.filter(e => {
    if (!e.date) return false;
    const [y, m] = e.date.split('-').map(Number);
    return y === year && m === month + 1;
  });
  const scheduledCount = currentMonthEvents.filter(e => !e.isHistory).length;
  const publishedCount = currentMonthEvents.filter(e => e.isHistory).length;

  return (
    <Box sx={{ py: { xs: 1, sm: 2, md: 3 }, width: '100%' }}>
      {/* Header */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        gap: { xs: 0, sm: 0 },
        mb: { xs: 1.5, sm: 3 },
      }}>
        <Box>
          <Typography sx={{
            fontWeight: 800,
            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
            letterSpacing: '-0.5px',
            background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Content Calendar
          </Typography>
          <Typography sx={{
            fontSize: { xs: '0.7rem', sm: '0.85rem' },
            color: 'text.secondary',
            mt: 0.3,
          }}>
            {scheduledCount} scheduled · {publishedCount} published
          </Typography>
        </Box>
        <Button
          onClick={() => { setDialogDate(null); setScheduleOpen(true); }}
          variant="contained"
          startIcon={<Add />}
          sx={{
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
            px: { xs: 2, sm: 3 },
            py: { xs: 0.75, sm: 1 },
            fontSize: { xs: '0.8rem', sm: '0.875rem' },
            boxShadow: '0 4px 14px rgba(94,53,177,0.3)',
            alignSelf: { xs: 'flex-end', sm: 'auto' },
            '&:hover': {
              background: 'linear-gradient(135deg, #4a2c8a, #6a3de8)',
              boxShadow: '0 6px 20px rgba(94,53,177,0.4)',
            },
          }}
        >
          Schedule Post
        </Button>
      </Box>

      {/* Calendar Card */}
      <Paper elevation={0} sx={{
        border: '1px solid',
        borderColor: isDark ? alpha('#fff', 0.08) : alpha('#000', 0.06),
        borderRadius: { xs: '10px', sm: '16px', md: '20px' },
        overflow: 'hidden',
        boxShadow: isDark
          ? '0 4px 24px rgba(0,0,0,0.3)'
          : '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Calendar Navigation */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 1.5, sm: 3 },
          py: { xs: 1, sm: 2 },
          borderBottom: '1px solid',
          borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
          bgcolor: isDark ? alpha('#1e293b', 0.5) : alpha('#fff', 0.8),
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              onClick={goBack}
              size="small"
              sx={{
                bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.03),
                '&:hover': { bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.06) },
              }}
            >
              <ChevronLeft fontSize="small" />
            </IconButton>
            <IconButton
              onClick={goNext}
              size="small"
              sx={{
                bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.03),
                '&:hover': { bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.06) },
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
            <Typography sx={{
              fontWeight: 700,
              fontSize: { xs: '0.8rem', sm: '1rem' },
              minWidth: { xs: 100, sm: 140 },
              color: isDark ? '#f1f5f9' : '#1e293b',
            }}>
              {MONTHS[month]} {year}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Button
              size="small"
              onClick={goToday}
              variant="outlined"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                minWidth: { xs: 50, sm: 60 },
                px: { xs: 1, sm: 1.5 },
                borderColor: isDark ? alpha('#fff', 0.15) : alpha('#000', 0.12),
                color: 'text.primary',
                '&:hover': {
                  borderColor: '#5E35B1',
                  color: isDark ? '#b388ff' : '#5E35B1',
                  bgcolor: isDark ? alpha('#5E35B1', 0.1) : alpha('#5E35B1', 0.04),
                },
              }}
            >
              Today
            </Button>
            <IconButton
              size="small"
              onClick={fetchHistory}
              disabled={loadingEvents}
              sx={{
                bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.03),
                '&:hover': { bgcolor: isDark ? alpha('#fff', 0.1) : alpha('#000', 0.06) },
              }}
            >
              {loadingEvents ? <CircularProgress size={16} /> : <Replay fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        {/* Day Headers */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid',
          borderColor: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.04),
          bgcolor: isDark ? alpha('#1e293b', 0.3) : alpha('#f8f9fa', 0.5),
        }}>
          {DAYS_HEADER.map(d => (
            <Box key={d} sx={{ py: { xs: 0.75, sm: 1.5 }, textAlign: 'center' }}>
              <Typography sx={{
                fontSize: { xs: '0.55rem', sm: '0.72rem' },
                fontWeight: 700,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: { xs: '0.3px', sm: '0.5px' },
              }}>
                {d}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar Grid */}
        {loadingEvents ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {Array.from({ length: 35 }).map((_, idx) => {
              const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
              const borderBottom = idx < 28 ? '1px solid' : 'none';
              return (
                <Box key={idx} sx={{
                  borderRight, borderBottom,
                  borderColor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04),
                  p: { xs: '3px 2px', sm: '6px 6px 4px' },
                  minHeight: { xs: 60, sm: 110 },
                }}>
                  <Box sx={{
                    width: { xs: 16, sm: 26 }, height: { xs: 16, sm: 26 }, borderRadius: '50%',
                    bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.04),
                    ml: 'auto', mb: { xs: '4px', sm: '8px' },
                  }} />
                  <Box sx={{
                    width: '80%', height: { xs: 8, sm: 10 },
                    bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.04),
                    borderRadius: 2, mb: 0.5,
                  }} />
                  <Box sx={{
                    width: '60%', height: { xs: 8, sm: 10 },
                    bgcolor: isDark ? alpha('#fff', 0.05) : alpha('#000', 0.04),
                    borderRadius: 2,
                  }} />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {cells.map(({ day, other }, idx) => {
              const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
              const borderBottom = idx < cells.length - 7 ? '1px solid' : 'none';
              return (
                <Box key={idx} sx={{
                  borderRight, borderBottom,
                  borderColor: isDark ? alpha('#fff', 0.04) : alpha('#000', 0.04),
                  overflow: 'hidden',
                }}>
                  <DayCell
                    day={day}
                    dayEvents={getEvs(day, other)}
                    isToday={isToday_(day, other)}
                    isOtherMonth={other}
                    onClick={d => openDayPopup(d, other)}
                    onEventClick={setDetailEvent}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <ScheduleDialog
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        selectedDate={dialogDate}
        onSave={handleSave}
        historyItems={historyItems}
        loadingHistory={loadingHistory}
      />

      {/* Event Detail Dialog */}
      <Dialog
        open={!!detailEvent}
        onClose={() => setDetailEvent(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: '12px', sm: '16px' },
            bgcolor: isDark ? '#1e293b' : undefined,
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {detailEvent?.platformIcon && (
                <Box sx={{
                  width: 44, height: 44, borderRadius: '12px',
                  bgcolor: alpha(detailEvent.platformColor || '#5E35B1', isDark ? 0.2 : 0.1),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <detailEvent.platformIcon size={22} style={{ color: detailEvent.platformColor || '#5E35B1' }} />
                </Box>
              )}
              <Box>
                <Typography sx={{
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: detailEvent?.platformColor || '#5E35B1',
                }}>
                  {detailEvent?.title}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                  {detailEvent?.date}{detailEvent?.time ? ` · ${toEasternTime(detailEvent.date, detailEvent.time)}` : ''}
                </Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setDetailEvent(null)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>

          {detailEvent?.contentType && (
            <Chip
              size="small"
              label={detailEvent.contentType === 'reel' ? 'Reel/Short' : detailEvent.contentType}
              variant={isDark ? 'outlined' : 'filled'}
              sx={{
                mb: 2,
                ...(isDark
                  ? {
                    bgcolor: detailEvent.contentType === 'reel' ? alpha('#E4405F', 0.15) : alpha('#5E35B1', 0.15),
                    borderColor: detailEvent.contentType === 'reel' ? '#E4405F' : '#5E35B1',
                    color: detailEvent.contentType === 'reel' ? '#f06292' : '#b388ff',
                    fontWeight: 600,
                  }
                  : {
                    bgcolor: detailEvent.contentType === 'reel' ? alpha('#E4405F', 0.1) : alpha('#5E35B1', 0.08),
                    color: detailEvent.contentType === 'reel' ? '#E4405F' : '#5E35B1',
                  })
              }}
            />
          )}

          {detailEvent?.platforms && detailEvent.platforms.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
              {detailEvent.platforms.map(p => {
                const plat = PLATFORMS.find(pl => pl.id === p);
                if (!plat) return null;
                return (
                  <Chip
                    key={p}
                    size="small"
                    icon={<plat.icon size={14} />}
                    label={plat.name}
                    variant={isDark ? 'outlined' : 'filled'}
                    sx={{
                      ...(isDark
                        ? { bgcolor: alpha(plat.color, 0.15), borderColor: plat.color, color: plat.color, fontWeight: 600 }
                        : { bgcolor: alpha(plat.color, 0.08), color: plat.color, fontWeight: 600 })
                    }}
                  />
                );
              })}
            </Box>
          )}

          {detailEvent?.postUrl && (
            <Button
              fullWidth
              variant="contained"
              onClick={() => window.open(detailEvent.postUrl, '_blank')}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)',
                boxShadow: '0 4px 14px rgba(94,53,177,0.25)',
              }}
            >
              View Post
            </Button>
          )}

          {!detailEvent?.isHistory && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button
                onClick={() => { handleDelete(detailEvent.id); setDetailEvent(null); }}
                color="error"
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      </Dialog>

      {/* Day Posts Popup */}
      <Dialog
        open={dayPopupOpen}
        onClose={() => setDayPopupOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: { xs: '12px', sm: '16px' },
            bgcolor: isDark ? '#1e293b' : undefined,
          },
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>
                {new Date(dayPopupDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                {dayPopupEvents.length} post{dayPopupEvents.length > 1 ? 's' : ''}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<Add size={16} />}
                onClick={() => { setDayPopupOpen(false); openSchedule(year, month, parseInt(dayPopupDate.split('-')[2])); }}
                sx={{ textTransform: 'none', fontWeight: 600 }}
              >
                Add
              </Button>
              <IconButton size="small" onClick={() => setDayPopupOpen(false)}>
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </Box>

          <Stack spacing={1.5}>
            {dayPopupEvents.map((ev) => {
              const PlatIcon = ev.platformIcon || IconPhoto;
              const etTime = toEasternTime(ev.date, ev.time);
              return (
                <Box
                  key={ev.id}
                  onClick={() => { setDayPopupOpen(false); setDetailEvent(ev); }}
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: isDark ? alpha('#fff', 0.03) : '#fafbfc',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': {
                      borderColor: ev.isScheduled ? '#FF9800' : (ev.platformColor || '#5E35B1'),
                      bgcolor: isDark ? alpha('#fff', 0.06) : '#f5f3ff',
                    }
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{
                      width: 42, height: 42, borderRadius: 2, flexShrink: 0,
                      bgcolor: ev.isScheduled ? alpha('#FF9800', 0.1) : alpha(ev.platformColor || '#5E35B1', 0.1),
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {ev.isScheduled ? (
                        <AccessTime size={22} style={{ color: '#FF9800' }} />
                      ) : (
                        <PlatIcon size={22} style={{ color: ev.platformColor || '#5E35B1' }} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{ev.title}</Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {etTime && (
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontFamily: 'monospace' }}>
                            {etTime}
                          </Typography>
                        )}
                        {ev.isScheduled && (
                          <Chip label="Scheduled" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#FF9800', 0.1), color: '#FF9800' }} />
                        )}
                        {ev.isHistory && (
                          <Chip label="Published" size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50' }} />
                        )}
                      </Stack>
                    </Box>
                    <ChevronRight size={16} style={{ color: isDark ? '#475569' : '#d1d5db' }} />
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Dialog>
    </Box>
  );
}
