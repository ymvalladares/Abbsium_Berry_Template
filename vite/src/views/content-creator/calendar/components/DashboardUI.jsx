import { useState } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { CalendarCore } from './CalendarCore';

const MOCK_EVENTS = [
  { id: 1, date: '2026-06-15', title: 'Lorem ipsum...', color: '#E3F2FD', textColor: '#1565C0' }
];

export default function DashboardUI() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <Box sx={{ p: 4, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Promotional Posts</Typography>
        <Button variant="contained" color="error" sx={{ borderRadius: 2 }}>+ New Post</Button>
      </Box>

      {/* Stats Cards (Simplificadas para mantener enfoque en calendar) */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        {['Post Views', 'Post Clicks', 'Active Posts'].map((label) => (
          <Paper key={label} sx={{ p: 2, flex: 1, borderRadius: 3 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>1247</Typography>
          </Paper>
        ))}
      </Box>

      <Paper sx={{ p: 3, borderRadius: 4 }}>
        <CalendarCore currentDate={currentDate} setCurrentDate={setCurrentDate} events={MOCK_EVENTS} />
      </Paper>
    </Box>
  );
}
