import ErrorLayout from './ErrorLayout';
import { LockRounded } from '@mui/icons-material';

export default function Unauthorized() {
  return (
    <ErrorLayout
      code="401"
      title="Unauthorized"
      message="You don't have permission to access this area. Please log in with the appropriate credentials or contact your administrator."
      icon={<LockRounded sx={{ fontSize: '4rem' }} />}
      color="#ef4444"
    />
  );
}
