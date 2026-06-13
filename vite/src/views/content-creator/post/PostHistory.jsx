import { useState, useEffect } from 'react';
import { Box, Typography, Stack, Chip, IconButton, Tooltip, Skeleton, Divider } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconRefresh,
  IconExternalLink,
  IconAlertCircle,
  IconCheck,
  IconClock,
  IconChevronLeft,
  IconChevronRight,
  IconCalendarEvent
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';

const PLATFORM_ICONS = {
  Facebook: IconBrandFacebook,
  Instagram: IconBrandInstagram,
  YouTube: IconBrandYoutube,
  TikTok: IconBrandTiktok,
  X: IconBrandTwitter,
  Twitter: IconBrandTwitter,
  LinkedIn: IconBrandLinkedin,
  Pinterest: IconBrandPinterest
};

const PLATFORM_COLORS = {
  Facebook: '#1877F2',
  Instagram: '#E4405F',
  YouTube: '#FF0000',
  TikTok: '#010101',
  X: '#1DA1F2',
  Twitter: '#1DA1F2',
  LinkedIn: '#0A66C2',
  Pinterest: '#E60023'
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const getDateGroupLabel = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (itemDate.getTime() === today.getTime()) return 'Today';
  if (itemDate.getTime() === yesterday.getTime()) return 'Yesterday';
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
};

const PostCard = ({ item }) => {
  const PlatformIcon = PLATFORM_ICONS[item.platform] || IconExternalLink;
  const platformColor = PLATFORM_COLORS[item.platform] || '#999';

  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 2,
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.15s ease',
        '&:hover': {
          borderColor: alpha('#5E35B1', 0.15),
          boxShadow: `0 4px 12px ${alpha('#5E35B1', 0.04)}`
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            bgcolor: alpha(platformColor, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
        >
          <PlatformIcon size={14} style={{ color: platformColor }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.25 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{item.platform}</Typography>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.success ? '#4CAF50' : '#f44336' }} />
          </Stack>

          {item.success && item.postUrl ? (
            <Box
              component="a"
              href={item.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontSize: '0.65rem',
                color: '#5E35B1',
                textDecoration: 'none',
                fontWeight: 500,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              View post
            </Box>
          ) : !item.success && item.errorMessage ? (
            <Typography sx={{ fontSize: '0.65rem', color: '#f44336', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.errorMessage}
            </Typography>
          ) : null}

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
            <IconClock size={10} style={{ color: '#bbb' }} />
            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{formatTime(item.publishedAt)}</Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default function PostHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(18);
  const [total, setTotal] = useState(0);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await socialAPI.getPostHistory(page + 1, pageSize);
      setHistory(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      setError('Failed to load history');
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  const groupByDate = (items) => {
    const groups = {};
    items.forEach((item) => {
      if (!item.publishedAt) return;
      const key = new Date(item.publishedAt).toISOString().split('T')[0];
      if (!groups[key]) {
        groups[key] = { label: getDateGroupLabel(item.publishedAt), items: [] };
      }
      groups[key].items.push(item);
    });
    return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const groupedHistory = groupByDate(history);
  const successCount = history.filter((i) => i.success).length;
  const failCount = history.length - successCount;

  if (loading && history.length === 0) {
    return (
      <Box sx={{ py: 3, px: { xs: 1.5, sm: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 680, md: 900, lg: 1000 } }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={80} sx={{ borderRadius: 2 }} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3, px: { xs: 1.5, sm: 2, md: 3 }, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: { xs: '100%', sm: 680, md: 900, lg: 1000 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <IconCalendarEvent size={22} style={{ color: '#5E35B1' }} />
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.2 }}>Publish History</Typography>
              <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                {total} total · {successCount} published · {failCount} failed
              </Typography>
            </Box>
          </Stack>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchHistory} disabled={loading} sx={{ color: '#5E35B1' }}>
              <IconRefresh size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        {error && (
          <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: alpha('#f44336', 0.04), border: '1px solid', borderColor: alpha('#f44336', 0.12), mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconAlertCircle size={16} style={{ color: '#f44336' }} />
              <Typography sx={{ color: '#f44336', fontSize: '0.8rem' }}>{error}</Typography>
            </Stack>
          </Box>
        )}

        {history.length === 0 ? (
          <Box sx={{ p: 5, borderRadius: 3, border: '1px solid', borderColor: 'divider', textAlign: 'center', bgcolor: 'white' }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha('#5E35B1', 0.06), display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 1.5 }}>
              <IconExternalLink size={24} style={{ color: '#5E35B1' }} />
            </Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.25 }}>No publications yet</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>Your publish history will appear here</Typography>
          </Box>
        ) : (
          <>
            {/* Cards grouped by date */}
            {groupedHistory.map(([dateKey, group]) => (
              <Box key={dateKey} sx={{ mb: 2.5 }}>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#5E35B1', letterSpacing: 0.3 }}>
                    {group.label}
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
                  <Chip
                    label={`${group.items.length} post${group.items.length > 1 ? 's' : ''}`}
                    size="small"
                    sx={{ height: 20, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.06), color: '#5E35B1' }}
                  />
                </Stack>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 1.25
                  }}
                >
                  {group.items.map((item) => (
                    <PostCard key={item.id} item={item} />
                  ))}
                </Box>
              </Box>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <IconButton onClick={() => page > 0 && setPage((p) => p - 1)} disabled={page === 0} size="small" sx={{ color: '#5E35B1', '&:disabled': { opacity: 0.3 } }}>
                    <IconChevronLeft size={18} />
                  </IconButton>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const pageNum = i;
                    const isActive = pageNum === page;
                    return (
                      <Box
                        key={i}
                        onClick={() => setPage(pageNum)}
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          bgcolor: isActive ? '#5E35B1' : 'white',
                          color: isActive ? 'white' : 'text.secondary',
                          border: '1px solid',
                          borderColor: isActive ? '#5E35B1' : 'divider',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {pageNum + 1}
                      </Box>
                    );
                  })}
                  <IconButton onClick={() => page < totalPages - 1 && setPage((p) => p + 1)} disabled={page >= totalPages - 1} size="small" sx={{ color: '#5E35B1', '&:disabled': { opacity: 0.3 } }}>
                    <IconChevronRight size={18} />
                  </IconButton>
                </Stack>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
