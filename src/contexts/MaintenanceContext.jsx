import { createContext, useContext, useState, useEffect } from 'react';

const MaintenanceContext = createContext();

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within MaintenanceProvider');
  }
  return context;
};

export const MaintenanceProvider = ({ children }) => {
  const [isUnderMaintenance, setIsUnderMaintenance] = useState(() => {
    const stored = localStorage.getItem('MAINTENANCE_MODE');
    if (stored !== null) {
      return stored === 'true';
    }
    return import.meta.env.VITE_MAINTENANCE_MODE === 'true';
  });

  const toggleMaintenance = () => {
    setIsUnderMaintenance((prev) => {
      const newValue = !prev;
      localStorage.setItem('MAINTENANCE_MODE', String(newValue));
      return newValue;
    });
  };

  const setMaintenance = (value) => {
    setIsUnderMaintenance(value);
    localStorage.setItem('MAINTENANCE_MODE', String(value));
  };

  useEffect(() => {
    console.log(`🔧 Maintenance mode: ${isUnderMaintenance ? 'ON' : 'OFF'}`);
  }, [isUnderMaintenance]);

  return (
    <MaintenanceContext.Provider value={{ isUnderMaintenance, toggleMaintenance, setMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};
