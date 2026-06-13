import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, IconButton, Paper, alpha, useTheme, useMediaQuery, Chip, CircularProgress, Dialog
} from '@mui/material';
import {
  ChevronLeft, ChevronRight, Add, Replay, Close, AccessTime, CalendarToday
} from '@mui/icons-material';
import {
  IconPhoto, IconSend, IconBrandTiktok, IconVideo, IconCheck
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { showSnackbar } from '../../../utils/snackbarNotif';
import { PLATFORMS, DAYS_HEADER, MONTHS } from './constants';
import { getDaysInMonth, getFirstDayOfMonth, formatTime } from './utils';
import EventPill from './components/EventPill';
import ScheduleDialog from './components/ScheduleDialog';
import DayCell from './components/DayCell';

export default function Calendar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const mapHistoryToEvents = useCallback((items) => {
    return items.filter(item => item.success).map(item => {
      const pubDate = new Date(item.publishedAt);
      const dateStr = `${pubDate.getFullYear()}-${String(pubDate.getMonth() + 1).padStart(2, '0')}-${String(pubDate.getDate()).padStart(2, '0')}`;
      const timeStr = `${String(pubDate.getHours()).padStart(2, '0')}:${String(pubDate.getMinutes()).padStart(2, '0')}`;
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

  const fetchHistory = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await socialAPI.getPostHistory(1, 100);
      const items = res.data.items || [];
      setHistoryItems(items);
      setEvents(mapHistoryToEvents(items));
    } catch (err) {
      console.error('Calendar history fetch error:', err);
    } finally {
      setLoadingEvents(false);
    }
  }, [mapHistoryToEvents]);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

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
    }]);
    showSnackbar(`Post scheduled for ${data.date}`, 'success');
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

  return (
    <Box sx={{ p: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography sx={{ fontWeight: 900, fontSize: { xs: '1.6rem', sm: '2rem' }, letterSpacing: '-0.5px' }}>Calendar</Typography>
        <Button onClick={() => { setDialogDate(null); setScheduleOpen(true); }} variant="contained" startIcon={<Add />}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '10px', background: 'linear-gradient(135deg,#5E35B1,#7C4DFF)', px: 2.5, '&:hover': { background: 'linear-gradient(135deg,#4a2c8a,#6a3de8)' } }}>
          Schedule Post
        </Button>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '14px', overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fff' }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{MONTHS[month]} {year}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton size="small" onClick={goBack}><ChevronLeft /></IconButton>
            <Button size="small" onClick={goToday} variant="outlined" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', fontSize: '0.75rem', minWidth: 60, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#5E35B1', color: '#5E35B1' } }}>Today</Button>
            <IconButton size="small" onClick={goNext}><ChevronRight /></IconButton>
            <IconButton size="small" onClick={fetchHistory} disabled={loadingEvents}>
              {loadingEvents ? <CircularProgress size={18} /> : <Replay fontSize="small" />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', borderBottom: '1px solid', borderColor: 'divider' }}>
          {DAYS_HEADER.map(d => (
            <Box key={d} sx={{ py: 1, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: 'text.secondary' }}>{d}</Typography>
            </Box>
          ))}
        </Box>

        {loadingEvents ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {Array.from({ length: 35 }).map((_, idx) => {
              const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
              const borderBottom = idx < 28 ? '1px solid' : 'none';
              return (
                <Box key={idx} sx={{ borderRight, borderBottom, borderColor: 'divider', p: '6px 6px 4px', minHeight: 110 }}>
                  <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: '#f0f0f0', ml: 'auto', mb: '8px' }} />
                  <Box sx={{ width: '80%', height: 12, bgcolor: '#f0f0f0', borderRadius: 2, mb: 0.5 }} />
                  <Box sx={{ width: '60%', height: 12, bgcolor: '#f0f0f0', borderRadius: 2 }} />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
            {cells.map(({ day, other }, idx) => {
              const borderRight = (idx + 1) % 7 !== 0 ? '1px solid' : 'none';
              const borderBottom = idx < cells.length - 7 ? '1px solid' : 'none';
              return (
                <Box key={idx} sx={{ borderRight, borderBottom, borderColor: 'divider' }}>
                  <DayCell
                    day={day} dayEvents={getEvs(day, other)}
                    isToday={isToday_(day, other)} isOtherMonth={other}
                    onClick={d => !other && openSchedule(year, month, d)}
                    onEventClick={setDetailEvent}
                  />
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <ScheduleDialog open={scheduleOpen} onClose={() => setScheduleOpen(false)} selectedDate={dialogDate} onSave={handleSave}
        historyItems={historyItems} loadingHistory={loadingHistory} />

      <Dialog open={!!detailEvent} onClose={() => setDetailEvent(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {detailEvent?.platformIcon && (
                <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: alpha(detailEvent.platformColor || '#5E35B1', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <detailEvent.platformIcon size={20} style={{ color: detailEvent.platformColor || '#5E35B1' }} />
                </Box>
              )}
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: detailEvent?.platformColor || '#5E35B1' }}>{detailEvent?.title}</Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{detailEvent?.date}{detailEvent?.time ? ` · ${formatTime(detailEvent.time)}` : ''}</Typography>
              </Box>
            </Box>
            <IconButton size="small" onClick={() => setDetailEvent(null)}><Close fontSize="small" /></IconButton>
          </Box>
          {detailEvent?.contentType && (
            <Chip size="small" label={detailEvent.contentType === 'reel' ? 'Reel/Short' : detailEvent.contentType}
              sx={{ mb: 2, bgcolor: detailEvent.contentType === 'reel' ? alpha('#E4405F', 0.1) : alpha('#5E35B1', 0.08), color: detailEvent.contentType === 'reel' ? '#E4405F' : '#5E35B1' }} />
          )}
          {detailEvent?.platforms && detailEvent.platforms.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
              {detailEvent.platforms.map(p => {
                const plat = PLATFORMS.find(pl => pl.id === p);
                if (!plat) return null;
                return (
                  <Chip key={p} size="small" icon={<plat.icon size={12} />} label={plat.name}
                    sx={{ bgcolor: alpha(plat.color, 0.08), color: plat.color, fontWeight: 600 }} />
                );
              })}
            </Box>
          )}
          {detailEvent?.postUrl && (
            <Button fullWidth variant="contained" onClick={() => window.open(detailEvent.postUrl, '_blank')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', background: 'linear-gradient(135deg,#5E35B1,#7C4DFF)' }}>
              View Post
            </Button>
          )}
          {!detailEvent?.isHistory && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
              <Button onClick={() => { handleDelete(detailEvent.id); setDetailEvent(null); }} color="error" sx={{ textTransform: 'none', fontWeight: 600 }}>Delete</Button>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
