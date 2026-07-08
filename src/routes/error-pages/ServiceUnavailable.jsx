import ErrorLayout from './ErrorLayout';
import { CloudOffRounded, CloudQueueRounded } from '@mui/icons-material';
import { Box } from '@mui/material';

export default function ServiceUnavailable() {
  return (
    <ErrorLayout
      code="503"
      title="Service Unavailable"
      message="Our servers are temporarily down for maintenance or experiencing high traffic. Please try again in a few minutes. We appreciate your patience."
      icon={
        <Box sx={{ position: 'relative' }}>
          <CloudQueueRounded sx={{ fontSize: '2.8rem', opacity: 0.4, position: 'absolute', top: -8, left: 8 }} />
          <CloudOffRounded sx={{ fontSize: '3.5rem' }} />
        </Box>
      }
      color="#f59e0b"
    />
  );
}