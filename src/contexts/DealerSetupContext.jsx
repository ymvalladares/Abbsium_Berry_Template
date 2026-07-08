import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { dealerAPI } from '../services/AxiosService';

const DealerSetupContext = createContext(null);

export const DealerSetupProvider = ({ children }) => {
  const { user } = useAuth();
  const [dealer, setDealer] = useState(null);
  const [dealerLoading, setDealerLoading] = useState(true);
  const [setupComplete, setSetupComplete] = useState(false);

  const isDealer = user?.rol === 'Dealer';

  const checkDealerStatus = useCallback(async () => {
    if (!isDealer) {
      setDealerLoading(false);
      return;
    }

    // Primero intenta desde localStorage
    const storedDealerId = localStorage.getItem('dealerId');
    if (storedDealerId) {
      try {
        const response = await dealerAPI.getById(storedDealerId);
        if (response.data) {
          setDealer(response.data);
          setSetupComplete(true);
          setDealerLoading(false);
          return;
        }
      } catch {
        localStorage.removeItem('dealerId');
      }
    }

    // Si no hay en localStorage, consulta la DB por el user logueado
    try {
      const response = await dealerAPI.getMyDealer();
      if (response.data) {
        setDealer(response.data);
        localStorage.setItem('dealerId', response.data.id);
        setSetupComplete(true);
        setDealerLoading(false);
        return;
      }
    } catch {
      // Error de red o auth
    }

    setDealer(null);
    setSetupComplete(false);
    setDealerLoading(false);
  }, [isDealer]);

  useEffect(() => {
    checkDealerStatus();
  }, [checkDealerStatus]);

  const handleDealerCreated = (newDealer) => {
    setDealer(newDealer);
    localStorage.setItem('dealerId', newDealer.id);
    setSetupComplete(true);
  };

  const hasDealer = !!dealer && setupComplete;

  const value = {
    dealer,
    hasDealer,
    dealerLoading,
    handleDealerCreated,
    checkDealerStatus,
    isDealer
  };

  return (
    <DealerSetupContext.Provider value={value}>
      {children}
    </DealerSetupContext.Provider>
  );
};

export const useDealerSetup = () => useContext(DealerSetupContext);
