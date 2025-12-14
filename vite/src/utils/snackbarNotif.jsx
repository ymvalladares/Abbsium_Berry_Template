let snackbarRef = null;

export const setSnackbarRef = (enqueueFn) => {
  snackbarRef = enqueueFn;
};

export const showSnackbar = (msg, variant = 'default') => {
  if (snackbarRef) {
    snackbarRef(msg, { variant });
  }
};
