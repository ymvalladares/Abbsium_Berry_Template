const STORAGE_KEY = 'abbsium_chat_pins';

export const getPinnedIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const togglePin = (id) => {
  const pins = getPinnedIds();
  const updated = pins.includes(id) ? pins.filter((p) => p !== id) : [id, ...pins];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const isPinned = (id) => getPinnedIds().includes(id);
