import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import NotFound from './NotFound';
import Unauthorized from './Unauthorized';
import ServiceUnavailable from './ServiceUnavailable';
import UnderMaintenance from './UnderMaintenance';
import ErrorLayout from './ErrorLayout';
import { BugReportRounded } from '@mui/icons-material';

const ERROR_MAP = {
  404: { component: NotFound },
  401: { component: Unauthorized },
  503: { component: ServiceUnavailable }
};

export function ErrorPage() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    const entry = ERROR_MAP[error.status];
    if (entry) {
      const Component = entry.component;
      return <Component />;
    }

    if (error.status === 418) {
      return (
        <ErrorLayout
          code="418"
          title="I'm a Teapot"
          message="The server refuses to brew coffee because it is, permanently, a teapot. Contact your administrator if you believe this is an error."
          icon={<BugReportRounded sx={{ fontSize: '4rem' }} />}
          color="#8b5cf6"
        />
      );
    }
  }

  return <UnderMaintenance />;
}

export { default as NotFound } from './NotFound';
export { default as Unauthorized } from './Unauthorized';
export { default as ServiceUnavailable } from './ServiceUnavailable';
export { default as UnderMaintenance } from './UnderMaintenance';
