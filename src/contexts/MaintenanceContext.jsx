import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'https://localhost:44328';

const MaintenanceContext = createContext();

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider = ({ children }) => {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState(null);
  const [maintenanceStartedAt, setMaintenanceStartedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/SiteSettings`);
      setIsUnderMaintenance(response.data.isUnderMaintenance);
      setMaintenanceMessage(response.data.maintenanceMessage);
      setMaintenanceStartedAt(response.data.maintenanceStartedAt);
    } catch (error) {
      console.error('Failed to fetch maintenance settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
    const interval = setInterval(fetchSettings, 60000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  const setMaintenance = async (value) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${BASE_URL}/SiteSettings`,
        { isUnderMaintenance: value, maintenanceMessage: null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsUnderMaintenance(response.data.isUnderMaintenance);
      setMaintenanceMessage(response.data.maintenanceMessage);
      setMaintenanceStartedAt(response.data.maintenanceStartedAt);
      return response.data;
    } catch (error) {
      console.error('Failed to update maintenance settings:', error);
      throw error;
    }
  };

  const toggleMaintenance = async () => {
    return await setMaintenance(!isUnderMaintenance);
  };

  return (
    <MaintenanceContext.Provider
      value={{
        isUnderMaintenance,
        maintenanceMessage,
        maintenanceStartedAt,
        loading,
        toggleMaintenance,
        setMaintenance,
        refresh: fetchSettings
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};
