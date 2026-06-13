import { Box, Typography, Tooltip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { IconPhoto } from '@tabler/icons-react';
import { formatTime } from '../utils';

export default function EventPill({ event, onClick, compact }) {
  const isScheduled = !event.isHistory;
  const borderColor = isScheduled ? '#5E35B1' : event.platformColor || '#4CAF50';
  const bgColor = isScheduled ? alpha('#5E35B1', 0.06) : alpha(event.platformColor || '#4CAF50', 0.06);
  const Icon = event.platformIcon || IconPhoto;

  return (
    <Tooltip title={`${event.title}${event.time ? ' · ' + formatTime(event.time) : ''}`} arrow>
      <Box
        onClick={(e) => {
          e.stopPropagation();
          onClick(event);
        }}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          bgcolor: bgColor,
          borderLeft: `3px solid ${borderColor}`,
          borderRadius: '4px',
          px: '5px',
          py: compact ? '1px' : '2px',
          mb: '2px',
          cursor: 'pointer',
          overflow: 'hidden',
          '&:hover': { filter: 'brightness(0.94)' }
        }}
      >
        <Icon size={10} style={{ color: borderColor, flexShrink: 0 }} />
        <Typography
          sx={{
            fontSize: compact ? '0.6rem' : '0.65rem',
            fontWeight: 600,
            color: borderColor,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            lineHeight: 1.5
          }}
        >
          {event.time ? `${formatTime(event.time)} ` : ''}
          {event.title}
        </Typography>
      </Box>
    </Tooltip>
  );
}
