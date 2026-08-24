import { createContext, useContext, useEffect, useState } from 'react';

const ConnectionContext = createContext({ isOffline: false });

export const NETWORK_EVENT = 'app:network';

export function ConnectionProvider({ children }) {
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  useEffect(() => {
    const handleBrowserOffline = () => setIsOffline(true);
    const handleBrowserOnline = () => setIsOffline(false);
    const handleApiNetwork = (e) => setIsOffline(!e.detail?.online);

    window.addEventListener('offline', handleBrowserOffline);
    window.addEventListener('online', handleBrowserOnline);
    window.addEventListener(NETWORK_EVENT, handleApiNetwork);

    return () => {
      window.removeEventListener('offline', handleBrowserOffline);
      window.removeEventListener('online', handleBrowserOnline);
      window.removeEventListener(NETWORK_EVENT, handleApiNetwork);
    };
  }, []);

  return <ConnectionContext.Provider value={{ isOffline }}>{children}</ConnectionContext.Provider>;
}

export const useConnection = () => useContext(ConnectionContext);