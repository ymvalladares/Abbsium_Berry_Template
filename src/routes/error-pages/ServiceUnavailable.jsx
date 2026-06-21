import ErrorLayout from './ErrorLayout';
import { CloudOffRounded } from '@mui/icons-material';

export default function ServiceUnavailable() {
  return (
    <ErrorLayout
      code="503"
      title="Service Unavailable"
      message="Our servers are temporarily down for maintenance or experiencing high traffic. Please try again in a few minutes."
      icon={<CloudOffRounded sx={{ fontSize: '4rem' }} />}
      color="#f59e0b"
    />
  );
}
