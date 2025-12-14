import { RouterProvider } from 'react-router-dom';
import router from 'routes';

import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { AuthProvider } from './contexts/AuthContext';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { setSnackbarRef } from './utils/snackbarNotif';

function SnackbarInitializer() {
  const { enqueueSnackbar } = useSnackbar();
  setSnackbarRef(enqueueSnackbar);
  return null;
}

export default function App() {
  return (
    <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} autoHideDuration={3000}>
      <SnackbarInitializer />
      <ThemeCustomization>
        <NavigationScroll>
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </NavigationScroll>
      </ThemeCustomization>
    </SnackbarProvider>
  );
}
