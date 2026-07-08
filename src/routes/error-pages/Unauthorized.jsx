import ErrorLayout from './ErrorLayout';
import { LockRounded, PersonRounded } from '@mui/icons-material';
import { Box } from '@mui/material';

export default function Unauthorized() {
  return (
    <ErrorLayout
      code="401"
      title="Unauthorized Access"
      message="You don't have permission to access this resource. Please log in with the appropriate credentials or contact your administrator for assistance."
      icon={
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <LockRounded sx={{ fontSize: '2.5rem' }} />
          <PersonRounded sx={{ fontSize: '1.5rem', opacity: 0.7 }} />
        </Box>
      }
      color="#ef4444"
    />
  );
}