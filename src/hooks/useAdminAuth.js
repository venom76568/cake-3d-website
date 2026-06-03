import { useState, useCallback } from 'react';

const SESSION_KEY = 'cakeshop_admin_auth';
// Password is read from Vite env var — set in .env.local, never committed to git
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

/**
 * Simple client-side auth for the single-owner admin panel.
 * Session persists across page refreshes (sessionStorage) but resets on tab close.
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  });
  const [error, setError] = useState('');

  const login = useCallback((password) => {
    if (!ADMIN_PASSWORD) {
      setError('Admin password not configured. Please set VITE_ADMIN_PASSWORD in .env.local');
      return false;
    }
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setIsAuthenticated(true);
      setError('');
      return true;
    }
    setError('Incorrect password. Please try again.');
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout, error };
}
