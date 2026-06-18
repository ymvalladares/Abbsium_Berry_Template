import { RouterProvider } from 'react-router-dom';
import router from 'routes';

import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { AuthProvider } from './contexts/AuthContext';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { setSnackbarRef } from './utils/snackbarNotif';
import { FiltersProvider } from './contexts/FiltersContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

function SnackbarInitializer() {
  const { enqueueSnackbar } = useSnackbar();
  setSnackbarRef(enqueueSnackbar);
  return null;
}

export default function App() {
  return (
    <ThemeCustomization>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
        hideIconVariant
        ComponentsProps={{
          Snackbar: {
            sx: {
              '& .SnackbarItem-contentRoot': {
                borderRadius: '12px !important',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                fontSize: '0.85rem',
                fontWeight: 500,
                padding: '6px 16px',
                color: 'text.primary',
                background: 'background.paper !important',
              },
              '& .SnackbarItem-variantSuccess': {
                borderLeft: '4px solid #10b981',
              },
              '& .SnackbarItem-variantError': {
                borderLeft: '4px solid #ef4444',
              },
              '& .SnackbarItem-variantWarning': {
                borderLeft: '4px solid #f59e0b',
              },
              '& .SnackbarItem-variantInfo, & .SnackbarItem-variantDefault': {
                borderLeft: '4px solid #0EA5E9',
              },
            },
          },
        }}
      >
        <SnackbarInitializer />
        <NavigationScroll>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <AuthProvider>
              <FiltersProvider>
                <RouterProvider router={router} />
              </FiltersProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </NavigationScroll>
      </SnackbarProvider>
    </ThemeCustomization>
  );
}
