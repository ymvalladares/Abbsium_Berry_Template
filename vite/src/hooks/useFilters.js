import { useMemo, useState } from 'react';
import { FiltersContext } from '../contexts/FiltersContext';

export const useFilters = (entityKey, initialFilters, data) => {
  const { filtersByKey, setEntityFilters } = FiltersContext();

  const [localFilters, setLocalFilters] = useState(filtersByKey[entityKey] || initialFilters);

  const filters = filtersByKey[entityKey] || localFilters;

  const setFilters = (updater) => {
    const next = typeof updater === 'function' ? updater(filters) : updater;

    setLocalFilters(next);
    setEntityFilters(entityKey, next);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data.filter((item) => {
      for (const key in filters) {
        const value = filters[key];
        if (!value) continue;

        if (typeof value === 'string') {
          const field = String(item[key] ?? '').toLowerCase();
          if (!field.includes(value.toLowerCase())) return false;
        } else {
          if (item[key] !== value) return false;
        }
      }
      return true;
    });
  }, [data, filters]);

  return {
    filters,
    setFilters,
    filteredData
  };
};
