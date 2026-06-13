import { Box, Typography } from '@mui/material';

export const EventPill = ({ title, color, textColor }) => (
  <Box sx={{ 
    bgcolor: color, 
    color: textColor, 
    p: '4px 8px', 
    borderRadius: '4px', 
    fontSize: '0.75rem', 
    fontWeight: 600, 
    mb: 0.5, 
    overflow: 'hidden', 
    textOverflow: 'ellipsis', 
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    '&:hover': { filter: 'brightness(0.95)' }
  }}>
    {title}
  </Box>
);
