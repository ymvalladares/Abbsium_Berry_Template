import ErrorLayout from './ErrorLayout';
import { ConstructionRounded } from '@mui/icons-material';

export default function UnderMaintenance() {
  return (
    <ErrorLayout
      title="Under Maintenance"
      message="We're currently performing scheduled maintenance to improve your experience. We'll be back shortly. Thank you for your patience."
      icon={<ConstructionRounded sx={{ fontSize: '4rem' }} />}
      color="#f59e0b"
    />
  );
}
