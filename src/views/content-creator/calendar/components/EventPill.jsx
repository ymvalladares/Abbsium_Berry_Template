import { Box, Typography, Tooltip } from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import { IconPhoto } from '@tabler/icons-react';
import { formatTime } from '../utils';

export default function EventPill({ event, onClick, compact }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isScheduled = !event.isHistory;
  const platformColor = event.platformColor || '#4CAF50';
  const Icon = event.platformIcon || IconPhoto;

  const bgColor = isScheduled
    ? (isDark ? alpha('#5E35B1', 0.15) : alpha('#5E35B1', 0.08))
    : (isDark ? alpha(platformColor, 0.12) : alpha(platformColor, 0.06));

  const textColor = isScheduled
    ? (isDark ? '#b388ff' : '#5E35B1')
    : (isDark ? platformColor : platformColor);

  return (
    <Tooltip title={`${event.title}${event.time ? ' · ' + formatTime(event.time) : ''}`} arrow>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick(event);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          bgcolor: bgColor,
          borderRadius: '6px',
          px: '6px',
          py: compact ? '2px' : '3px',
          mb: '2px',
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          transition: 'all 0.15s ease',
          border: `1px solid ${alpha(platformColor, isDark ? 0.25 : 0.15)}`,
          '&:hover': {
            bgcolor: isDark ? alpha(platformColor, 0.2) : alpha(platformColor, 0.12),
            transform: 'translateX(2px)',
            boxShadow: `0 2px 6px ${alpha(platformColor, 0.2)}`,
          },
        }}
      >
        {/* Platform indicator dot */}
        <Box sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: platformColor,
          flexShrink: 0,
          boxShadow: `0 0 4px ${alpha(platformColor, 0.5)}`,
        }} />

        {/* Platform icon */}
        <Icon size={11} style={{ color: textColor, flexShrink: 0 }} />

        {/* Time badge (if exists) */}
        {event.time && (
          <Typography sx={{
            fontSize: compact ? '0.55rem' : '0.6rem',
            fontWeight: 600,
            color: isDark ? alpha('#fff', 0.6) : alpha('#000', 0.5),
            fontFamily: 'monospace',
            flexShrink: 0,
          }}>
            {formatTime(event.time)}
          </Typography>
        )}

        {/* Title */}
        <Typography
          sx={{
            fontSize: compact ? '0.6rem' : '0.65rem',
            fontWeight: 600,
            color: textColor,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: 1.4,
            flex: 1,
            minWidth: 0,
          }}
        >
          {event.title}
        </Typography>

        {/* Status indicator for scheduled */}
        {isScheduled && (
          <Box sx={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            bgcolor: '#5E35B1',
            flexShrink: 0,
            animation: 'pulse 2s infinite',
          }} />
        )}
      </Box>
    </Tooltip>
  );
}
