import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from 'routes';

import NavigationScroll from 'layout/NavigationScroll';
import ThemeCustomization from 'themes';
import { AuthProvider } from './contexts/AuthContext';

import { SnackbarProvider, useSnackbar } from 'notistack';
import { setSnackbarRef } from './utils/snackbarNotif';
import { FiltersProvider } from './contexts/FiltersContext';

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
            <FiltersProvider>
              <RouterProvider router={router} />
            </FiltersProvider>
          </AuthProvider>
        </NavigationScroll>
      </ThemeCustomization>
    </SnackbarProvider>
  );
}
