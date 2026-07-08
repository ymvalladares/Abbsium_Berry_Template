import ErrorLayout from './ErrorLayout';
import { ConstructionRounded, BuildRounded } from '@mui/icons-material';
import { Box } from '@mui/material';

export default function UnderMaintenance() {
  return (
    <ErrorLayout
      title="Under Maintenance"
      message="We're currently performing scheduled maintenance to improve your experience. We'll be back shortly. Thank you for your patience."
      icon={
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <ConstructionRounded sx={{ fontSize: '2.5rem' }} />
          <BuildRounded sx={{ fontSize: '2rem', opacity: 0.6, alignSelf: 'flex-end', mb: 0.5 }} />
        </Box>
      }
      color="#f59e0b"
    />
  );
}