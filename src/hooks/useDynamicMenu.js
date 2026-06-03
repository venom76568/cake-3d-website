import { useState, useCallback } from 'react';
import { menuData } from '../data/menuData';

const STORAGE_KEY = 'cakeshop_admin_cakes';

function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(cakes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cakes));
}

/**
 * Hook for managing the dynamic cake menu.
 * Static menuData.js is the seed — cannot be deleted.
 * Admin-added cakes live in localStorage and are merged in.
 */
export function useDynamicMenu() {
  const [dynamicCakes, setDynamicCakes] = useState(readFromStorage);

  const allCakes = [...menuData, ...dynamicCakes];

  const addCake = useCallback((cakeData) => {
    const newCake = {
      ...cakeData,
      id: `admin-${Date.now()}`,
      isAdminAdded: true,
    };
    setDynamicCakes((prev) => {
      const updated = [...prev, newCake];
      writeToStorage(updated);
      return updated;
    });
    return newCake;
  }, []);

  const deleteCake = useCallback((id) => {
    // Prevent deletion of static seed cakes
    if (!id.startsWith('admin-')) return;
    setDynamicCakes((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      writeToStorage(updated);
      return updated;
    });
  }, []);

  const updateCake = useCallback((id, updates) => {
    if (!id.startsWith('admin-')) return;
    setDynamicCakes((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      writeToStorage(updated);
      return updated;
    });
  }, []);

  return { allCakes, dynamicCakes, addCake, deleteCake, updateCake };
}
